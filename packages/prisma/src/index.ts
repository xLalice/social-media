import { PrismaClient } from 'packages/prisma/src';

const prisma = new PrismaClient();

export * from '../prisma/generated/client';
export default prisma;
