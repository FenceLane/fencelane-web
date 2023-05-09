import { PrismaClient } from "@prisma/client";

const globalForPrisma = global as unknown as { prismaClient: PrismaClient };

export const prismaClient = globalForPrisma.prismaClient || new PrismaClient();

if (process.env.NODE_ENV !== "production")
  globalForPrisma.prismaClient = prismaClient;
