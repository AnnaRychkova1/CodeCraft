import dotenv from "dotenv";
import { createClient } from "@supabase/supabase-js";
import { v4 as uuidv4 } from "uuid";

dotenv.config();

const supabase = createClient(
  process.env.SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

async function seed() {
  try {
    const javaFactorialTaskId = uuidv4();
    const javaFactorialCodeId = uuidv4();

    await supabase.from("task").insert([
      {
        id: javaFactorialTaskId,
        title: "Factorial in Java",
        description:
          "Write a method that returns the factorial of a given number using recursion.",
        level: "intermediate",
        language: "java",
        type: "practice",
      },
    ]);

    await supabase.from("code_task").insert([
      {
        id: javaFactorialCodeId,
        task_id: javaFactorialTaskId,
        prompt:
          "Implement a method `public int factorial(int n)` that returns the factorial of the number n.",
        starter_code:
          "public class FactorialTask {\\[4]public int factorial(int n) {\\n[8]// your code here\\n[8]return 1;\\n[4]}\\n}",
      },
    ]);

    await supabase.from("test_case").insert([
      { code_task_id: javaFactorialCodeId, input: [0], expected: 1 },
      { code_task_id: javaFactorialCodeId, input: [3], expected: 6 },
      { code_task_id: javaFactorialCodeId, input: [5], expected: 120 },
    ]);

    const javaPalindromeTaskId = uuidv4();
    const javaPalindromeCodeId = uuidv4();

    await supabase.from("task").insert([
      {
        id: javaPalindromeTaskId,
        title: "Palindrome Checker in Java",
        description:
          "Check if a given string is a palindrome (reads the same forwards and backwards).",
        level: "advanced",
        language: "java",
        type: "practice",
      },
    ]);

    await supabase.from("code_task").insert([
      {
        id: javaPalindromeCodeId,
        task_id: javaPalindromeTaskId,
        prompt:
          "Implement a method `public boolean isPalindrome(String s)` that returns true if the string is a palindrome.",
        starter_code:
          "public class PalindromeChecker {\\n[4]public boolean isPalindrome(String s) {\\n[8]// your code here\\n[8]return false;\\n[4]}\\n}",
      },
    ]);

    await supabase.from("test_case").insert([
      {
        code_task_id: javaPalindromeCodeId,
        input: ["racecar"],
        expected: true,
      },
      { code_task_id: javaPalindromeCodeId, input: ["hello"], expected: false },
      { code_task_id: javaPalindromeCodeId, input: ["madam"], expected: true },
    ]);

    const pythonListSumTaskId = uuidv4();
    const pythonListSumCodeId = uuidv4();

    await supabase.from("task").insert([
      {
        id: pythonListSumTaskId,
        title: "Sum of List Elements in Python",
        description:
          "Write a function that returns the sum of all elements in a list.",
        level: "intermediate",
        language: "python",
        type: "practice",
      },
    ]);

    await supabase.from("code_task").insert([
      {
        id: pythonListSumCodeId,
        task_id: pythonListSumTaskId,
        prompt:
          "Implement a function `def list_sum(lst):` that returns the sum of all integers in the list.",
        starter_code: "def list_sum(lst):\\n[4]# your code here\\n[4]return 0",
      },
    ]);

    await supabase.from("test_case").insert([
      { code_task_id: pythonListSumCodeId, input: [[1, 2, 3]], expected: 6 },
      { code_task_id: pythonListSumCodeId, input: [[5, -2, 7]], expected: 10 },
      { code_task_id: pythonListSumCodeId, input: [[]], expected: 0 },
    ]);

    const pythonAnagramTaskId = uuidv4();
    const pythonAnagramCodeId = uuidv4();

    await supabase.from("task").insert([
      {
        id: pythonAnagramTaskId,
        title: "Anagram Checker in Python",
        description:
          "Write a function to check if two strings are anagrams of each other.",
        level: "advanced",
        language: "python",
        type: "practice",
      },
    ]);

    await supabase.from("code_task").insert([
      {
        id: pythonAnagramCodeId,
        task_id: pythonAnagramTaskId,
        prompt:
          "Implement a function `def is_anagram(s1, s2):` that returns True if the strings are anagrams.",
        starter_code:
          "def is_anagram(s1, s2):\\n[4]# your code here\\n[4]return False",
      },
    ]);

    await supabase.from("test_case").insert([
      {
        code_task_id: pythonAnagramCodeId,
        input: ["listen", "silent"],
        expected: true,
      },
      {
        code_task_id: pythonAnagramCodeId,
        input: ["hello", "world"],
        expected: false,
      },
      {
        code_task_id: pythonAnagramCodeId,
        input: ["evil", "vile"],
        expected: true,
      },
    ]);

    const javaPracticeTaskId = uuidv4();
    const javaCodeTaskId = uuidv4();

    const { error: javaTaskError } = await supabase.from("task").insert([
      {
        id: javaPracticeTaskId,
        title: "Sum of Two Numbers in Java",
        description:
          "Implement a method that takes two integers and returns their sum.",
        level: "beginner",
        language: "java",
        type: "practice",
      },
    ]);
    if (javaTaskError) throw javaTaskError;

    const { error: javaCodeTaskError } = await supabase
      .from("code_task")
      .insert([
        {
          id: javaCodeTaskId,
          task_id: javaPracticeTaskId,
          prompt:
            "Implement the method `public int sum(int a, int b)` that returns the sum of two numbers.",
          starter_code: `public class SumTask {\\n[4]public int sum(int a, int b) {\\n[8]// your code here\\n[8]return 0;\\n[4]}\\n}`,
        },
      ]);
    if (javaCodeTaskError) throw javaCodeTaskError;

    const { error: javaTestsError } = await supabase.from("test_case").insert([
      { code_task_id: javaCodeTaskId, input: [1, 2], expected: 3 },
      { code_task_id: javaCodeTaskId, input: [-3, 5], expected: 2 },
      { code_task_id: javaCodeTaskId, input: [100, 250], expected: 350 },
    ]);
    if (javaTestsError) throw javaTestsError;

    const pythonPracticeTaskId = uuidv4();
    const pythonCodeTaskId = uuidv4();

    const { error: pythonTaskError } = await supabase.from("task").insert([
      {
        id: pythonPracticeTaskId,
        title: "Sum of Two Numbers in Python",
        description:
          "Write a function that takes two numbers and returns their sum.",
        level: "beginner",
        language: "python",
        type: "practice",
      },
    ]);
    if (pythonTaskError) throw pythonTaskError;

    const { error: pythonCodeTaskError } = await supabase
      .from("code_task")
      .insert([
        {
          id: pythonCodeTaskId,
          task_id: pythonPracticeTaskId,
          prompt:
            "Implement a function `def sum(a, b):` that returns the sum of two numbers.",
          starter_code: `def sum(a, b):\\n[4]# your code here\\n[4]pass`,
        },
      ]);
    if (pythonCodeTaskError) throw pythonCodeTaskError;

    const { error: pythonTestsError } = await supabase
      .from("test_case")
      .insert([
        { code_task_id: pythonCodeTaskId, input: [1, 2], expected: 3 },
        { code_task_id: pythonCodeTaskId, input: [-3, 5], expected: 2 },
        { code_task_id: pythonCodeTaskId, input: [100, 250], expected: 350 },
      ]);
    if (pythonTestsError) throw pythonTestsError;

    console.log("✅ Seed completed successfully.");
  } catch (error) {
    console.error("❌ Seed failed:", error);
  }
}

seed();
