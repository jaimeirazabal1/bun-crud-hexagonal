import { v4 as uuidv4 } from 'uuid';

export class Task {
  public readonly id: string;
  public readonly createdAt: Date;
  public readonly updatedAt: Date;
  private _title: string;
  private _description: string;
  private _dueDate: Date;
  private _completed: boolean;
  private _userId: string;

  constructor(
    id: string,
    title: string,
    description: string,
    dueDate: Date,
    userId: string,
    completed: boolean = false,
    createdAt: Date = new Date(),
    updatedAt: Date = new Date()
  ) {
    this.id = id;
    this._title = title;
    this._description = description;
    this._dueDate = dueDate;
    this._userId = userId;
    this._completed = completed;
    this.createdAt = createdAt;
    this.updatedAt = updatedAt;
  }

  static create(title: string, description: string, dueDate: Date, userId: string): Task {
    return new Task(uuidv4(), title, description, dueDate, userId);
  }

  get title(): string {
    return this._title;
  }

  get description(): string {
    return this._description;
  }

  get dueDate(): Date {
    return this._dueDate;
  }

  get completed(): boolean {
    return this._completed;
  }

  get userId(): string {
    return this._userId;
  }

  update(title: string, description: string, dueDate: Date): void {
    this._title = title;
    this._description = description;
    this._dueDate = dueDate;
  }

  toggleComplete(): void {
    this._completed = !this._completed;
  }

  toJSON() {
    return {
      id: this.id,
      title: this._title,
      description: this._description,
      dueDate: this._dueDate,
      completed: this._completed,
      userId: this._userId,
      createdAt: this.createdAt,
      updatedAt: this.updatedAt
    };
  }
} 