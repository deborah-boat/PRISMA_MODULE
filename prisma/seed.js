const { PrismaClient } = require("@prisma/client");

const prisma = new PrismaClient();

const users = [
  { name: "Aarav Mehta", email: "aarav.mehta@example.com", languages: "English,Hindi", age: 24 },
  { name: "Maya Singh", email: "maya.singh@example.com", languages: "English,Hindi,Punjabi", age: 28 },
  { name: "Ethan Clark", email: "ethan.clark@example.com", languages: "English,Spanish", age: 31 },
  { name: "Sofia Ramirez", email: "sofia.ramirez@example.com", languages: "Spanish,English", age: 26 },
  { name: "Liam O'Connor", email: "liam.oconnor@example.com", languages: "English,Irish", age: 34 },
  { name: "Noah Kim", email: "noah.kim@example.com", languages: "Korean,English", age: 22 },
  { name: "Emma Rossi", email: "emma.rossi@example.com", languages: "Italian,English", age: 29 },
  { name: "Lucas Dubois", email: "lucas.dubois@example.com", languages: "French,English", age: 27 },
  { name: "Amelia Chen", email: "amelia.chen@example.com", languages: "Mandarin,English", age: 25 },
  { name: "Oliver Novak", email: "oliver.novak@example.com", languages: "Czech,English,German", age: 33 },
  { name: "Isabella Costa", email: "isabella.costa@example.com", languages: "Portuguese,English", age: 30 },
  { name: "Mason Ali", email: "mason.ali@example.com", languages: "English,Urdu", age: 23 },
];

async function main() {
  // Keep seed idempotent when re-running by clearing existing rows first.
  await prisma.userLanguage.deleteMany();
  await prisma.userLanguage.createMany({ data: users });
  console.log(`Seeded ${users.length} users into UserLanguage.`);
}

main()
  .catch((error) => {
    console.error(error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
