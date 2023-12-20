import { GoPlus } from "react-icons/go";
import { RxDragHandleHorizontal } from "react-icons/rx";
import {
  SortableContext,
  verticalListSortingStrategy,
  useSortable,
  arrayMove,
} from "@dnd-kit/sortable";
import { DndContext, closestCenter } from "@dnd-kit/core";
import { CSS } from "@dnd-kit/utilities";
import { useState } from "react";
import "./Todo.css";

const SortableTodo = ({ todo, setTodos, index }) => {
  const { attributes, listeners, setNodeRef, transform, transition } =
    useSortable({ id: todo.title, axis: "y" });
  const style = {
    // transform: CSS.Transform.toString(transform),
    transform: `translateY(${transform ? transform.y : 0}px)`,
    transition: transition,
  };

  const alterTaskCompletion = () => {
    setTodos((prev) => {
      return prev.map((el) =>
        el.title === todo.title ? { ...el, isCompleted: !el.isCompleted } : el
      );
    });
  };

  return (
    <div className="todo__item" ref={setNodeRef} style={style}>
      <RxDragHandleHorizontal
        style={{ cursor: "grab", outline: "none" }}
        {...attributes}
        {...listeners}
      />
      <input
        type="checkbox"
        name={todo.title}
        checked={todo.isCompleted}
        onChange={alterTaskCompletion}
      />
      <label
        className={todo.isCompleted ? "completed" : ""}
        htmlFor={todo.title}
      >
        {todo.title}
      </label>
    </div>
  );
};

export const Todo = () => {
  const [todos, setTodos] = useState([
    { title: "Identify and contextualize problem", isCompleted: true },
    { title: "Present ideas and changes to team", isCompleted: false },
    { title: "Prepare user flow", isCompleted: true },
    { title: "Prepare design style guide", isCompleted: true },
    { title: "Delivery stage: test and release", isCompleted: true },
  ]);

  const onDragEnd = (event) => {
    const { active, over } = event;
    if (!active?.id || !over?.id) {
      return;
    }

    if (active.id === over.id) {
      return;
    }
    setTodos((todo) => {
      const oldIndex = todo.findIndex((todo) => todo.title === active.id);
      const newIndex = todo.findIndex((todo) => todo.title === over.id);
      return arrayMove(todo, oldIndex, newIndex);
    });
  };

  const totalCompleted = todos.reduce(
    (acc, { isCompleted }) => acc + isCompleted,
    0
  );
  return (
    <div className="todo">
      <div className="todo__header">
        <img
          src="https://intellsys-optimizer.b-cdn.net/interviews/978ea909-91ec-49c2-bd69-d494c097d38d/header.jpg"
          alt="header"
        />
        <h1>todo</h1>
      </div>
      <div className="todo__wrapper_header">
        <h2>Task List</h2>
        <p>
          {totalCompleted}/{todos.length} Done
        </p>
      </div>
      <div className="todo__wrapper">
        <DndContext collisionDetection={closestCenter} onDragEnd={onDragEnd}>
          <SortableContext
            items={todos.map((todo, i) => todo.title)}
            strategy={verticalListSortingStrategy}
          >
            {todos.map((todo, i) => (
              <SortableTodo
                key={todo.title}
                todo={todo}
                setTodos={setTodos}
                index={i}
              />
            ))}
          </SortableContext>
        </DndContext>
      </div>
      <button className="todo__add_btn">
        <GoPlus /> Add Task
      </button>
    </div>
  );
};
