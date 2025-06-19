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
