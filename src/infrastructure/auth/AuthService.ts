import { User } from "../../domain/entities/User";
import { UserRepository } from "../../domain/ports/repositories/UserRepository";

export class AuthService {
  constructor(private userRepository: UserRepository) {}

  async register(email: string, password: string, name: string): Promise<User> {
    const existingUser = await this.userRepository.findByEmail(email);
    if (existingUser) {
      throw new Error("User already exists");
    }

    const hashedPassword = await Bun.password.hash(password);
    const user = User.create(email, hashedPassword, name);
    return this.userRepository.create(user);
  }

  async login(email: string, password: string): Promise<User> {
    const user = await this.userRepository.findByEmail(email);
    if (!user) {
      throw new Error("Invalid credentials");
    }

    const isValid = await Bun.password.verify(password, user.password);
    if (!isValid) {
      throw new Error("Invalid credentials");
    }

    return user;
  }
} 