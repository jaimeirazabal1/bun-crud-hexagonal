import React, { createContext, useContext, useState, ReactNode } from 'react';

interface Task {
  id: string;
  title: string;
  description: string;
  dueDate: Date;
  completed: boolean;
  userId: string;
}

interface TaskContextType {
  tasks: Task[];
  addTask: (title: string, description: string, dueDate: Date) => Promise<void>;
  updateTask: (id: string, title: string, description: string, dueDate: Date) => Promise<void>;
  toggleTaskComplete: (id: string) => Promise<void>;
  deleteTask: (id: string) => Promise<void>;
  loadTasks: () => Promise<void>;
}

const TaskContext = createContext<TaskContextType | null>(null);

export const TaskProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [tasks, setTasks] = useState<Task[]>([]);

  const loadTasks = async () => {
    try {
      const response = await fetch('/api/tasks');
      if (!response.ok) throw new Error('Error al cargar las tareas');
      const data = await response.json();
      setTasks(data.tasks);
    } catch (error) {
      console.error('Error al cargar tareas:', error);
      throw error;
    }
  };

  const addTask = async (title: string, description: string, dueDate: Date) => {
    try {
      const response = await fetch('/api/tasks', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ title, description, dueDate }),
      });

      if (!response.ok) throw new Error('Error al crear la tarea');
      const data = await response.json();
      setTasks(prev => [...prev, data.task]);
    } catch (error) {
      console.error('Error al crear tarea:', error);
      throw error;
    }
  };

  const updateTask = async (id: string, title: string, description: string, dueDate: Date) => {
    try {
      const response = await fetch(`/api/tasks/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ title, description, dueDate }),
      });

      if (!response.ok) throw new Error('Error al actualizar la tarea');
      const data = await response.json();
      setTasks(prev => prev.map(task => task.id === id ? data.task : task));
    } catch (error) {
      console.error('Error al actualizar tarea:', error);
      throw error;
    }
  };

  const toggleTaskComplete = async (id: string) => {
    try {
      const task = tasks.find(t => t.id === id);
      if (!task) throw new Error('Tarea no encontrada');

      const response = await fetch(`/api/tasks/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ completed: !task.completed }),
      });

      if (!response.ok) throw new Error('Error al actualizar el estado de la tarea');
      const data = await response.json();
      setTasks(prev => prev.map(task => task.id === id ? data.task : task));
    } catch (error) {
      console.error('Error al cambiar estado de tarea:', error);
      throw error;
    }
  };

  const deleteTask = async (id: string) => {
    try {
      const response = await fetch(`/api/tasks/${id}`, {
        method: 'DELETE',
      });

      if (!response.ok) throw new Error('Error al eliminar la tarea');
      setTasks(prev => prev.filter(task => task.id !== id));
    } catch (error) {
      console.error('Error al eliminar tarea:', error);
      throw error;
    }
  };

  return (
    <TaskContext.Provider value={{ tasks, addTask, updateTask, toggleTaskComplete, deleteTask, loadTasks }}>
      {children}
    </TaskContext.Provider>
  );
};

export const useTasks = () => {
  const context = useContext(TaskContext);
  if (!context) {
    throw new Error('useTasks debe ser usado dentro de un TaskProvider');
  }
  return context;
}; 