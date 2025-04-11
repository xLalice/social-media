import { PrismaClient } from 'packages/prisma/src';

const prisma = new PrismaClient();

export * from '../prisma/generated/client';
export { PrismaClient } from '../prisma/generated/client';
