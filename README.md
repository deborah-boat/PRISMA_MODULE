# MODULE_PRISMA API

Simple Express + Prisma API for managing users and their programming languages.

## Prerequisites

- Node.js 18+ (recommended)
- npm

## How to run your server

1. Install dependencies:

```bash
npm install
```

2. Make sure `.env` contains a valid `DATABASE_URL`.

3. Ensure Prisma schema is pushed to the database:

```bash
npx prisma db push
```

4. Start the server:

```bash
npm start
```

Server runs at:

- `http://localhost:3000`

## How to test routes

You can test with Postman, Insomnia, or `curl` commands below.

### 1) Create a user

```bash
curl -X POST http://localhost:3000/userlanguages \
  -H "Content-Type: application/json" \
  -d "{\"name\":\"Alice\",\"email\":\"alice@example.com\",\"languages\":[\"JavaScript\",\"Python\"],\"age\":22}"
```

### 2) Get all users

```bash
curl http://localhost:3000/userlanguages
```

### 3) Get users by language

```bash
curl http://localhost:3000/userlanguages/javascript
```

### 4) Update languages by email

```bash
curl -X PATCH http://localhost:3000/userlanguages/alice@example.com/languages \
  -H "Content-Type: application/json" \
  -d "{\"languages\":[\"TypeScript\",\"Go\"]}"
```

### 5) Delete users under 18

```bash
curl -X DELETE http://localhost:3000/userlanguages/under-18
```

## What new routes were created

The following routes are implemented in the API:

- `GET /userlanguages` - fetch all users
- `GET /userlanguages/:language` - fetch users filtered by language
- `POST /userlanguages` - create a new user
- `PATCH /userlanguages/:email/languages` - update a user languages by email
- `DELETE /userlanguages/under-18` - delete all users younger than 18

## Notes

- Default port is `3000` unless `PORT` is set in environment variables.
- Email is stored in lowercase and must be unique.
- `languages` can be sent as either a comma-separated string or a string array.
