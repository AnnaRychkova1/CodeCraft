import type { InitialTask } from "@/types/tasksTypes";
export const initialTasks: InitialTask[] = [
  // 1. Factorial
  {
    title: "Factorial in Java",
    description:
      "Write a method that returns the factorial of a given number using recursion.",
    level: "intermediate",
    language: "java",
    type: "practice",
    code_task: [
      {
        prompt:
          "Implement a method `public int factorial(int n)` that returns the factorial of the number n.\nThe factorial of a number is the product of all positive integers less than or equal to that number.\n\nExamples:\nInput: 0, Output: 1\nInput: 5, Output: 120\nInput: 7, Output: 5040",
        starter_code:
          "public class FactorialTask {\\n[4]public int factorial(int n) {\\n[8]// your code here\\n[8]return 1;\\n[4]}\\n}",
        test_case: [
          { input: [0], expected: 1 },
          { input: [1], expected: 1 },
          { input: [5], expected: 120 },
          { input: [7], expected: 5040 },
        ],
      },
    ],
  },
  {
    title: "Factorial in Python",
    description: "Write a function to compute factorial using recursion.",
    level: "intermediate",
    language: "python",
    type: "practice",
    code_task: [
      {
        prompt:
          "Implement a function `def factorial(n):` that returns the factorial of the number n.\nThe factorial of a number is the product of all positive integers less than or equal to that number.\n\nExamples:\nInput: 0, Output: 1\nInput: 5, Output: 120\nInput: 7, Output: 5040",
        starter_code: "def factorial(n):\\n[4]# your code here\\n[4]return 1",
        test_case: [
          { input: [0], expected: 1 },
          { input: [3], expected: 6 },
          { input: [4], expected: 24 },
          { input: [6], expected: 720 },
        ],
      },
    ],
  },
  {
    title: "Factorial in JavaScript",
    description: "Compute factorial recursively.",
    level: "intermediate",
    language: "javascript",
    type: "practice",
    code_task: [
      {
        prompt:
          "Implement a function `function factorial(n)` that returns the factorial of the number n.\nThe factorial of a number is the product of all positive integers less than or equal to that number.\n\nExamples:\nInput: 0, Output: 1\nInput: 5, Output: 120\nInput: 7, Output: 5040",
        starter_code:
          "function factorial(n) {\\n[4]// your code here\\n[4]return 1;\\n}",
        test_case: [
          { input: [0], expected: 1 },
          { input: [2], expected: 2 },
          { input: [5], expected: 120 },
          { input: [8], expected: 40320 },
        ],
      },
    ],
  },

  // 2. Palindrome
  {
    title: "Palindrome Checker in Java",
    description: "Check if a string is a palindrome.",
    language: "java",
    level: "advanced",
    type: "practice",
    code_task: [
      {
        prompt:
          'Implement a method `public boolean isPalindrome (String s)` that checks if a string is a palindrome.\nA palindrome is a string that reads the same forwards and backwards.\n\nExamples:\nInput: "racecar", Output: true\nInput: "hello", Output: false\nInput: "", Output: true',
        starter_code:
          "public class PalindromeChecker {\\n[4]public boolean isPalindrome(String s) {\\n[8]// your code here\\n[8]return false;\\n[4]}\\n}",
        test_case: [
          {
            input: ["racecar"],
            expected: true,
          },
          {
            input: ["hello"],
            expected: false,
          },
          {
            input: [""],
            expected: true,
          },
        ],
      },
    ],
  },
  {
    title: "Palindrome Checker in Python",
    description:
      "Check whether a string reads the same forwards and backwards.",
    language: "python",
    level: "advanced",
    type: "practice",
    code_task: [
      {
        prompt:
          'Implement a function `def is_palindrome(s):` that checks if a string is a palindrome.\n\nA palindrome is a string that reads the same forwards and backwards.\n\nExamples:\nInput: "racecar", Output: True\nInput: "hello", Output: False\nInput: "", Output: True',
        starter_code:
          "def is_palindrome(s):\\n[4]# your code here\\n[4]return False",
        test_case: [
          {
            input: ["racecar"],
            expected: true,
          },
          {
            input: ["hello"],
            expected: false,
          },
          {
            input: [""],
            expected: true,
          },
        ],
      },
    ],
  },
  {
    title: "Palindrome Checker in JavaScript",
    description: "Check if a string is a palindrome.",
    language: "javascript",
    level: "advanced",
    type: "practice",
    code_task: [
      {
        prompt:
          'Implement a function `function isPalindrome(s)` that checks if a string is a palindrome.\nA palindrome is a string that reads the same forwards and backwards.\n\nExamples:\nInput: "racecar", Output: true\nInput: "hello", Output: false\nInput: "", Output: true',
        starter_code:
          "function isPalindrome(s) {\\n[4]// your code here\\n[4]return false;\\n}",
        test_case: [
          {
            input: ["racecar"],
            expected: true,
          },
          {
            input: ["hello"],
            expected: false,
          },
          {
            input: [""],
            expected: true,
          },
        ],
      },
    ],
  },

  // 3. ListSum
  {
    title: "Sum of List Elements in Java",
    description: "Return the sum of all elements in an array.",
    language: "java",
    level: "intermediate",
    type: "practice",
    code_task: [
      {
        prompt:
          "Implement a method `public int listSum(int[] arr)` that returns the sum of all elements in the array.\n\nExamples:\nInput: [1, 2, 3], Output: 6\nInput: [0, 0, 0], Output: 0\nInput: [5, -2, 7], Output: 10",
        starter_code:
          "public class ListSum {\\n[4]public int listSum(int[] arr) {\\n[8]// your code here\\n[8]return 0;\\n[4]}\\n}",
        test_case: [
          { input: [[1, 2, 3]], expected: 6 },
          { input: [[0, 0, 0]], expected: 0 },
          { input: [[5, -2, 7]], expected: 10 },
        ],
      },
    ],
  },
  {
    title: "Sum of List Elements in Python",
    description: "Return the sum of all elements in a list.",
    language: "python",
    level: "intermediate",
    type: "practice",
    code_task: [
      {
        prompt:
          "Implement a function `def list_sum(lst):` that returns the sum of all elements in the list.\n\nExamples:\nInput: [1, 2, 3], Output: 6\nInput: [0, 0, 0], Output: 0\nInput: [5, -2, 7], Output: 10",
        starter_code: "def list_sum(lst):\\n[4]# your code here\\n[4]return 0",
        test_case: [
          { input: [[1, 2, 3]], expected: 6 },
          { input: [[0, 0, 0]], expected: 0 },
          { input: [[5, -2, 7]], expected: 10 },
        ],
      },
    ],
  },
  {
    title: "Sum of Array in JavaScript",
    description: "Return the sum of an array of numbers.",
    language: "javascript",
    level: "intermediate",
    type: "practice",
    code_task: [
      {
        prompt:
          "Implement a function `function listSum(arr)` that returns the sum of all numbers in the array.\n\nExamples:\nInput: [1, 2, 3], Output: 6\nInput: [0, 0, 0], Output: 0\nInput: [5, -2, 7], Output: 10",
        starter_code:
          "function listSum(arr) {\\n[4]// your code here\\n[4]return 0;\\n}",
        test_case: [
          { input: [[1, 2, 3]], expected: 6 },
          { input: [[0, 0, 0]], expected: 0 },
          { input: [[5, -2, 7]], expected: 10 },
        ],
      },
    ],
  },

  // 4. Anagram
  {
    title: "Anagram Checker in Java",
    description: "Check if two strings are anagrams.",
    language: "java",
    level: "advanced",
    type: "practice",
    code_task: [
      {
        prompt:
          'Implement a method `public boolean isAnagram(String a, String b)` that checks if two strings are anagrams.\nTwo strings are anagrams if they contain the same characters in a different order.\n\nExamples:\nInput: a = "listen", b = "silent", Output: true\nInput: a = "hello", b = "world", Output: false\nInput: a = "triangle", b = "integral", Output: true',
        starter_code:
          "public class AnagramChecker {\\n[4]public boolean isAnagram(String a, String b) {\\n[8]// your code here\\n[8]return false;\\n[4]}\\n}",
        test_case: [
          { input: ["listen", "silent"], expected: true },
          { input: ["hello", "world"], expected: false },
          { input: ["triangle", "integral"], expected: true },
          { input: ["abc", "cab"], expected: true },
          { input: ["abc", "cbaa"], expected: false },
        ],
      },
    ],
  },
  {
    title: "Anagram Checker in Python",
    description: "Check if two strings are anagrams of each other.",
    language: "python",
    level: "advanced",
    type: "practice",
    code_task: [
      {
        prompt:
          'Implement a function `def is_anagram(s1, s2):` that checks if two strings are anagrams.\nTwo strings are anagrams if they contain the same characters in a different order.\n\nExamples:\nInput: s1 = "listen", s2 = "silent", Output: True\nInput: s1 = "hello", s2 = "world", Output: False\nInput: s1 = "triangle", s2 = "integral", Output: True',
        starter_code:
          "def is_anagram(s1, s2):\\n[4]# your code here\\n[4]return False",
        test_case: [
          { input: ["listen", "silent"], expected: true },
          { input: ["hello", "world"], expected: false },
          { input: ["triangle", "integral"], expected: true },
          { input: ["abc", "cab"], expected: true },
          { input: ["abc", "cbaa"], expected: false },
        ],
      },
    ],
  },
  {
    title: "Anagram Checker in JavaScript",
    description: "Determine if two strings are anagrams.",
    language: "javascript",
    level: "advanced",
    type: "practice",
    code_task: [
      {
        prompt:
          'Implement a function `function isAnagram(s1, s2)` that checks if two strings are anagrams.\nTwo strings are anagrams if they contain the same characters in a different order.\n\nExamples:\nInput: s1 = "listen", s2 = "silent", Output: true\nInput: s1 = "hello", s2 = "world", Output: false\nInput: s1 = "triangle", s2 = "integral", Output: true',
        starter_code:
          "function isAnagram(s1, s2) {\\n[4]// your code here\\n[4]return false;\\n}",
        test_case: [
          { input: ["listen", "silent"], expected: true },
          { input: ["hello", "world"], expected: false },
          { input: ["triangle", "integral"], expected: true },
          { input: ["abc", "cab"], expected: true },
          { input: ["abc", "cbaa"], expected: false },
        ],
      },
    ],
  },

  // 5. Sum of Two Numbers
  {
    title: "Sum of Two Numbers in Java",
    description: "Return the sum of two integers.",
    language: "java",
    level: "beginner",
    type: "practice",
    code_task: [
      {
        prompt:
          "Implement a method `public int sum(int a, int b)` that returns the sum of two integers.\n\nExamples:\nInput: a = 3, b = 5, Output: 8\nInput: a = -2, b = 10, Output: 8\nInput: a = 0, b = 0, Output: 0",
        starter_code:
          "public class SumTask {\\n[4]public int sum(int a, int b) {\\n[8]// your code here\\n[8]return 0;\\n[4]}\\n}",
        test_case: [
          { input: [3, 5], expected: 8 },
          { input: [-2, 10], expected: 8 },
          { input: [0, 0], expected: 0 },
          { input: [-4, -6], expected: -10 },
          { input: [100, 200], expected: 300 },
        ],
      },
    ],
  },
  {
    title: "Sum of Two Numbers in Python",
    description: "Return the sum of two numbers.",
    language: "python",
    level: "beginner",
    type: "practice",
    code_task: [
      {
        prompt:
          "Implement a function `def sum(a, b):` that returns the sum of two numbers.\n\nExamples:\nInput: a = 3, b = 5, Output: 8\nInput: a = -2, b = 10, Output: 8\nInput: a = 0, b = 0, Output: 0",
        starter_code: "def sum(a, b):\\n[4]# your code here\\n[4]return 0",
        test_case: [
          { input: [3, 5], expected: 8 },
          { input: [-2, 10], expected: 8 },
          { input: [0, 0], expected: 0 },
          { input: [-4, -6], expected: -10 },
          { input: [100, 200], expected: 300 },
        ],
      },
    ],
  },
  {
    title: "Sum of Two Numbers in JavaScript",
    description: "Return the sum of two numbers.",
    language: "javascript",
    level: "beginner",
    type: "practice",
    code_task: [
      {
        prompt:
          "Implement a function `function sum(a, b)` that returns the sum of two numbers.\n\nExamples:\nInput: a = 3, b = 5, Output: 8\nInput: a = -2, b = 10, Output: 8\nInput: a = 0, b = 0, Output: 0",
        starter_code:
          "function sum(a, b) {\\n[4]// your code here\\n[4]return 0;\\n}",
        test_case: [
          { input: [3, 5], expected: 8 },
          { input: [-2, 10], expected: 8 },
          { input: [0, 0], expected: 0 },
          { input: [-4, -6], expected: -10 },
          { input: [100, 200], expected: 300 },
        ],
      },
    ],
  },

  // 6. Bubble Sort
  {
    title: "Bubble Sort in Java",
    description: "Implement bubble sort on an integer array.",
    language: "java",
    level: "intermediate",
    type: "practice",
    code_task: [
      {
        prompt:
          "Implement a method `public void bubbleSort(int[] arr)` that sorts an integer array using the bubble sort algorithm.\nBubble sort repeatedly steps through the list, compares adjacent elements and swaps them if they are in the wrong order.\n\nExamples:\nInput: [5, 1, 4, 2, 8], Output: [1, 2, 4, 5, 8]\nInput: [3, 2, 1], Output: [1, 2, 3]",
        starter_code:
          "public class BubbleSort {\\n[4]public int[] bubbleSort(int[] arr) {\\n[8]// your code here\\n[4]}\\n}",
        test_case: [
          { input: [[5, 1, 4, 2, 8]], expected: [1, 2, 4, 5, 8] },
          { input: [[3, 2, 1]], expected: [1, 2, 3] },
          { input: [[1, 2, 3, 4]], expected: [1, 2, 3, 4] },
          { input: [[9, 7, 5, 3]], expected: [3, 5, 7, 9] },
          { input: [[4]], expected: [4] },
        ],
      },
    ],
  },
  {
    title: "Bubble Sort in Python",
    description: "Sort a list using the bubble sort algorithm.",
    language: "python",
    level: "intermediate",
    type: "practice",
    code_task: [
      {
        prompt:
          "Implement a function `def bubble_sort(arr):` that sorts a list using bubble sort.\nBubble sort compares adjacent elements and swaps them if they are in the wrong order.\n\nExamples:\nInput: [5, 1, 4, 2, 8], Output: [1, 2, 4, 5, 8]\nInput: [3, 2, 1], Output: [1, 2, 3]",
        starter_code: "def bubble_sort(arr):\\n[4]# your code here\\n[4]pass",
        test_case: [
          { input: [[5, 1, 4, 2, 8]], expected: [1, 2, 4, 5, 8] },
          { input: [[3, 2, 1]], expected: [1, 2, 3] },
          { input: [[1, 2, 3, 4]], expected: [1, 2, 3, 4] },
          { input: [[9, 7, 5, 3]], expected: [3, 5, 7, 9] },
          { input: [[4]], expected: [4] },
        ],
      },
    ],
  },
  {
    title: "Bubble Sort in JavaScript",
    description: "Implement bubble sort on an array.",
    language: "javascript",
    level: "intermediate",
    type: "practice",
    code_task: [
      {
        prompt:
          "Implement a function `function bubbleSort(arr)` that sorts an array using bubble sort.\nBubble sort compares and swaps adjacent elements until the list is sorted.\n\nExamples:\nInput: [5, 1, 4, 2, 8], Output: [1, 2, 4, 5, 8]\nInput: [3, 2, 1], Output: [1, 2, 3]",
        starter_code: "function bubbleSort(arr) {\\n[4]// your code here\\n}",
        test_case: [
          { input: [[5, 1, 4, 2, 8]], expected: [1, 2, 4, 5, 8] },
          { input: [[3, 2, 1]], expected: [1, 2, 3] },
          { input: [[1, 2, 3, 4]], expected: [1, 2, 3, 4] },
          { input: [[9, 7, 5, 3]], expected: [3, 5, 7, 9] },
          { input: [[4]], expected: [4] },
        ],
      },
    ],
  },

  // 7. Selection Sort
  {
    title: "Selection Sort in Java",
    description: "Sort an array using selection sort.",
    language: "java",
    level: "intermediate",
    type: "practice",
    code_task: [
      {
        prompt:
          "Implement a method `public void selectionSort(int[] arr)` that sorts an array using the selection sort algorithm.\nSelection sort repeatedly finds the minimum element from the unsorted part and puts it at the beginning.\n\nExamples:\nInput: [64, 25, 12, 22, 11], Output: [11, 12, 22, 25, 64]",
        starter_code:
          "public class SelectionSort {\\n[4]public int[] selectionSort(int[] arr) {\\n[8]// your code here\\n[4]}\\n}",
        test_case: [
          { input: [[64, 25, 12, 22, 11]], expected: [11, 12, 22, 25, 64] },
          { input: [[5, 3, 1, 2, 4]], expected: [1, 2, 3, 4, 5] },
          { input: [[1, 2, 3]], expected: [1, 2, 3] },
          { input: [[9, 7, 5]], expected: [5, 7, 9] },
          { input: [[4]], expected: [4] },
        ],
      },
    ],
  },
  {
    title: "Selection Sort in Python",
    description: "Sort a list using selection sort.",
    language: "python",
    level: "intermediate",
    type: "practice",
    code_task: [
      {
        prompt:
          "Implement a function `def selection_sort(arr):` that sorts a list using the selection sort algorithm.\nSelection sort finds the minimum element in the unsorted part and places it at the beginning.\n\nExamples:\nInput: [64, 25, 12, 22, 11], Output: [11, 12, 22, 25, 64]",
        starter_code:
          "def selection_sort(arr):\\n[4]# your code here\\n[4]pass",
        test_case: [
          { input: [[64, 25, 12, 22, 11]], expected: [11, 12, 22, 25, 64] },
          { input: [[5, 3, 1, 2, 4]], expected: [1, 2, 3, 4, 5] },
          { input: [[1, 2, 3]], expected: [1, 2, 3] },
          { input: [[9, 7, 5]], expected: [5, 7, 9] },
          { input: [[4]], expected: [4] },
        ],
      },
    ],
  },
  {
    title: "Selection Sort in JavaScript",
    description: "Sort an array using the selection sort algorithm.",
    language: "javascript",
    level: "intermediate",
    type: "practice",
    code_task: [
      {
        prompt:
          "Implement a function `function selectionSort(arr)` that sorts an array using the selection sort algorithm.\nSelection sort finds the smallest element and moves it to the beginning in each pass.\n\nExamples:\nInput: [64, 25, 12, 22, 11], Output: [11, 12, 22, 25, 64]",
        starter_code:
          "function selectionSort(arr) {\\n[4]// your code here\\n}",
        test_case: [
          { input: [[64, 25, 12, 22, 11]], expected: [11, 12, 22, 25, 64] },
          { input: [[5, 3, 1, 2, 4]], expected: [1, 2, 3, 4, 5] },
          { input: [[1, 2, 3]], expected: [1, 2, 3] },
          { input: [[9, 7, 5]], expected: [5, 7, 9] },
          { input: [[4]], expected: [4] },
        ],
      },
    ],
  },

  // 8. Insertion Sort
  {
    title: "Insertion Sort in Java",
    description: "Sort an array using insertion sort.",
    language: "java",
    level: "intermediate",
    type: "practice",
    code_task: [
      {
        prompt:
          "Implement a method `public void insertionSort(int[] arr)` that sorts an array using the insertion sort algorithm.\nInsertion sort builds the sorted array one element at a time by inserting each element into its correct position.\n\nExamples:\nInput: [12, 11, 13, 5, 6], Output: [5, 6, 11, 12, 13]",
        starter_code:
          "public class InsertionSort {\\n[4]public int[] insertionSort(int[] arr) {\\n[8]// your code here\\n[4]}\\n}",
        test_case: [
          { input: [[12, 11, 13, 5, 6]], expected: [5, 6, 11, 12, 13] },
          { input: [[3, 2, 1]], expected: [1, 2, 3] },
          { input: [[1, 2, 3, 4]], expected: [1, 2, 3, 4] },
          { input: [[9, 5, 7]], expected: [5, 7, 9] },
          { input: [[4]], expected: [4] },
        ],
      },
    ],
  },
  {
    title: "Insertion Sort in Python",
    description: "Sort a list using insertion sort.",
    language: "python",
    level: "intermediate",
    type: "practice",
    code_task: [
      {
        prompt:
          "Implement a function `def insertion_sort(arr):` that sorts a list using insertion sort.\nInsertion sort builds the final sorted list one item at a time.\n\nExamples:\nInput: [12, 11, 13, 5, 6], Output: [5, 6, 11, 12, 13]",
        starter_code:
          "def insertion_sort(arr):\\n[4]# your code here\\n[4]pass",
        test_case: [
          { input: [[12, 11, 13, 5, 6]], expected: [5, 6, 11, 12, 13] },
          { input: [[3, 2, 1]], expected: [1, 2, 3] },
          { input: [[1, 2, 3, 4]], expected: [1, 2, 3, 4] },
          { input: [[9, 5, 7]], expected: [5, 7, 9] },
          { input: [[4]], expected: [4] },
        ],
      },
    ],
  },
  {
    title: "Insertion Sort in JavaScript",
    description: "Sort an array using insertion sort.",
    language: "javascript",
    level: "intermediate",
    type: "practice",
    code_task: [
      {
        prompt:
          "Implement a function `function insertionSort(arr)` that sorts an array using insertion sort.\nInsertion sort builds the sorted list one element at a time.\n\nExamples:\nInput: [12, 11, 13, 5, 6], Output: [5, 6, 11, 12, 13]",
        starter_code:
          "function insertionSort(arr) {\\n[4]// your code here\\n}",
        test_case: [
          { input: [[12, 11, 13, 5, 6]], expected: [5, 6, 11, 12, 13] },
          { input: [[3, 2, 1]], expected: [1, 2, 3] },
          { input: [[1, 2, 3, 4]], expected: [1, 2, 3, 4] },
          { input: [[9, 5, 7]], expected: [5, 7, 9] },
          { input: [[4]], expected: [4] },
        ],
      },
    ],
  },

  // 9. Merge Sort
  {
    title: "Merge Sort in Java",
    description: "Sort an array using merge sort algorithm.",
    language: "java",
    level: "advanced",
    type: "practice",
    code_task: [
      {
        prompt:
          "Implement a method `public void mergeSort(int[] arr)` that sorts an array using the merge sort algorithm.\nMerge sort is a divide-and-conquer algorithm that splits the array, recursively sorts each half, and merges them.\n\nExample:\nInput: [38, 27, 43, 3, 9, 82, 10], Output: [3, 9, 10, 27, 38, 43, 82]",
        starter_code:
          "public class MergeSort {\\n[4]public int[] mergeSort(int[] arr) {\\n[8]// your code here\\n[4]}\\n}",
        test_case: [
          {
            input: [[38, 27, 43, 3, 9, 82, 10]],
            expected: [3, 9, 10, 27, 38, 43, 82],
          },
          { input: [[5, 2, 4, 6, 1, 3]], expected: [1, 2, 3, 4, 5, 6] },
          { input: [[1, 2, 3]], expected: [1, 2, 3] },
          { input: [[3, 2, 1]], expected: [1, 2, 3] },
          { input: [[10]], expected: [10] },
        ],
      },
    ],
  },
  {
    title: "Merge Sort in Python",
    description: "Sort a list using merge sort algorithm.",
    language: "python",
    level: "advanced",
    type: "practice",
    code_task: [
      {
        prompt:
          "Implement a function `def merge_sort(arr):` that sorts a list using the merge sort algorithm.\nMerge sort divides the list, sorts recursively, and merges the sorted halves.\n\nExample:\nInput: [38, 27, 43, 3, 9, 82, 10], Output: [3, 9, 10, 27, 38, 43, 82]",
        starter_code:
          "def merge_sort(arr):\\n[4]# your code here\\n[4]return arr",
        test_case: [
          {
            input: [[38, 27, 43, 3, 9, 82, 10]],
            expected: [3, 9, 10, 27, 38, 43, 82],
          },
          { input: [[5, 2, 4, 6, 1, 3]], expected: [1, 2, 3, 4, 5, 6] },
          { input: [[1, 2, 3]], expected: [1, 2, 3] },
          { input: [[3, 2, 1]], expected: [1, 2, 3] },
          { input: [[10]], expected: [10] },
        ],
      },
    ],
  },
  {
    title: "Merge Sort in JavaScript",
    description: "Sort an array using merge sort algorithm.",
    language: "javascript",
    level: "advanced",
    type: "practice",
    code_task: [
      {
        prompt:
          "Implement a function `function mergeSort(arr)` that returns the sorted array using the merge sort algorithm.\nMerge sort recursively splits and merges arrays.\n\nExample:\nInput: [38, 27, 43, 3, 9, 82, 10], Output: [3, 9, 10, 27, 38, 43, 82]",
        starter_code:
          "function mergeSort(arr) {\\n[4]// your code here\\n[4]return arr;\\n}",
        test_case: [
          {
            input: [[38, 27, 43, 3, 9, 82, 10]],
            expected: [3, 9, 10, 27, 38, 43, 82],
          },
          { input: [[5, 2, 4, 6, 1, 3]], expected: [1, 2, 3, 4, 5, 6] },
          { input: [[1, 2, 3]], expected: [1, 2, 3] },
          { input: [[3, 2, 1]], expected: [1, 2, 3] },
          { input: [[10]], expected: [10] },
        ],
      },
    ],
  },

  // 10. Linear Search
  {
    title: "Linear Search in Java",
    description: "Search for an element in array using linear search.",
    language: "java",
    level: "beginner",
    type: "practice",
    code_task: [
      {
        prompt:
          "Implement a method `public boolean linearSearch(int[] arr, int target)` that performs a linear search on the array.\nReturn true if the target is found, otherwise false.\n\nExamples:\nInput: arr = [1, 2, 3, 4], target = 3, Output: true\nInput: arr = [5, 6, 7], target = 9, Output: false",
        starter_code:
          "public class LinearSearch {\\n[4]public boolean linearSearch(int[] arr, int target) {\\n[8]// your code here\\n[8]return false;\\n[4]}\\n}",
        test_case: [
          { input: [[1, 2, 3, 4], 3], expected: true },
          { input: [[5, 6, 7], 9], expected: false },
          { input: [[10], 10], expected: true },
          { input: [[], 1], expected: false },
          { input: [[1, 1, 1], 1], expected: true },
        ],
      },
    ],
  },
  {
    title: "Linear Search in Python",
    description: "Search for a value in a list using linear search.",
    language: "python",
    level: "beginner",
    type: "practice",
    code_task: [
      {
        prompt:
          "Implement a function `def linear_search(arr, target):` that returns True if target is found using linear search, otherwise False.\n\nExamples:\nInput: arr = [1, 2, 3, 4], target = 3, Output: True\nInput: arr = [5, 6, 7], target = 9, Output: False",
        starter_code:
          "def linear_search(arr, target):\\n[4]# your code here\\n[4]return False",
        test_case: [
          { input: [[1, 2, 3, 4], 3], expected: true },
          { input: [[5, 6, 7], 9], expected: false },
          { input: [[10], 10], expected: true },
          { input: [[], 1], expected: false },
          { input: [[1, 1, 1], 1], expected: true },
        ],
      },
    ],
  },
  {
    title: "Linear Search in JavaScript",
    description: "Find an element in an array using linear search.",
    language: "javascript",
    level: "beginner",
    type: "practice",
    code_task: [
      {
        prompt:
          "Implement a function `function linearSearch(arr, target)` that searches the array for a given target.\nReturn true if the element exists, else false.\n\nExamples:\nInput: [1, 2, 3, 4], 3, Output: true\nInput: [5, 6, 7], 9, Output: false",
        starter_code:
          "function linearSearch(arr, target) {\\n[4]// your code here\\n[4]return false;\\n}",
        test_case: [
          { input: [[1, 2, 3, 4], 3], expected: true },
          { input: [[5, 6, 7], 9], expected: false },
          { input: [[10], 10], expected: true },
          { input: [[], 1], expected: false },
          { input: [[1, 1, 1], 1], expected: true },
        ],
      },
    ],
  },

  // 11. Binary Search
  {
    title: "Binary Search in Java",
    description: "Search a sorted array using binary search.",
    language: "java",
    level: "intermediate",
    type: "practice",
    code_task: [
      {
        prompt:
          "Implement a method `public boolean binarySearch(int[] arr, int target)` that uses binary search to determine if the target exists in a sorted array.\nReturn true if found, false otherwise.\n\nExamples:\nInput: arr = [1, 2, 3, 4, 5], target = 3, Output: true\nInput: arr = [1, 2, 3, 4, 5], target = 6, Output: false",
        starter_code:
          "public class BinarySearch {\\n[4]public boolean binarySearch(int[] arr, int target) {\\n[8]// your code here\\n[8]return false;\\n[4]}\\n}",
        test_case: [
          { input: [[1, 2, 3, 4, 5], 3], expected: true },
          { input: [[1, 2, 3, 4, 5], 6], expected: false },
          { input: [[1], 1], expected: true },
          { input: [[1], 2], expected: false },
          { input: [[], 1], expected: false },
        ],
      },
    ],
  },
  {
    title: "Binary Search in Python",
    description: "Perform binary search on sorted list.",
    language: "python",
    level: "intermediate",
    type: "practice",
    code_task: [
      {
        prompt:
          "Implement a function `def binary_search(arr, target):` that returns True if the target exists in the sorted list using binary search, otherwise False.\n\nExamples:\nInput: arr = [1, 2, 3, 4, 5], target = 3, Output: True\nInput: arr = [1, 2, 3, 4, 5], target = 6, Output: False",
        starter_code:
          "def binary_search(arr, target):\\n[4]# your code here\\n[4]return False",
        test_case: [
          { input: [[1, 2, 3, 4, 5], 3], expected: true },
          { input: [[1, 2, 3, 4, 5], 6], expected: false },
          { input: [[1], 1], expected: true },
          { input: [[1], 2], expected: false },
          { input: [[], 1], expected: false },
        ],
      },
    ],
  },
  {
    title: "Binary Search in JavaScript",
    description: "Search a sorted array using binary search algorithm.",
    language: "javascript",
    level: "intermediate",
    type: "practice",
    code_task: [
      {
        prompt:
          "Implement a function `function binarySearch(arr, target)` that returns true if target exists in the sorted array, otherwise false. Use the binary search algorithm.\n\nExamples:\nInput: [1, 2, 3, 4, 5], 3, Output: true\nInput: [1, 2, 3, 4, 5], 6, Output: false",
        starter_code:
          "function binarySearch(arr, target) {\\n[4]// your code here\\n[4]return false;\\n}",
        test_case: [
          { input: [[1, 2, 3, 4, 5], 3], expected: true },
          { input: [[1, 2, 3, 4, 5], 6], expected: false },
          { input: [[1], 1], expected: true },
          { input: [[1], 2], expected: false },
          { input: [[], 1], expected: false },
        ],
      },
    ],
  },
];
