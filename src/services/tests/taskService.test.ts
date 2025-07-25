import fetchMock from "jest-fetch-mock";
import {
  fetchTasks,
  fetchTaskById,
  submitUserTaskResult,
  fetchUserProgress,
  createTask,
  updateTask,
  deleteTask,
} from "@/services/tasks";
import type { TaskFormData, TasksResponse } from "@/types/tasksTypes";
import type { ApiResponseMessage } from "@/types/commonTypes";
import type {
  SubmitUserTaskBody,
  UserProgressResponse,
} from "@/types/userTypes";

const formData: TaskFormData = {
  title: "Test Task",
  description: "This is a test task.",
  level: "beginner",
  language: "javascript",
  type: "theory",
  theory_question: [
    {
      question: "What is JavaScript?",
      options: ["Language", "Tool", "Coffee"],
      correct_answer: ["Language"],
    },
  ],
  code_task: [],
};

const theoryTaskData: TaskFormData = {
  title: "Theory Task",
  description: "Description",
  level: "beginner",
  language: "javascript",
  type: "theory",
  theory_question: [
    {
      question: "What is JS?",
      options: ["Lang", "Tool"],
      correct_answer: ["Lang"],
    },
  ],
  code_task: [],
};

const practiceTaskData: TaskFormData = {
  title: "Practice Task",
  description: "Description",
  level: "intermediate",
  language: "python",
  type: "practice",
  theory_question: [],
  code_task: [
    {
      prompt: "Write function",
      starter_code: "def func(): pass",
      test_case: [
        { input: ["1"], expected: "1" },
        { input: ["2"], expected: "2" },
      ],
    },
  ],
};

beforeEach(() => {
  fetchMock.resetMocks();
});

