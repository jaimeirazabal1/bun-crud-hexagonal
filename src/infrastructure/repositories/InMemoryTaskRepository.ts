import { Task } from "../../domain/entities/Task";
import { TaskRepository } from "../../domain/ports/repositories/TaskRepository";

export class InMemoryTaskRepository implements TaskRepository {
  private tasks: Map<string, Task>;

  constructor() {
    this.tasks = new Map<string, Task>();
  }

  async create(task: Task): Promise<Task> {
    console.log("Creando tarea:", task);
    this.tasks.set(task.id, task);
    return task;
  }

  async findById(id: string): Promise<Task | null> {
    console.log("Buscando tarea por id:", id);
    return this.tasks.get(id) || null;
  }

  async findByUserId(userId: string): Promise<Task[]> {
    console.log("Buscando tareas del usuario:", userId);
    return Array.from(this.tasks.values()).filter(task => task.userId === userId);
  }

  async findByUserIdAndDateRange(userId: string, startDate: Date, endDate: Date): Promise<Task[]> {
    console.log("Buscando tareas del usuario por rango de fechas:", userId, startDate, endDate);
    return Array.from(this.tasks.values()).filter(task => 
      task.userId === userId && 
      task.dueDate >= startDate && 
      task.dueDate <= endDate
    );
  }

  async update(task: Task): Promise<Task> {
    console.log("Actualizando tarea:", task);
    this.tasks.set(task.id, task);
    return task;
  }

  async delete(id: string): Promise<void> {
    console.log("Eliminando tarea:", id);
    this.tasks.delete(id);
  }
} 