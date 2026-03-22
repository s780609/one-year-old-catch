import sql from "../lib/db.js";

async function createRsvpTable() {
  await sql`
    CREATE TABLE IF NOT EXISTS rsvp (
      name TEXT PRIMARY KEY,
      num_attendees INTEGER NOT NULL DEFAULT 1,
      created_at TIMESTAMP DEFAULT NOW(),
      updated_at TIMESTAMP DEFAULT NOW()
    )
  `;
  console.log("rsvp table created successfully");
}

createRsvpTable().catch(console.error);