describe("taskService", () => {
  test("fetchTasks: returns tasks and userTasks for authenticated user", async () => {
    const mockResponse: TasksResponse = {
      tasks: [
        {
          id: "1",
          title: "Test",
          description: "",
          level: "beginner",
          language: "javascript",
          type: "theory",
        },
      ],
      userTasks: [
        { task_id: "1", submitted: true, result: 100, solution: "abc" },
      ],
    };
    fetchMock.mockResponseOnce(JSON.stringify(mockResponse));

    const res: TasksResponse = await fetchTasks();

    expect(fetchMock).toHaveBeenCalledWith("/api/public/tasks");
    expect(res.tasks.length).toBe(1);
    expect(res.userTasks?.length).toBe(1);
    expect(res).toEqual(mockResponse);
  });

  test("fetchTasks: returns only tasks for unauthenticated user", async () => {
    const mockResponse: TasksResponse = {
      tasks: [
        {
          id: "2",
          title: "Public Task",
          description: "Open task",
          level: "intermediate",
          language: "java",
          type: "practice",
        },
      ],
      // userTasks optional and absent here
    };

    fetchMock.mockResponseOnce(JSON.stringify(mockResponse));

    const res: TasksResponse = await fetchTasks();

    expect(fetchMock).toHaveBeenCalledWith("/api/public/tasks");
    expect(res.tasks.length).toBe(1);
    expect(res.userTasks).toBeUndefined();
  });

  test("fetchTasks: throws error on 401 (session expired)", async () => {
    const errorResponse = {
      error: "Your session has expired. Please log in again.",
    };
    fetchMock.mockResponseOnce(JSON.stringify(errorResponse), { status: 401 });

    await expect(fetchTasks()).rejects.toThrow(
      "Your session has expired. Please log in again."
    );
  });

  test("fetchTasks: throws error on 500 Internal Server Error", async () => {
    const errorResponse = { error: "Internal Server Error" };
    fetchMock.mockResponseOnce(JSON.stringify(errorResponse), { status: 500 });

    await expect(fetchTasks()).rejects.toThrow("Internal Server Error");
  });

  test("fetchTaskById: returns task and userTask for authenticated user", async () => {
    const mockResponse = {
      task: {
        id: "123",
        title: "Title",
        description: "",
        level: "beginner",
        language: "javascript",
        type: "theory",
        theory_question: [],
        code_task: [],
      },
      userTask: {
        task_id: "123",
        submitted: true,
        result: 100,
        solution: "code",
      },
    };

    fetchMock.mockResponseOnce(JSON.stringify(mockResponse));

    const res = await fetchTaskById("123");

    expect(fetchMock).toHaveBeenCalledWith("/api/public/task/123", {
      cache: "no-store",
    });
    expect(res).toEqual(mockResponse);
  });

  test("fetchTaskById: returns only task for unauthenticated user", async () => {
    const mockResponse = {
      task: {
        id: "456",
        title: "Public Task",
        description: "Desc",
        level: "intermediate",
        language: "typescript",
        type: "practice",
        theory_question: [],
        code_task: [],
      },
    };

    fetchMock.mockResponseOnce(JSON.stringify(mockResponse));

    const res = await fetchTaskById("456");

    expect(fetchMock).toHaveBeenCalledWith("/api/public/task/456", {
      cache: "no-store",
    });
    expect(res.task.title).toBe("Public Task");
    expect(res.userTask).toBeUndefined();
  });

  test("fetchTaskById: throws error on 404", async () => {
    const errorResponse = { error: "Task not found" };

    fetchMock.mockResponseOnce(JSON.stringify(errorResponse), {
      status: 404,
    });

    await expect(fetchTaskById("404")).rejects.toThrow("Task not found");
  });

  test("fetchTaskById: throws error on 401 session expired", async () => {
    const errorResponse = {
      error: "Your session has expired. Please log in again.",
    };

    fetchMock.mockResponseOnce(JSON.stringify(errorResponse), {
      status: 401,
    });

    await expect(fetchTaskById("123")).rejects.toThrow(
      "Your session has expired. Please log in again."
    );
  });

  test("fetchTaskById: throws error on 500 internal server error", async () => {
    const errorResponse = { error: "Internal Server Error" };

    fetchMock.mockResponseOnce(JSON.stringify(errorResponse), {
      status: 500,
    });

    await expect(fetchTaskById("123")).rejects.toThrow("Internal Server Error");
  });

  test("submitUserTaskResult: submits full payload (result + solution)", async () => {
    const payload: SubmitUserTaskBody = {
      result: 100,
      solution: "abc",
      submitted: true,
    };
    const mockResponse: ApiResponseMessage = {
      message: "Your result is saved",
      id: "inserted-id",
    };

    fetchMock.mockResponseOnce(JSON.stringify(mockResponse));

    const res = await submitUserTaskResult("42", payload);

    expect(fetchMock).toHaveBeenCalledWith(
      "/api/user/task/42",
      expect.objectContaining({
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      })
    );

    expect(res).toEqual(mockResponse);
  });

  test("submitUserTaskResult: submits only solution", async () => {
    const payload: SubmitUserTaskBody = {
      submitted: true,
      solution: "console.log('hi')",
    };
    const mockResponse: ApiResponseMessage = {
      message: "Your solution is saved",
    };

    fetchMock.mockResponseOnce(JSON.stringify(mockResponse));

    const res = await submitUserTaskResult("101", payload);

    expect(fetchMock).toHaveBeenCalledWith(
      "/api/user/task/101",
      expect.objectContaining({
        method: "POST",
        body: JSON.stringify(payload),
      })
    );

    expect(res.message).toBe("Your solution is saved");
  });

  test("submitUserTaskResult: submits only result", async () => {
    const payload: SubmitUserTaskBody = { submitted: true, result: 80 };
    const mockResponse: ApiResponseMessage = {
      message: "Your new result is saved",
    };

    fetchMock.mockResponseOnce(JSON.stringify(mockResponse));

    const res = await submitUserTaskResult("99", payload);

    expect(fetchMock).toHaveBeenCalledWith(
      "/api/user/task/99",
      expect.objectContaining({
        method: "POST",
        body: JSON.stringify(payload),
      })
    );

    expect(res.message).toMatch(/result.*saved/);
  });

  test("submitUserTaskResult: throws unauthorized if no session", async () => {
    const payload: SubmitUserTaskBody = { submitted: true, result: 0 };

    const errorResponse: ApiResponseMessage = { message: "Unauthorized" };

    fetchMock.mockResponseOnce(JSON.stringify(errorResponse), {
      status: 401,
    });

    await expect(submitUserTaskResult("1000", payload)).rejects.toThrow(
      "Unauthorized"
    );
  });

  test("submitUserTaskResult: throws on server error", async () => {
    const payload: SubmitUserTaskBody = { submitted: true };

    fetchMock.mockResponseOnce(
      JSON.stringify({ error: "Failed to save user task result" }),
      { status: 500 }
    );

    await expect(submitUserTaskResult("666", payload)).rejects.toThrow(
      "Failed to save user task result"
    );
  });

  test("fetchUserProgress: should successfully fetch user progress", async () => {
    const mockProgress: UserProgressResponse = {
      allTasks: 10,
      doneTasks: 5,
      theory: 3,
      practice: 2,
    };

    fetchMock.mockResponseOnce(JSON.stringify(mockProgress));

    const res = await fetchUserProgress();

    expect(fetchMock).toHaveBeenCalledWith("/api/user/progress", {
      cache: "no-store",
    });
    expect(res).toEqual(mockProgress);
  });

  test("fetchUserProgress: throws error if unauthorized (no session)", async () => {
    const errorResponse = { error: "Unauthorized" };

    fetchMock.mockResponseOnce(JSON.stringify(errorResponse), { status: 401 });

    await expect(fetchUserProgress()).rejects.toThrow("Unauthorized");
  });

  test("fetchUserProgress: throws session expired error (Supabase PGRST301)", async () => {
    const errorResponse = {
      error: "Your session has expired. Please log in again.",
    };

    fetchMock.mockResponseOnce(JSON.stringify(errorResponse), { status: 401 });

    await expect(fetchUserProgress()).rejects.toThrow(
      "Your session has expired. Please log in again."
    );
  });

  test("fetchUserProgress: throws 500 if progress fetch fails", async () => {
    const errorResponse = { error: "Failed to fetch progress" };

    fetchMock.mockResponseOnce(JSON.stringify(errorResponse), { status: 500 });

    await expect(fetchUserProgress()).rejects.toThrow(
      "Failed to fetch progress"
    );
  });

  test("fetchUserProgress: throws error if user not found", async () => {
    const errorResponse = { error: "User not found" };

    fetchMock.mockResponseOnce(JSON.stringify(errorResponse), { status: 500 });

    await expect(fetchUserProgress()).rejects.toThrow("User not found");
  });

  test("createTask: successfully creates theory task", async () => {
    fetchMock.mockResponseOnce(
      JSON.stringify({ message: "Task created successfully", id: "task-id-1" })
    );

    const res = await createTask(theoryTaskData);

    expect(fetchMock).toHaveBeenCalledWith("/api/admin/tasks", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(theoryTaskData),
      credentials: "include",
    });
    const responseMessage: ApiResponseMessage = {
      message: "Task created successfully",
      id: "task-id-1",
    };
    expect(res).toEqual(responseMessage);
  });

  test("createTask: successfully creates practice task with code_task and test cases", async () => {
    fetchMock.mockResponseOnce(
      JSON.stringify({ message: "Task created successfully", id: "task-id-2" })
    );

    const res = await createTask(practiceTaskData);

    expect(fetchMock).toHaveBeenCalledWith("/api/admin/tasks", {
      headers: { "Content-Type": "application/json" },
      method: "POST",
      body: JSON.stringify(practiceTaskData),
      credentials: "include",
    });

    const responseMessage: ApiResponseMessage = {
      message: "Task created successfully",
      id: "task-id-2",
    };

    expect(res).toEqual(responseMessage);
  });

  test("createTask: returns error if theory_question is not an array for theory task", async () => {
    const invalidTheoryTask = {
      ...theoryTaskData,
      theory_question: "invalid_format",
    } as unknown as TaskFormData;

    fetchMock.mockResponseOnce(
      JSON.stringify({ error: "Invalid theory_question format" }),
      { status: 400 }
    );

    await expect(createTask(invalidTheoryTask)).rejects.toThrow(
      "Invalid theory_question format"
    );
  });

  test("createTask: returns error if theory_question options are invalid", async () => {
    const invalidTask = {
      ...theoryTaskData,
      theory_question: [
        {
          question: "Incomplete question",
          options: "not-an-array",
          correct_answer: ["Lang"],
        },
      ],
    } as unknown as TaskFormData;

    fetchMock.mockResponseOnce(
      JSON.stringify({ error: "Invalid options format in theory_question" }),
      { status: 400 }
    );

    await expect(createTask(invalidTask)).rejects.toThrow(
      "Invalid options format in theory_question"
    );
  });

  test("createTask: returns error if test_case is not array", async () => {
    const invalidTask = {
      ...practiceTaskData,
      code_task: [
        {
          prompt: "Do stuff",
          starter_code: "some code",
          test_case: "not-array",
        },
      ],
    } as unknown as TaskFormData;

    fetchMock.mockResponseOnce(
      JSON.stringify({ error: "Invalid test_case format" }),
      { status: 400 }
    );

    await expect(createTask(invalidTask)).rejects.toThrow(
      "Invalid test_case format"
    );
  });

  test("createTask: returns error on invalid code_task format in practice task", async () => {
    const invalidPracticeTask = {
      ...practiceTaskData,
      code_task: "invalid_format",
    } as unknown as TaskFormData;

    fetchMock.mockResponseOnce(
      JSON.stringify({ error: "Invalid code_task format" }),
      { status: 400 }
    );

    await expect(createTask(invalidPracticeTask)).rejects.toThrow(
      "Invalid code_task format"
    );
  });

  test("createTask: throws error on server failure", async () => {
    fetchMock.mockResponseOnce(
      JSON.stringify({ error: "Internal Server Error" }),
      { status: 500 }
    );

    await expect(createTask(formData)).rejects.toThrow("Internal Server Error");
  });

  test("updateTask: updates theory task by ID successfully", async () => {
    const responseMessage: ApiResponseMessage = {
      message: "Task updated successfully",
    };
    fetchMock.mockResponseOnce(JSON.stringify(responseMessage));

    const res = await updateTask("task-id-123", theoryTaskData);

    expect(fetchMock).toHaveBeenCalledWith("/api/admin/task/task-id-123", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(theoryTaskData),
      credentials: "include",
    });

    expect(res).toEqual(responseMessage);
  });

  test("updateTask: updates code task by ID successfully", async () => {
    const responseMessage: ApiResponseMessage = {
      message: "Task updated successfully",
    };
    fetchMock.mockResponseOnce(JSON.stringify(responseMessage));

    const res = await updateTask("task-id-123", practiceTaskData);

    expect(fetchMock).toHaveBeenCalledWith("/api/admin/task/task-id-123", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(practiceTaskData),
      credentials: "include",
    });

    expect(res).toEqual(responseMessage);
  });

  test("updateTask: returns error if theory_question is not an array for theory task", async () => {
    const invalidTheoryTask = {
      ...theoryTaskData,
      theory_question: "invalid_format",
    } as unknown as TaskFormData;

    fetchMock.mockResponseOnce(
      JSON.stringify({ error: "Invalid theory_question format" }),
      { status: 400 }
    );

    await expect(updateTask("task-id-123", invalidTheoryTask)).rejects.toThrow(
      "Invalid theory_question format"
    );
  });

  test("updateTask: returns error if theory_question options are invalid", async () => {
    const invalidTask = {
      ...theoryTaskData,
      theory_question: [
        {
          question: "Incomplete question",
          options: "not-an-array",
          correct_answer: ["Lang"],
        },
      ],
    } as unknown as TaskFormData;

    fetchMock.mockResponseOnce(
      JSON.stringify({ error: "Invalid options format in theory_question" }),
      { status: 400 }
    );

    await expect(updateTask("task-id-123", invalidTask)).rejects.toThrow(
      "Invalid options format in theory_question"
    );
  });

  test("updateTask: returns error if test_case is not array", async () => {
    const invalidTask = {
      ...practiceTaskData,
      code_task: [
        {
          prompt: "Do stuff",
          starter_code: "some code",
          test_case: "not-array",
        },
      ],
    } as unknown as TaskFormData;

    fetchMock.mockResponseOnce(
      JSON.stringify({ error: "Invalid test_case format" }),
      { status: 400 }
    );

    await expect(updateTask("task-id-123", invalidTask)).rejects.toThrow(
      "Invalid test_case format"
    );
  });

  test("updateTask: returns 400 on invalid code_task format", async () => {
    const invalidUpdateData = {
      ...practiceTaskData,
      code_task: "invalid_format",
    } as unknown as TaskFormData;

    fetchMock.mockResponseOnce(
      JSON.stringify({ error: "Invalid code_task format" }),
      { status: 400 }
    );

    await expect(updateTask("task-id-123", invalidUpdateData)).rejects.toThrow(
      "Invalid code_task format"
    );
  });

  test("updateTask: returns 401 Unauthorized when no token", async () => {
    fetchMock.mockResponseOnce(
      JSON.stringify({ error: "Unauthorized: No token" }),
      { status: 401 }
    );

    await expect(updateTask("task-id-123", formData)).rejects.toThrow(
      "Unauthorized: No token"
    );
  });

  test("updateTask: returns 400 on invalid id", async () => {
    fetchMock.mockResponseOnce(
      JSON.stringify({ error: "Invalid or missing id" }),
      { status: 400 }
    );

    await expect(updateTask("", formData)).rejects.toThrow(
      "Invalid or missing id"
    );
  });

  test("updateTask: returns 500 on server error", async () => {
    fetchMock.mockResponseOnce(
      JSON.stringify({ error: "Internal Server Error" }),
      { status: 500 }
    );

    await expect(updateTask("task-id-123", formData)).rejects.toThrow(
      "Internal Server Error"
    );
  });

  test("deleteTask: deletes task by ID successfully", async () => {
    fetchMock.mockResponseOnce(
      JSON.stringify({ message: "Task deleted", id: "task-id-999" })
    );

    const res = await deleteTask("task-id-999");

    expect(fetchMock).toHaveBeenCalledWith("/api/admin/task/task-id-999", {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
    });

    const expected: ApiResponseMessage = {
      message: "Task deleted",
      id: "task-id-999",
    };

    expect(res).toEqual(expected);
  });

  test("deleteTask: returns 401 Unauthorized when no token", async () => {
    fetchMock.mockResponseOnce(
      JSON.stringify({ error: "Unauthorized: No token" }),
      { status: 401 }
    );

    await expect(deleteTask("task-id-999")).rejects.toThrow(
      "Unauthorized: No token"
    );
  });

  test("deleteTask: returns 404 if task not found", async () => {
    fetchMock.mockResponseOnce(
      JSON.stringify({ error: "Task not found or not deleted (RLS?)" }),
      { status: 404 }
    );

    await expect(deleteTask("nonexistent-id")).rejects.toThrow(
      "Task not found or not deleted (RLS?)"
    );
  });

  test("deleteTask: returns 500 on server error", async () => {
    fetchMock.mockResponseOnce(
      JSON.stringify({ error: "Internal Server Error" }),
      { status: 500 }
    );

    await expect(deleteTask("task-id-999")).rejects.toThrow(
      "Internal Server Error"
    );
  });
});
