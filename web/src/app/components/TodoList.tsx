import React, { useEffect, useState } from 'react';
import { twMerge } from 'tailwind-merge';
import { useForm, SubmitHandler } from 'react-hook-form';
import * as yup from 'yup';
import { yupResolver } from '@hookform/resolvers/yup';
import { DateTime } from 'luxon';
import axios from 'axios';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCircleCheck, faCircle } from '@fortawesome/free-regular-svg-icons';
import {
  faArrowUp,
  faArrowRight,
  faArrowDown,
} from '@fortawesome/free-solid-svg-icons';

// types
export type TodoPriority = 'low' | 'medium' | 'high';

export type TodoStatus = 'todo' | 'in-progress' | 'done';

interface Todo {
  id: number;
  title: string;
  description: string;
  assignee: string;
  creator: string;
  priority: TodoPriority;
  status: TodoStatus;
  created_at: string;
}

// data, config
const API_DOMAIN = 'http://localhost:3000';
const API_URL = `${API_DOMAIN}/duties`;

const TODO_CONFIG = [
  {
    key: 'title',
    label: 'Title',
    placeholder: 'Please input the task title',
    type: 'text',
    defaultValue: '',
    options: null,
  },
  {
    key: 'description',
    label: 'Description',
    placeholder: 'Please input the task description',
    type: 'textarea',
    defaultValue: '',
    options: null,
  },
  {
    key: 'assignee',
    label: 'Assign to',
    placeholder: "Please input the assignee's name",
    type: 'text',
    defaultValue: '',
    options: null,
  },
  {
    key: 'creator',
    label: 'Creator',
    placeholder: "Please input the creator's name",
    type: 'text',
    defaultValue: '',
    options: null,
  },
  {
    key: 'priority',
    label: 'Priority',
    placeholder: 'Please input the task priority',
    type: 'radio',
    defaultValue: '',
    options: ['high', 'medium', 'low'],
  },
  {
    key: 'status',
    label: 'Status',
    placeholder: 'Please input the task status',
    type: 'radio',
    defaultValue: '',
    options: ['todo', 'in-progress', 'done'],
  },
] as const;

const TODO_DEFAULT_VALUES = {
  title: '',
  description: '',
  assignee: '',
  creator: '',
  priority: undefined,
  status: undefined,
} as const;

const TodoSchema = yup.object().shape({
  title: yup.string().required('Title is required'),
  description: yup.string().required('Description is required'),
  assignee: yup.string().required('Assignee is required'),
  creator: yup.string().required('Creator is required'),
  priority: yup
    .string()
    .oneOf(['high', 'medium', 'low'])
    .required('Priority is required'),
  status: yup
    .string()
    .oneOf(['todo', 'in-progress', 'done'])
    .required('Status is required'),
});

const baseClasses = {
  button:
    'text-xl text-white px-8 py-2 focus:outline-none cursor-pointer rounded-lg',
};

const getIcon = (option: TodoPriority) => {
  switch (option) {
    case 'high':
      return faArrowUp;
    case 'medium':
      return faArrowRight;
    case 'low':
      return faArrowDown;
  }
};

const getStatusColor = (option: TodoStatus) => {
  switch (option) {
    case 'todo':
      return 'bg-blue-200';
    case 'in-progress':
      return 'bg-orange-200';
    case 'done':
      return 'bg-green-200';
  }
};

