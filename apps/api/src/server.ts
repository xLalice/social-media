import app from "./app";
import { PrismaClient } from "@packages/prisma";
import { setupEnv } from './utils/env';
setupEnv();

const prisma = new PrismaClient();
const PORT = process.env.PORT;

async function startServer() {
  try {
    await prisma.$connect();
    console.log("Connected to database successfully");

    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
    });
  } catch (error) {
    console.error("Failed to start server:", error);
    process.exit(1);
  }
}

startServer();

process.on("SIGINT", async () => {
  await prisma.$disconnect();
  console.log("Disconnected from database");
  process.exit(0);
});

process.on("SIGTERM", async () => {
  await prisma.$disconnect();
  console.log("Disconnected from database");
  process.exit(0);
});
