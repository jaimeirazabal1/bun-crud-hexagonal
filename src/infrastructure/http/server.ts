import { Elysia } from "elysia";
import { cookie } from "@elysiajs/cookie";
import { jwt } from "@elysiajs/jwt";
import { cors } from "@elysiajs/cors";
import { html } from "@elysiajs/html";
import { AuthService } from "../auth/AuthService";
import { InMemoryUserRepository } from "../repositories/InMemoryUserRepository";
import { InMemoryTaskRepository } from "../repositories/InMemoryTaskRepository";
import { Task } from "../../domain/entities/Task";
import { User } from "../../domain/entities/User";

const userRepository = new InMemoryUserRepository();
const taskRepository = new InMemoryTaskRepository();
const authService = new AuthService(userRepository);

const app = new Elysia()
  .use(cors())
  .use(html())
  .use(cookie())
  .use(
    jwt({
      name: "jwt",
      secret: process.env.JWT_SECRET || "your-secret-key",
    })
  );

// Servir archivos estáticos
app.get("/styles.css", () => Bun.file("public/styles.css"));
app.get("/dist/*", ({ params }) => {
  const file = params["*"];
  return Bun.file(`public/dist/${file}`);
});

// Rutas de autenticación
app.post("/api/auth/register", async ({ body }) => {
  if (typeof body !== "object" || body === null) {
    return new Response(JSON.stringify({ error: "Invalid request body" }), {
      status: 400,
    });
  }

  const { email, password } = body as { email: string; password: string };
  const existingUser = await userRepository.findByEmail(email);

  if (existingUser) {
    return new Response(JSON.stringify({ error: "User already exists" }), {
      status: 400,
    });
  }

  const user = await User.create(email, password);
  await userRepository.create(user);

  return { message: "User created successfully" };
});

app.post("/api/auth/login", async ({ body, jwt, cookie: { auth } }) => {
  if (typeof body !== "object" || body === null) {
    return new Response(JSON.stringify({ error: "Invalid request body" }), {
      status: 400,
    });
  }

  const { email, password } = body as { email: string; password: string };
  const user = await userRepository.findByEmail(email);

  if (!user) {
    return new Response(JSON.stringify({ error: "Invalid credentials" }), {
      status: 401,
    });
  }

  const isValid = await user.validatePassword(password);
  if (!isValid) {
    return new Response(JSON.stringify({ error: "Invalid credentials" }), {
      status: 401,
    });
  }

  const token = await jwt.sign({ id: user.id });
  auth.set({
    value: token,
    httpOnly: true,
    maxAge: 7 * 86400,
    path: "/",
  });

  return { token };
});

app.post("/api/auth/logout", ({ cookie: { auth } }) => {
  auth.remove();
  return { message: "Logged out successfully" };
});

// Rutas de tareas
app.get("/api/tasks", async ({ cookie: { auth }, jwt }) => {
  const token = auth.value;
  if (!token) {
    return new Response(JSON.stringify({ error: "Unauthorized" }), {
      status: 401,
    });
  }

  try {
    const payload = await jwt.verify(token);
    if (!payload || !payload.id) {
      throw new Error("Invalid token");
    }

    const tasks = await taskRepository.findByUserId(payload.id);
    return tasks;
  } catch (error) {
    return new Response(JSON.stringify({ error: "Unauthorized" }), {
      status: 401,
    });
  }
});

app.post("/api/tasks", async ({ body, cookie: { auth }, jwt }) => {
  const token = auth.value;
  if (!token) {
    return new Response(JSON.stringify({ error: "Unauthorized" }), {
      status: 401,
    });
  }

  try {
    const payload = await jwt.verify(token);
    if (!payload || !payload.id) {
      throw new Error("Invalid token");
    }

    if (typeof body !== "object" || body === null) {
      return new Response(JSON.stringify({ error: "Invalid request body" }), {
        status: 400,
      });
    }

    const { title, description, dueDate } = body as {
      title: string;
      description: string;
      dueDate: string;
    };

    const task = Task.create(
      title,
      description,
      new Date(dueDate),
      payload.id
    );

    await taskRepository.create(task);
    return task;
  } catch (error) {
    return new Response(JSON.stringify({ error: "Unauthorized" }), {
      status: 401,
    });
  }
});

app.put("/api/tasks/:id", async ({ params, body, cookie: { auth }, jwt }) => {
  const token = auth.value;
  if (!token) {
    return new Response(JSON.stringify({ error: "Unauthorized" }), {
      status: 401,
    });
  }

  try {
    const payload = await jwt.verify(token);
    if (!payload || !payload.id) {
      throw new Error("Invalid token");
    }

    const task = await taskRepository.findById(params.id);
    if (!task) {
      return new Response(JSON.stringify({ error: "Task not found" }), {
        status: 404,
      });
    }

    if (task.userId !== payload.id) {
      return new Response(JSON.stringify({ error: "Unauthorized" }), {
        status: 401,
      });
    }

    if (typeof body !== "object" || body === null) {
      return new Response(JSON.stringify({ error: "Invalid request body" }), {
        status: 400,
      });
    }

    const { title, description, dueDate, completed } = body as {
      title: string;
      description: string;
      dueDate: string;
      completed: boolean;
    };

    task.update(title, description, new Date(dueDate));
    if (completed !== undefined && completed !== task.completed) {
      task.toggleComplete();
    }

    await taskRepository.update(task);
    return task;
  } catch (error) {
    return new Response(JSON.stringify({ error: "Unauthorized" }), {
      status: 401,
    });
  }
});

app.delete("/api/tasks/:id", async ({ params, cookie: { auth }, jwt }) => {
  const token = auth.value;
  if (!token) {
    return new Response(JSON.stringify({ error: "Unauthorized" }), {
      status: 401,
    });
  }

  try {
    const payload = await jwt.verify(token);
    if (!payload || !payload.id) {
      throw new Error("Invalid token");
    }

    const task = await taskRepository.findById(params.id);
    if (!task) {
      return new Response(JSON.stringify({ error: "Task not found" }), {
        status: 404,
      });
    }

    if (task.userId !== payload.id) {
      return new Response(JSON.stringify({ error: "Unauthorized" }), {
        status: 401,
      });
    }

    await taskRepository.delete(params.id);
    return { message: "Task deleted successfully" };
  } catch (error) {
    return new Response(JSON.stringify({ error: "Unauthorized" }), {
      status: 401,
    });
  }
});

// Servir el SPA para todas las demás rutas
app.get("/*", () => Bun.file("public/index.html"));

app.listen(3000);

console.log(
  `🦊 Elysia is running at ${app.server?.hostname}:${app.server?.port}`
); 