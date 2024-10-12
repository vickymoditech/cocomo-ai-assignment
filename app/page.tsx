"use client";
import { Todo } from "@prisma/client";
import { useState, useEffect, useCallback } from "react";
import Img from "./img";

export default function Home() {
  const initialTodo: Todo = {
    id: 0,
    title: "",
    imageUrl: "",
    dueDate: new Date(), // set the due date to today
    createdAt: new Date(),
  };

  const [newTodo, setNewTodo] = useState<Todo>({ ...initialTodo });
  const [todos, setTodos] = useState<Todo[]>([]);
  const [loading, setLoading] = useState(false);

  // Fetch todos from the server and update the state
  const fetchTodos = useCallback(async () => {
    try {
      setLoading(true);
      const res = await fetch("/api/todos");
      const data = await res.json();
      setTodos(data);
    } catch (error) {
      console.error("Failed to fetch todos:", error);
    } finally {
      setLoading(false);
    }
  }, []);

  // Fetch todos on initial render
  useEffect(() => {
    fetchTodos();
  }, []);

  // Handle input change
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    const fieldValue = name === "dueDate" ? new Date(value) : value;

    setNewTodo((prev) => ({
      ...prev,
      [name]: fieldValue,
    }));
  };

  // Add a new todo
  const handleAddTodo = async () => {
    if (!newTodo.title.trim()) return;
    try {
      setLoading(true);
      const res = await fetch("/api/todos", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newTodo),
      });
      if (!res.ok) {
        throw new Error("Failed to add todo");
      }
      setNewTodo({ ...initialTodo });
      setTodos([...todos, await res.json()]);
    } catch (error) {
      console.error("Failed to add todo:", error);
    } finally {
      setLoading(false);
    }
  };

  // Delete a todo
  const handleDeleteTodo = async (id: number) => {
    try {
      setLoading(true);
      const res = await fetch(`/api/todos/${id}`, {
        method: "DELETE",
      });
      if (res.ok) {
        const findIndex = todos.findIndex((todo) => todo.id === id);
        todos.splice(findIndex, 1);
        setTodos([...todos]);
      }
    } catch (error) {
      console.error("Failed to delete todo:", error);
    } finally {
      setLoading(false);
    }
  };

  // Render todos
  const renderTodos = (todo: Todo) => {
    const isDueDatePast =
      new Date(todo.dueDate).getDate() < new Date().getDate();
    return (
      <li
        key={todo.id}
        className="flex justify-between items-center bg-white bg-opacity-90 p-4 mb-4 hover:bg-slate-300 rounded-lg shadow-lg"
      >
        <span className="text-gray-800">{todo.title}</span>
        <span className={isDueDatePast ? "text-red-500" : "text-gray-800"}>
          {new Date(todo.dueDate).toLocaleDateString()}
        </span>

        <div className="w-[150px] h-[110px] relative">
          <Img src={todo.imageUrl!} title={todo.title} />
        </div>

        <button
          onClick={() => handleDeleteTodo(todo.id)}
          className="text-red-500 hover:text-red-700 transition duration-300"
        >
          <svg
            className="w-6 h-6"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M6 18L18 6M6 6l12 12"
            />
          </svg>
        </button>
      </li>
    );
  };

  const loader = () => {
    return (
      <div className="flex-col gap-4 flex items-center justify-center fixed top-0 right-0 bottom-0 left-0 bg-[#0000004f]	z-[9999]">
        <div className="w-28 h-28 border-8 text-blue-400 text-4xl animate-spin border-gray-300 flex items-center justify-center border-t-blue-400 rounded-full"></div>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-orange-500 to-red-500 flex flex-col items-center p-4">
      <div className="w-full max-w-md">
        <h1 className="text-4xl font-bold text-center text-white mb-8">
          Things To Do App
        </h1>
        <div className="flex mb-6">
          <input
            type="text"
            className="flex-grow p-3 rounded-l-full focus:outline-none text-gray-700"
            placeholder="Add a new todo"
            name="title"
            required
            value={newTodo.title}
            onChange={handleChange}
          />
          <input
            type="date"
            name="dueDate"
            className="text-gray-700"
            required
            value={newTodo.dueDate.toISOString().split("T")[0]}
            onChange={handleChange}
          />
          <button
            onClick={handleAddTodo}
            className="bg-white text-indigo-600 p-3 rounded-r-full hover:bg-gray-100 transition duration-300"
          >
            {loading ? "Adding..." : "Add"}
          </button>
        </div>
        <ul>{todos.map(renderTodos)}</ul>
        {loading && loader()}
      </div>
    </div>
  );
}
