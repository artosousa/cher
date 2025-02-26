import React from 'react';

import { useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Plus, Rocket } from "lucide-react";

const MyDialog = () => {
  const [taskName, setTaskName] = useState<string>(""); // State for task name
  const taskInputRef = useRef<HTMLInputElement | null>(null); // Reference to the task input

  // Function to handle adding a new task
  const addTask = async (taskData: { name: string }) => {
    const idToken = localStorage.getItem("idToken");

    if (!idToken) {
      alert("User is not authenticated");
      return;
    }

    const formData = new FormData();
    formData.append("name", taskData.name);

    try {
      const response = await fetch("/api/tasks", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${idToken}`, // Include the auth token
        },
        body: formData,
      });

      if (!response.ok) {
        const errorText = await response.text();
        console.error("Failed to add task:", errorText);
        alert(`Failed to add task: ${errorText}`);
      } else {
        console.log("Task added successfully!");
        window.location.href = "/dashboard";
      }
    } catch (error) {
      console.error("An error occurred:", error);
      alert("Error adding Task, please try again.");
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!taskName) {
      alert("Task name is required");
      return;
    }

    const taskData = { name: taskName };
    await addTask(taskData);
  };

  // Focus the input when the component mounts
  React.useEffect(() => {
    if (taskInputRef.current) {
      taskInputRef.current.focus();
    }
  }, []);

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="outline">
          <Plus />
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle className="flex flex-row gap-2 items-center"> Add Task <Rocket color="black"  /></DialogTitle>
          <DialogDescription>
            Every task you complete is a step closer to your goals! Keep your momentum and watch your progress grow!
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <form id="addTaskForm" encType="multipart/form-data" onSubmit={handleSubmit}>
            <input
              ref={taskInputRef}
              autoFocus
              placeholder="Task Name"
              className="p-2 focus:outline-0 w-full border-b-[#003246] border-b-1 mb-4"
              type="text"
              name="name"
              value={taskName}
              onChange={(e) => setTaskName(e.target.value)}
              required
            />
            <Button type="submit" className="w-full mt-4 mb-4 bg-[#003246] text-white cursor-pointer hover:bg-[#095870]">
              <Plus /> Add Task
            </Button>
          </form>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default MyDialog;