// component
const TodoList: React.FC = () => {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [isEditing, setIsEditing] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);

  const {
    register,
    handleSubmit,
    reset,
    setValue,
    watch,
    formState: { errors },
  } = useForm<Omit<Todo, 'id' | 'created_at'>>({
    resolver: yupResolver(TodoSchema),
    defaultValues: TODO_DEFAULT_VALUES,
  });

  const fetchTodos = async () => {
    const response = await axios.get(API_URL);
    setTodos(response.data);
  };

  const deleteTodo = async (id: number) => {
    await axios.delete(`${API_URL}/${id}`);
    setTodos(todos.filter((todo) => todo.id !== id));
  };

  const addTodo = async (todo: Omit<Todo, 'id' | 'created_at'>) => {
    const response = await axios.post(API_URL, todo);
    setTodos([...todos, response.data]);
  };

  const updateTodo = async (
    id: number,
    todo: Omit<Todo, 'id' | 'created_at'>
  ) => {
    const response = await axios.put(`${API_URL}/${id}`, todo);
    setTodos(todos.map((t) => (t.id === id ? response.data : t)));
  };

  const onFormSubmitHandler: SubmitHandler<
    Omit<Todo, 'id' | 'created_at'>
  > = async (data) => {
    await (isEditing && editingId
      ? updateTodo(editingId, data)
      : addTodo(data));

    reset();
    setIsEditing(false);
    setEditingId(null);
  };

  const onFormResetHandler = () => {
    reset();
    setIsEditing(false);
    setEditingId(null);
  };

  const onCardDeleteHandler = (
    e: React.MouseEvent<HTMLButtonElement>,
    id: number
  ) => {
    e.stopPropagation();
    deleteTodo(id);
  };

  const onCardEditHandler = (todo: Todo) => {
    setIsEditing(true);
    setEditingId(todo.id);

    setValue('title', todo.title);
    setValue('description', todo.description);
    setValue('assignee', todo.assignee);
    setValue('creator', todo.creator);
    setValue('priority', todo.priority);
    setValue('status', todo.status);
  };

  useEffect(() => {
    fetchTodos();
  }, []);

  return (
    <div className="text-gray-800 p-8">
      <h1 className="text-4xl font-bold">Duties Todo List</h1>
      <div className="flex flex-col md:flex-row items-start mt-8 gap-8">
        <ul className="w-full">
          {todos.map((todo) => (
            <li
              key={todo.id}
              className={twMerge(
                'p-4 mb-4 rounded-lg',
                todo.status === 'todo'
                  ? 'bg-blue-200'
                  : todo.status === 'in-progress'
                  ? 'bg-orange-200'
                  : 'bg-green-200'
              )}
            >
              <div className="flex justify-start items-center">
                <FontAwesomeIcon
                  icon={
                    todo.priority === 'high'
                      ? faArrowUp
                      : todo.priority === 'medium'
                      ? faArrowRight
                      : faArrowDown
                  }
                  className="mr-2"
                />
                <label className="text-2xl">{todo.title}</label>
              </div>
              <div className="flex py-4">
                <div className="flex-1">
                  <p className="font-semibold">Assign to</p>
                  <p>{todo.assignee}</p>
                </div>
                <div className="flex-1">
                  <p className="font-semibold">Created by</p>
                  <p>{todo.creator}</p>
                </div>
                <div className="flex-1">
                  <p className="font-semibold">Created date</p>
                  <p>
                    {DateTime.fromISO(todo.created_at).toFormat(
                      'yyyy-MM-dd HH:mm:ss'
                    )}
                  </p>
                </div>
              </div>
              <p className="text-base border-t border-gray-600 py-4 mb-8">
                <p className="font-semibold">Description</p>
                <p>
                  {todo.description.split('\n').map((line, index) => (
                    <span key={index}>
                      {line}
                      <br />
                    </span>
                  ))}
                </p>
              </p>
              <button
                type="button"
                onClick={(e) => {
                  onCardEditHandler(todo);
                }}
                className={twMerge(
                  baseClasses.button,
                  'bg-blue-500 hover:bg-blue-700'
                )}
              >
                Edit
              </button>
              <button
                type="button"
                onClick={(e) => {
                  onCardDeleteHandler(e, todo.id);
                }}
                className={twMerge(
                  baseClasses.button,
                  'bg-gray-500 hover:bg-gray-700 ml-4'
                )}
              >
                Delete
              </button>
            </li>
          ))}
        </ul>
        <form
          onSubmit={handleSubmit(onFormSubmitHandler)}
          className="w-full p-4 rounded-lg border-2 border-gray-300"
        >
          {TODO_CONFIG.map(({ key, label, placeholder, type, options }) => {
            if (type === 'text') {
              return (
                <div className="flex flex-col mb-8" key={key}>
                  <label
                    htmlFor={key}
                    className="text-base font-semibold cursor-pointer"
                  >
                    {label}
                  </label>
                  <input
                    {...register(key as keyof Omit<Todo, 'id' | 'created_at'>)}
                    id={key}
                    placeholder={placeholder}
                    className="text-base py-4 border-b border-gray-300 focus:border-gray-600 focus:outline-none cursor-pointer"
                  />
                  {errors[key as keyof typeof errors] && (
                    <div className="text-red-500 mt-1">
                      {errors[key as keyof typeof errors]?.message}
                    </div>
                  )}
                </div>
              );
            }
            if (type === 'textarea') {
              return (
                <div className="flex flex-col mb-8" key={key}>
                  <label
                    htmlFor={key}
                    className="text-base font-semibold cursor-pointer"
                  >
                    {label}
                  </label>
                  <textarea
                    {...register(key as keyof Omit<Todo, 'id' | 'created_at'>)}
                    id={key}
                    placeholder="Please input the task description"
                    className="text-base py-4 border-b border-gray-300 focus:border-gray-600 focus:outline-none cursor-pointer resize-none h-40"
                  />
                  {errors[key as keyof typeof errors] && (
                    <div className="text-red-500 mt-1">
                      {errors[key as keyof typeof errors]?.message}
                    </div>
                  )}
                </div>
              );
            }
            if (type === 'radio') {
              return (
                <div className="flex flex-col mb-8" key={key}>
                  <label className="text-base font-semibold mb-4">
                    {label}
                  </label>
                  <div>
                    {options?.map((option) => (
                      <label
                        key={option}
                        className={twMerge(
                          'flex items-center cursor-pointer mb-2',
                          watch(
                            key as keyof Omit<Todo, 'id' | 'created_at'>
                          ) === option
                            ? 'text-gray-800'
                            : 'text-gray-400 hover:text-gray-800'
                        )}
                      >
                        <input
                          type="radio"
                          {...register(
                            key as keyof Omit<Todo, 'id' | 'created_at'>
                          )}
                          value={option}
                          className="hidden"
                        />
                        <FontAwesomeIcon
                          icon={
                            watch(
                              key as keyof Omit<Todo, 'id' | 'created_at'>
                            ) === option
                              ? faCircleCheck
                              : faCircle
                          }
                          className={'mr-2'}
                        />
                        <span
                          className={
                            (twMerge('capitalize'),
                            getStatusColor(option as TodoStatus) &&
                              twMerge(
                                'px-2',
                                getStatusColor(option as TodoStatus)
                              ))
                          }
                        >
                          {option}
                          {getIcon(option as TodoPriority) && (
                            <FontAwesomeIcon
                              icon={getIcon(option as TodoPriority)}
                              className="ml-2"
                            />
                          )}
                        </span>
                      </label>
                    ))}
                  </div>
                  {errors[key as keyof typeof errors] && (
                    <div className="text-red-500 mt-1">
                      {errors[key as keyof typeof errors]?.message}
                    </div>
                  )}
                </div>
              );
            }
            return null;
          })}
          <button
            type="submit"
            className={twMerge(
              baseClasses.button,
              'bg-blue-500 hover:bg-blue-700'
            )}
          >
            {isEditing ? 'Update' : 'Add'}
          </button>
          <button
            type="button"
            onClick={onFormResetHandler}
            className={twMerge(
              baseClasses.button,
              'bg-gray-500 hover:bg-gray-700 ml-4'
            )}
          >
            {isEditing ? 'Cancel' : 'Clear'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default TodoList;
