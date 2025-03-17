import { v4 as uuidv4 } from 'uuid';
import { hash, verify } from '@node-rs/argon2';

export class User {
  public readonly id: string;
  public readonly email: string;
  private _password: string;
  public readonly createdAt: Date;
  public readonly updatedAt: Date;

  constructor(
    id: string,
    email: string,
    password: string,
    createdAt: Date = new Date(),
    updatedAt: Date = new Date()
  ) {
    this.id = id;
    this.email = email;
    this._password = password;
    this.createdAt = createdAt;
    this.updatedAt = updatedAt;
  }

  static async create(email: string, password: string): Promise<User> {
    const hashedPassword = await hash(password);
    return new User(uuidv4(), email, hashedPassword);
  }

  async validatePassword(password: string): Promise<boolean> {
    return verify(this._password, password);
  }

  toJSON() {
    return {
      id: this.id,
      email: this.email,
      createdAt: this.createdAt,
      updatedAt: this.updatedAt
    };
  }
} 