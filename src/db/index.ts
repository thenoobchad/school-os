import postgres from "postgres"
import * as schema from "./schema"
import { drizzle } from "drizzle-orm/postgres-js";
const connectionString = "postgresql://chidi:12345678@localhost:5432/mydb"

const client = postgres(connectionString, { max: 10 });

export const db = drizzle(client, { schema })


