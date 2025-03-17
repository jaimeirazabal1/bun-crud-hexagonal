import { Task } from "../../entities/Task";

export interface TaskRepository {
  create(task: Task): Promise<Task>;
  findById(id: string): Promise<Task | null>;
  findByUserId(userId: string): Promise<Task[]>;
  findByUserIdAndDateRange(userId: string, startDate: Date, endDate: Date): Promise<Task[]>;
  update(task: Task): Promise<Task>;
  delete(id: string): Promise<void>;
} 