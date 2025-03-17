import React from 'react';
import {
  format,
  startOfMonth,
  endOfMonth,
  eachDayOfInterval,
  isSameMonth,
  isSameDay,
  isToday,
} from 'date-fns';
import { es } from 'date-fns/locale';
import { useTasks } from '../context/TaskContext';

export const Calendar: React.FC = () => {
  const { tasks } = useTasks();
  const today = new Date();
  const firstDayOfMonth = startOfMonth(today);
  const lastDayOfMonth = endOfMonth(today);
  const daysInMonth = eachDayOfInterval({ start: firstDayOfMonth, end: lastDayOfMonth });

  const getTasksForDay = (date: Date) => {
    return tasks.filter((task) => isSameDay(new Date(task.dueDate), date));
  };

  return (
    <div className="bg-white shadow overflow-hidden sm:rounded-lg">
      <div className="px-4 py-5 sm:px-6">
        <h3 className="text-lg leading-6 font-medium text-gray-900">
          {format(today, 'MMMM yyyy', { locale: es })}
        </h3>
      </div>
      <div className="border-t border-gray-200">
        <div className="grid grid-cols-7 gap-px bg-gray-200 border-b">
          {['Dom', 'Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb'].map((day) => (
            <div
              key={day}
              className="bg-gray-50 py-2 text-center text-sm font-semibold text-gray-700"
            >
              {day}
            </div>
          ))}
        </div>
        <div className="grid grid-cols-7 gap-px bg-gray-200">
          {daysInMonth.map((date) => {
            const dayTasks = getTasksForDay(date);
            const isCurrentMonth = isSameMonth(date, today);
            
            return (
              <div
                key={date.toString()}
                className={`min-h-[100px] bg-white p-2 ${
                  !isCurrentMonth ? 'bg-gray-50' : ''
                }`}
              >
                <div
                  className={`text-sm font-semibold ${
                    isToday(date)
                      ? 'text-white bg-indigo-600 rounded-full w-6 h-6 flex items-center justify-center'
                      : 'text-gray-700'
                  }`}
                >
                  {format(date, 'd')}
                </div>
                <div className="mt-1 space-y-1">
                  {dayTasks.map((task) => (
                    <div
                      key={task.id}
                      className={`text-xs p-1 rounded ${
                        task.completed
                          ? 'bg-green-100 text-green-800'
                          : 'bg-indigo-100 text-indigo-800'
                      }`}
                    >
                      {task.title}
                    </div>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}; 