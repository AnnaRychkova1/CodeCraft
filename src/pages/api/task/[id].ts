import type { NextApiRequest, NextApiResponse } from "next";
import { PrismaClient } from "@/generated/prisma";
import { CodeTaskTest, Question } from "@/types/types";

const prisma = new PrismaClient();

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const { id } = req.query;

  if (typeof id !== "string") {
    return res.status(400).json({ error: "Invalid or missing id" });
  }

  try {
    if (req.method === "GET") {
      const task = await prisma.task.findUnique({
        where: { id },
        include: {
          theoryQuestions: true,
          codeTask: {
            include: {
              tests: true,
            },
          },
        },
      });

      if (!task) {
        return res.status(404).json({ error: "Task not found" });
      }

      return res.status(200).json(task);
    }

    if (req.method === "PUT") {
      const {
        title,
        description,
        level,
        language,
        type,
        theoryQuestions,
        codeTask,
      } = req.body;

      await prisma.task.update({
        where: { id },
        data: {
          title,
          description,
          level,
          language,
          type,
        },
      });

      if (type === "theory") {
        await prisma.theoryQuestion.deleteMany({ where: { taskId: id } });

        if (Array.isArray(theoryQuestions) && theoryQuestions.length > 0) {
          await prisma.theoryQuestion.createMany({
            data: theoryQuestions.map((q: Question) => ({
              taskId: id,
              question: q.question,
              options: q.options,
              correctAnswer: q.correctAnswer,
            })),
            skipDuplicates: true,
          });
        }

        await prisma.codeTask.deleteMany({ where: { id: id } });
      }

      if (type === "practice") {
        const existingCodeTask = await prisma.codeTask.findUnique({
          where: { id: id },
        });

        if (existingCodeTask) {
          await prisma.codeTask.update({
            where: { id: existingCodeTask.id },
            data: {
              prompt: codeTask.prompt,
              starterCode: codeTask.starterCode ?? null,
            },
          });

          await prisma.testCase.deleteMany({
            where: { codeTaskId: existingCodeTask.id },
          });

          if (Array.isArray(codeTask.tests) && codeTask.tests.length > 0) {
            await prisma.testCase.createMany({
              data: codeTask.tests.map((test: CodeTaskTest) => {
                if (!Array.isArray(test.input)) {
                  throw new Error("Each test.input must be an array");
                }

                return {
                  codeTaskId: existingCodeTask.id,
                  input: test.input,
                  expected: test.expected,
                };
              }),
            });
          }
        } else {
          await prisma.codeTask.create({
            data: {
              task: { connect: { id } },
              prompt: codeTask.prompt,
              starterCode: codeTask.starterCode ?? null,
              tests: {
                create: (codeTask.tests || []).map((test: CodeTaskTest) => {
                  if (!Array.isArray(test.input)) {
                    throw new Error("Each test.input must be an array");
                  }
                  return {
                    input: test.input,
                    expected: test.expected,
                  };
                }),
              },
            },
          });
        }

        await prisma.theoryQuestion.deleteMany({ where: { taskId: id } });
      }

      return res.status(200).json({ message: "Task updated successfully" });
    }

    if (req.method === "DELETE") {
      await prisma.task.delete({
        where: { id },
      });

      return res.status(204).end();
    }

    res.setHeader("Allow", ["GET", "PUT", "DELETE"]);
    return res.status(405).end(`Method ${req.method} Not Allowed`);
  } catch (error) {
    console.error("API Error:", error);
    return res.status(500).json({ error: "Internal Server Error" });
  }
}
