require("dotenv/config");
const express = require("express");
const { PrismaClient } = require("@prisma/client");

const app = express();
const prisma = new PrismaClient();

app.use(express.json());

function normalizeLanguages(input) {
  if (Array.isArray(input)) {
    return input.map((lang) => String(lang).trim()).filter(Boolean).join(",");
  }
  if (typeof input === "string") {
    return input
      .split(",")
      .map((lang) => lang.trim())
      .filter(Boolean)
      .join(",");
  }
  return "";
}

function splitLanguages(value) {
  return String(value)
    .split(",")
    .map((lang) => lang.trim())
    .filter(Boolean);
}

app.get("/userlanguages", async (req, res) => {
  try {
    const users = await prisma.userLanguage.findMany({ orderBy: { id: "asc" } });
    res.json(users);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch users" });
  }
});

app.get("/userlanguages/:language", async (req, res) => {
  try {
    const target = req.params.language.trim().toLowerCase();
    const users = await prisma.userLanguage.findMany({ orderBy: { id: "asc" } });
    const filtered = users.filter((user) =>
      splitLanguages(user.languages).some((lang) => lang.toLowerCase() === target)
    );
    res.json(filtered);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch users by language" });
  }
});

app.post("/userlanguages", async (req, res) => {
  try {
    const { name, email, languages, age } = req.body;

    if (!name || !email || languages === undefined || age === undefined) {
      return res.status(400).json({
        error: "name, email, languages, and age are required",
      });
    }

    const normalizedLanguages = normalizeLanguages(languages);
    if (!normalizedLanguages) {
      return res.status(400).json({ error: "languages must not be empty" });
    }

    const parsedAge = Number(age);
    if (!Number.isInteger(parsedAge) || parsedAge < 0) {
      return res.status(400).json({ error: "age must be a non-negative integer" });
    }

    const created = await prisma.userLanguage.create({
      data: {
        name: String(name).trim(),
        email: String(email).trim().toLowerCase(),
        languages: normalizedLanguages,
        age: parsedAge,
      },
    });

    return res.status(201).json(created);
  } catch (error) {
    if (error && error.code === "P2002") {
      return res.status(409).json({ error: "email must be unique" });
    }
    return res.status(500).json({ error: "Failed to create user" });
  }
});

app.patch("/userlanguages/:email/languages", async (req, res) => {
  try {
    const { languages } = req.body;
    const normalizedLanguages = normalizeLanguages(languages);

    if (!normalizedLanguages) {
      return res.status(400).json({ error: "languages must be a non-empty string or string array" });
    }

    const updated = await prisma.userLanguage.update({
      where: { email: req.params.email.toLowerCase() },
      data: { languages: normalizedLanguages },
    });

    return res.json(updated);
  } catch (error) {
    if (error && error.code === "P2025") {
      return res.status(404).json({ error: "User not found for this email" });
    }
    return res.status(500).json({ error: "Failed to update user languages" });
  }
});

app.delete("/userlanguages/under-18", async (req, res) => {
  try {
    const result = await prisma.userLanguage.deleteMany({
      where: { age: { lt: 18 } },
    });
    res.json({ deletedCount: result.count });
  } catch (error) {
    res.status(500).json({ error: "Failed to delete under-18 users" });
  }
});

app.use((req, res) => {
  res.status(404).json({ error: "Route not found" });
});

const port = Number(process.env.PORT) || 3000;
const server = app.listen(port, () => {
  console.log(`API running on http://localhost:${port}`);
});

async function shutdown() {
  await prisma.$disconnect();
  server.close(() => process.exit(0));
}

process.on("SIGINT", shutdown);
process.on("SIGTERM", shutdown);
