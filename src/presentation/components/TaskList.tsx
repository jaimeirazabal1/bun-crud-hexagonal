import React, { useState, useEffect } from 'react';
import { useTasks } from '../context/TaskContext';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';

export const TaskList: React.FC = () => {
  const { tasks, loadTasks, addTask, updateTask, deleteTask, toggleTaskComplete } = useTasks();
  const [showForm, setShowForm] = useState(false);
  const [editingTask, setEditingTask] = useState<string | null>(null);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [dueDate, setDueDate] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    loadTasks().catch(console.error);
  }, [loadTasks]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    try {
      if (editingTask) {
        await updateTask(editingTask, title, description, new Date(dueDate));
        setEditingTask(null);
      } else {
        await addTask(title, description, new Date(dueDate));
      }
      setTitle('');
      setDescription('');
      setDueDate('');
      setShowForm(false);
    } catch (error) {
      setError('Error al guardar la tarea');
      console.error(error);
    }
  };

  const handleEdit = (task: any) => {
    setEditingTask(task.id);
    setTitle(task.title);
    setDescription(task.description);
    setDueDate(format(new Date(task.dueDate), 'yyyy-MM-dd'));
    setShowForm(true);
  };

  const handleCancel = () => {
    setEditingTask(null);
    setTitle('');
    setDescription('');
    setDueDate('');
    setShowForm(false);
    setError('');
  };

  return (
    <div className="bg-white shadow overflow-hidden sm:rounded-lg">
      <div className="px-4 py-5 sm:px-6 flex justify-between items-center">
        <h3 className="text-lg leading-6 font-medium text-gray-900">Mis Tareas</h3>
        <button
          onClick={() => setShowForm(!showForm)}
          className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700"
        >
          {showForm ? 'Cancelar' : 'Nueva Tarea'}
        </button>
      </div>

      {showForm && (
        <div className="border-t border-gray-200">
          <form onSubmit={handleSubmit} className="px-4 py-5 sm:px-6 space-y-4">
            <div>
              <label htmlFor="title" className="block text-sm font-medium text-gray-700">
                Título
              </label>
              <input
                type="text"
                id="title"
                required
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
              />
            </div>

            <div>
              <label htmlFor="description" className="block text-sm font-medium text-gray-700">
                Descripción
              </label>
              <textarea
                id="description"
                rows={3}
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
              />
            </div>

            <div>
              <label htmlFor="dueDate" className="block text-sm font-medium text-gray-700">
                Fecha de vencimiento
              </label>
              <input
                type="date"
                id="dueDate"
                required
                value={dueDate}
                onChange={(e) => setDueDate(e.target.value)}
                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
              />
            </div>

            {error && (
              <div className="text-red-600 text-sm">{error}</div>
            )}

            <div className="flex justify-end space-x-3">
              <button
                type="button"
                onClick={handleCancel}
                className="inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
              >
                Cancelar
              </button>
              <button
                type="submit"
                className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700"
              >
                {editingTask ? 'Actualizar' : 'Crear'}
              </button>
            </div>
          </form>
        </div>
      )}

      <div className="border-t border-gray-200">
        <ul className="divide-y divide-gray-200">
          {tasks.map((task) => (
            <li key={task.id} className="px-4 py-4 sm:px-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <input
                    type="checkbox"
                    checked={task.completed}
                    onChange={() => toggleTaskComplete(task.id)}
                    className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
                  />
                  <div className="ml-3">
                    <p className={`text-sm font-medium ${task.completed ? 'text-gray-400 line-through' : 'text-gray-900'}`}>
                      {task.title}
                    </p>
                    <p className="text-sm text-gray-500">{task.description}</p>
                    <p className="text-xs text-gray-500">
                      Vence: {format(new Date(task.dueDate), 'PPP', { locale: es })}
                    </p>
                  </div>
                </div>
                <div className="flex space-x-2">
                  <button
                    onClick={() => handleEdit(task)}
                    className="text-indigo-600 hover:text-indigo-900"
                  >
                    Editar
                  </button>
                  <button
                    onClick={() => deleteTask(task.id)}
                    className="text-red-600 hover:text-red-900"
                  >
                    Eliminar
                  </button>
                </div>
              </div>
            </li>
          ))}
          {tasks.length === 0 && (
            <li className="px-4 py-5 sm:px-6 text-center text-gray-500">
              No hay tareas pendientes
            </li>
          )}
        </ul>
      </div>
    </div>
  );
}; 