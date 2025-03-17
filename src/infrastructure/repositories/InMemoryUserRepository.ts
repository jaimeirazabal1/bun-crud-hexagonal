import { User } from "../../domain/entities/User";
import { UserRepository } from "../../domain/ports/repositories/UserRepository";

export class InMemoryUserRepository implements UserRepository {
  private users: Map<string, User> = new Map();

  async create(user: User): Promise<User> {
    console.log("Creando usuario:", user);
    this.users.set(user.id, user);
    return user;
  }

  async findByEmail(email: string): Promise<User | null> {
    console.log("Buscando usuario por email:", email);
    console.log("Usuarios en memoria:", Array.from(this.users.values()));
    for (const user of this.users.values()) {
      if (user.email === email) {
        console.log("Usuario encontrado:", user);
        return user;
      }
    }
    console.log("Usuario no encontrado");
    return null;
  }

  async findById(id: string): Promise<User | null> {
    console.log("Buscando usuario por id:", id);
    return this.users.get(id) || null;
  }

  async update(user: User): Promise<User> {
    console.log("Actualizando usuario:", user);
    this.users.set(user.id, user);
    return user;
  }

  async delete(id: string): Promise<void> {
    console.log("Eliminando usuario:", id);
    this.users.delete(id);
  }
} 