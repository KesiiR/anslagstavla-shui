# Anslagstavla

A simple bulletin board app for creating and viewing messages.

## Tech Stack

**Frontend:** React + Vite + Tailwind CSS  
**Backend:** AWS Lambda + DynamoDB (Serverless Framework)

## Features

- View all messages
- View messages by user
- Create new messages
- Update existing messages

## Setup

### Frontend
```bash
cd anslagstavla-frontend
npm install
npm run dev
```

### Backend
```bash
cd anslagstavla-backend
serverless deploy
```

## API Endpoints

- `GET /messages` - Get all messages
- `GET /messages/{username}` - Get messages by user
- `POST /messages` - Create message
- `PUT /messages/{id}` - Update message

