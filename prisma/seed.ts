// import { PrismaClient } from "../src/generated/prisma";

// const prisma = new PrismaClient();

// async function main() {
//   // Insert Palindrome Checker task with codeTask and tests
//   await prisma.task.create({
//     data: {
//       id: "6f1b1c8e-1234-4a7b-9a1f-abcdef123456", // uuid string, або пропусти і згенерує автоматично
//       title: "Palindrome Checker",
//       description: "Write a method to check if a string is a palindrome.",
//       level: "advanced",
//       language: "java",
//       type: "practice",
//       codeTask: {
//         create: {
//           prompt:
//             'Implement a method `isPalindrome(String s)` that returns true if the string is a palindrome.\nExample Input: `"racecar"`\nExpected Output: `true`',
//           starterCode: `public class Solution {
//     public static boolean isPalindrome(String s) {
//         // your code here
//         return false;
//     }

//     // Example usage (for testing):
//     public static void main(String[] args) {
//         System.out.println(isPalindrome("racecar")); // Expected: true
//     }
// }`,
//           tests: {
//             createMany: {
//               data: [
//                 {
//                   input: JSON.stringify(["racecar"]),
//                   expected: JSON.stringify(true),
//                 },
//                 {
//                   input: JSON.stringify(["hello"]),
//                   expected: JSON.stringify(false),
//                 },
//                 {
//                   input: JSON.stringify(["level"]),
//                   expected: JSON.stringify(true),
//                 },
//                 {
//                   input: JSON.stringify(["WasItACarOrACatISaw"]),
//                   expected: JSON.stringify(false),
//                 },
//               ],
//             },
//           },
//         },
//       },
//     },
//   });

//   // Insert Java Fundamentals theory task
//   await prisma.task.create({
//     data: {
//       id: "7f2b2d9f-2345-4c8d-9b2f-fedcba654321",
//       title: "Java Fundamentals",
//       description: "Basic theory questions about Java.",
//       level: "beginner",
//       language: "java",
//       type: "theory",
//       theoryQuestions: {
//         create: [
//           {
//             question: "Which keyword is used to define a class in Java?",
//             options: ["class", "Class", "define", "struct"],
//             correctAnswer: ["class"],
//           },
//           {
//             question: "Which symbol is used to end a statement in Java?",
//             options: [";", ":", ".", ","],
//             correctAnswer: [";"],
//           },
//         ],
//       },
//     },
//   });

//   console.log("Seed data added");
// }

// main()
//   .catch((e) => {
//     console.error(e);
//   })
//   .finally(async () => {
//     await prisma.$disconnect();
//   });

import { PrismaClient } from "../src/generated/prisma";

const prisma = new PrismaClient();

async function main() {
  // Clean existing data
  await prisma.task.deleteMany();

  // Create a theory task
  await prisma.task.create({
    data: {
      id: "6f1b1c8e-1234-4a7b-9a1f-abcdef123456",
      title: "Basics of Python Variables",
      description: "Learn how to declare and use variables in Python.",
      level: "beginner",
      language: "python",
      type: "theory",
      theoryQuestions: {
        create: [
          {
            question:
              "Which of the following is a valid variable name in Python?",
            options: [
              "1variable",
              "_variable",
              "variable-name",
              "variable name",
            ],
            correctAnswer: ["_variable"],
          },
          {
            question: "What will `x = 5 + 3` result in?",
            options: ["8", "53", "Error", "None"],
            correctAnswer: ["8"],
          },
        ],
      },
    },
  });

  // Create a practice task with codeTask and tests
  await prisma.task.create({
    data: {
      id: "7f2b2d9f-2345-4c8d-9b2f-fedcba654321",
      title: "Sum of Two Numbers",
      description:
        "Write a function that takes two numbers and returns their sum.",
      level: "beginner",
      language: "javascript",
      type: "practice",
      codeTask: {
        create: {
          prompt:
            "Implement a function `sum(a, b)` that returns the sum of two numbers.",
          starterCode: `function sum(a, b) {\n  // your code here\n}`,
          tests: {
            create: [
              { input: [1, 2], expected: 3 },
              { input: [-3, 5], expected: 2 },
              { input: [100, 250], expected: 350 },
            ],
          },
        },
      },
    },
  });

  console.log("Seed completed!");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
