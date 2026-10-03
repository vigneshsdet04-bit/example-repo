# aws-devops-api

A production-style Node.js REST API built for AWS DevOps learning. Designed to be deployed behind an **ALB + Auto Scaling Group**, with planned integrations for PostgreSQL, Redis, RabbitMQ, S3, and CloudWatch.

---

## Project Structure

```
.
├── src/
│   ├── app.js              # Express app (middleware + routes)
│   ├── server.js           # Server entrypoint + graceful shutdown
│   ├── config/
│   │   └── index.js        # Environment-based config
│   ├── middleware/
│   │   ├── errorHandler.js # Global error handler
│   │   └── notFound.js     # 404 handler
│   ├── routes/
│   │   ├── health.js       # GET /health
│   │   ├── info.js         # GET /
│   │   ├── users.js        # POST & GET /users
│   │   ├── chats.js        # /chats routes
│   │   ├── files.js        # POST /files/upload
│   │   └── jobs.js         # POST /jobs
│   └── store/
│       └── index.js        # In-memory data store
├── uploads/                # Uploaded files (local, S3 later)
├── .env.example
├── .gitignore
└── package.json
```

---

## Setup

```bash
# 1. Clone the repo
git clone <repo-url>
cd aws-devops-api

# 2. Install dependencies
npm install

# 3. Configure environment
cp .env.example .env
# Edit .env as needed

# 4. Start (development with auto-reload)
npm run dev

# 5. Start (production)
npm start
```

---

## API Reference

### Health Check

```
GET /health
```
```json
{
  "status": "healthy",
  "timestamp": "2026-10-03T08:31:00.000Z",
  "hostname": "ip-10-0-1-42"
}
```

---

### App Info

```
GET /
```
```json
{
  "app": "aws-devops-api",
  "version": "1.0.0",
  "environment": "production",
  "hostname": "ip-10-0-1-42"
}
```
> `hostname` lets you identify which EC2 instance handled the request when running behind an ALB.

---

### Users

#### Create User
```
POST /users
Content-Type: application/json

{ "name": "Alice", "email": "alice@example.com" }
```
```json
{
  "id": "uuid-here",
  "name": "Alice",
  "email": "alice@example.com",
  "createdAt": "2026-10-03T08:31:00.000Z"
}
```

#### List Users
```
GET /users
```
```json
{ "count": 1, "users": [...] }
```

---

### Chats

#### Create Chat
```
POST /chats
Content-Type: application/json

{ "userId": "<user-id>", "title": "My first chat" }
```

#### Get Chats for User
```
GET /chats/:userId
```

#### Send Message
```
POST /chats/:chatId/messages
Content-Type: application/json

{ "message": "Hello world" }
```

#### Get Messages
```
GET /chats/:chatId/messages
```

---

### File Upload

```
POST /files/upload
Content-Type: multipart/form-data

file=<binary>
```
```json
{
  "message": "File uploaded successfully.",
  "file": {
    "originalName": "photo.jpg",
    "filename": "photo-1234567890-876543.jpg",
    "size": 204800,
    "mimetype": "image/jpeg",
    "path": "/path/to/uploads/photo-1234567890-876543.jpg"
  }
}
```
> **Note:** `path` will be replaced by an S3 URL in a future step.

---

### Jobs

```
POST /jobs
Content-Type: application/json

{ "type": "send-email", "to": "bob@example.com" }
```
```json
{
  "id": "uuid-here",
  "status": "queued",
  "payload": { "type": "send-email", "to": "bob@example.com" },
  "createdAt": "2026-10-03T08:31:00.000Z"
}
```
> **Note:** Will be pushed to a RabbitMQ queue in a future step.

---

## Planned Integrations

| Service     | Purpose                  | Status  |
|-------------|--------------------------|---------|
| PostgreSQL  | Persistent user/chat DB  | Planned |
| Redis       | Session / caching        | Planned |
| RabbitMQ    | Job queue                | Planned |
| AWS S3      | File storage             | Planned |
| CloudWatch  | Logging & metrics        | Planned |

---

## npm Scripts

| Script        | Command                  |
|---------------|--------------------------|
| `npm start`   | Start production server  |
| `npm run dev` | Start with nodemon       |
