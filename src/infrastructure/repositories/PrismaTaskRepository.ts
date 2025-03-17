import { PrismaClient } from "@prisma/client";
import { Task } from "../../domain/entities/Task";
import { TaskRepository } from "../../domain/ports/repositories/TaskRepository";

export class PrismaTaskRepository implements TaskRepository {
  constructor(private prisma: PrismaClient) {}

  async create(task: Task): Promise<Task> {
    const created = await this.prisma.task.create({
      data: {
        id: task.id,
        title: task.title,
        description: task.description,
        completed: task.completed,
        dueDate: task.dueDate,
        userId: task.userId,
        createdAt: task.createdAt,
        updatedAt: task.updatedAt,
      },
    });

    return new Task(
      created.id,
      created.title,
      created.description,
      created.completed,
      created.dueDate,
      created.userId,
      created.createdAt,
      created.updatedAt
    );
  }

  async findById(id: string): Promise<Task | null> {
    const task = await this.prisma.task.findUnique({
      where: { id },
    });

    if (!task) return null;

    return new Task(
      task.id,
      task.title,
      task.description,
      task.completed,
      task.dueDate,
      task.userId,
      task.createdAt,
      task.updatedAt
    );
  }

  async findByUserId(userId: string): Promise<Task[]> {
    const tasks = await this.prisma.task.findMany({
      where: { userId },
      orderBy: { dueDate: 'asc' },
    });

    return tasks.map(
      (task) =>
        new Task(
          task.id,
          task.title,
          task.description,
          task.completed,
          task.dueDate,
          task.userId,
          task.createdAt,
          task.updatedAt
        )
    );
  }

  async findByUserIdAndDateRange(
    userId: string,
    startDate: Date,
    endDate: Date
  ): Promise<Task[]> {
    const tasks = await this.prisma.task.findMany({
      where: {
        userId,
        dueDate: {
          gte: startDate,
          lte: endDate,
        },
      },
      orderBy: { dueDate: 'asc' },
    });

    return tasks.map(
      (task) =>
        new Task(
          task.id,
          task.title,
          task.description,
          task.completed,
          task.dueDate,
          task.userId,
          task.createdAt,
          task.updatedAt
        )
    );
  }

  async update(task: Task): Promise<Task> {
    const updated = await this.prisma.task.update({
      where: { id: task.id },
      data: {
        title: task.title,
        description: task.description,
        completed: task.completed,
        dueDate: task.dueDate,
        updatedAt: new Date(),
      },
    });

    return new Task(
      updated.id,
      updated.title,
      updated.description,
      updated.completed,
      updated.dueDate,
      updated.userId,
      updated.createdAt,
      updated.updatedAt
    );
  }

  async delete(id: string): Promise<void> {
    await this.prisma.task.delete({
      where: { id },
    });
  }
} 