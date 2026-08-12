import { Prisma, FitnessAim } from "@prisma/client";
import { prisma } from "../utils/prismaClient";
import type { MemberCreateInput } from "../validators/memberValidator";

export class DuplicateMemberError extends Error {
  constructor() {
    super("A registration with this mobile number and email already exists.");
    this.name = "DuplicateMemberError";
  }
}

export async function createMember(input: MemberCreateInput) {
  try {
    return await prisma.member.create({
      data: {
        name: input.name,
        age: input.age,
        gender: input.gender,
        aim: input.aim,
        mobileNumber: input.mobileNumber,
        email: input.email,
      },
    });
  } catch (err) {
    if (err instanceof Prisma.PrismaClientKnownRequestError && err.code === "P2002") {
      throw new DuplicateMemberError();
    }
    throw err;
  }
}

interface ListParams {
  search?: string;
  aim?: FitnessAim;
  page: number;
  pageSize: number;
}

export async function listMembers({ search, aim, page, pageSize }: ListParams) {
  const where: Prisma.MemberWhereInput = {
    ...(aim ? { aim } : {}),
    ...(search
      ? {
          OR: [
            { name: { contains: search, mode: "insensitive" } },
            { email: { contains: search, mode: "insensitive" } },
            { mobileNumber: { contains: search } },
          ],
        }
      : {}),
  };

  const [items, total] = await Promise.all([
    prisma.member.findMany({
      where,
      orderBy: { createdAt: "desc" },
      skip: (page - 1) * pageSize,
      take: pageSize,
    }),
    prisma.member.count({ where }),
  ]);

  return { items, total, page, pageSize };
}

export async function updateMember(id: string, input: Partial<MemberCreateInput>) {
  try {
    return await prisma.member.update({ where: { id }, data: input });
  } catch (err) {
    if (err instanceof Prisma.PrismaClientKnownRequestError && err.code === "P2002") {
      throw new DuplicateMemberError();
    }
    throw err;
  }
}

export async function getMemberById(id: string) {
  return prisma.member.findUnique({ where: { id } });
}

export async function deleteMemberById(id: string) {
  return prisma.member.delete({ where: { id } });
}

export async function getMemberStats() {
  const [total, byAim] = await Promise.all([
    prisma.member.count(),
    prisma.member.groupBy({
      by: ["aim"],
      _count: { aim: true },
    }),
  ]);

  const counts: Record<string, number> = {};
  for (const row of byAim) {
    counts[row.aim] = row._count.aim;
  }

  return { total, byAim: counts };
}
