import { defineConfig } from "drizzle-kit"

export default defineConfig({
    out: "./src/db/drizzle",
    dialect: "postgresql",
    schema: "./src/db/schema.ts",

    dbCredentials: {
        url: "postgresql://chidi:12345678@localhost:5432/mydb"
    },
  
})

