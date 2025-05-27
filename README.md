# Simple Application with SQLite3

This is a simple application that uses SQLite3 as the main database.

## Setup

1. Clone the repository
2. Install dependencies:
   ```
   npm install
   ```
3. Copy the `.env.example` file to `.env` and update the values as needed:
   ```
   cp .env.example .env
   ```
4. Start the application:
   ```
   npm start
   ```

## Environment Variables

- `PORT`: The port on which the application will run (default: 2019)
- `SQLITE_DB_PATH`: The path to the SQLite database file (default: data/items.db)

## API Endpoints

### Items API

- `GET /items`: Get all items
- `GET /items/:id`: Get an item by ID
- `POST /items`: Create a new item
- `PUT /items/:id`: Update an item
- `DELETE /items/:id`: Delete an item

### Database Health Check

- `GET /health`: Check if the application is running
- `GET /db/health`: Check if the SQLite database is connected
- `GET /db/test`: Test database operations

## Database Schema

### Items Table

```sql
CREATE TABLE IF NOT EXISTS items (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  price REAL NOT NULL,
  description TEXT
);
```