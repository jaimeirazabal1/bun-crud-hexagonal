import { PrismaClient } from "@prisma/client";
import { User } from "../../domain/entities/User";
import { UserRepository } from "../../domain/ports/repositories/UserRepository";

export class PrismaUserRepository implements UserRepository {
  constructor(private prisma: PrismaClient) {}

  async create(user: User): Promise<User> {
    const created = await this.prisma.user.create({
      data: {
        id: user.id,
        email: user.email,
        password: user.password,
        name: user.name,
        createdAt: user.createdAt,
        updatedAt: user.updatedAt,
      },
    });

    return new User(
      created.id,
      created.email,
      created.password,
      created.name,
      created.createdAt,
      created.updatedAt
    );
  }

  async findById(id: string): Promise<User | null> {
    const user = await this.prisma.user.findUnique({
      where: { id },
    });

    if (!user) return null;

    return new User(
      user.id,
      user.email,
      user.password,
      user.name,
      user.createdAt,
      user.updatedAt
    );
  }

  async findByEmail(email: string): Promise<User | null> {
    const user = await this.prisma.user.findUnique({
      where: { email },
    });

    if (!user) return null;

    return new User(
      user.id,
      user.email,
      user.password,
      user.name,
      user.createdAt,
      user.updatedAt
    );
  }

  async update(user: User): Promise<User> {
    const updated = await this.prisma.user.update({
      where: { id: user.id },
      data: {
        email: user.email,
        password: user.password,
        name: user.name,
        updatedAt: new Date(),
      },
    });

    return new User(
      updated.id,
      updated.email,
      updated.password,
      updated.name,
      updated.createdAt,
      updated.updatedAt
    );
  }

  async delete(id: string): Promise<void> {
    await this.prisma.user.delete({
      where: { id },
    });
  }
} 