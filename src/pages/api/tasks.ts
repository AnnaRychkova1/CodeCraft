export const config = {
  runtime: "nodejs",
};

import type { NextApiRequest, NextApiResponse } from "next";
// import type { Prisma } from "@prisma/client";
import type { Prisma } from "@/generated/prisma";
// import { Prisma, PrismaClient } from "@/generated/prisma";
import { CodeTaskTest } from "@/types/types";

import { prisma } from "@/lib/prisma";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  try {
    if (req.method === "GET") {
      const tasks = await prisma.task.findMany({
        include: {
          codeTask: {
            include: {
              tests: true,
            },
          },
          theoryQuestions: true,
        },
      });

      return res.status(200).json(tasks);
    }

    if (req.method === "POST") {
      const {
        title,
        description,
        level,
        language,
        type,
        theoryQuestions,
        codeTask,
      } = req.body;

      if (!title || !description || !level || !language || !type) {
        return res.status(400).json({ error: "Missing required fields" });
      }

      const data: Prisma.TaskCreateInput = {
        title,
        description,
        level,
        language,
        type,
        theoryQuestions: undefined,
        codeTask: undefined,
      };

      if (type === "theory") {
        if (Array.isArray(theoryQuestions) && theoryQuestions.length > 0) {
          data.theoryQuestions = {
            create: theoryQuestions,
          };
        }
      } else if (type === "practice") {
        if (!codeTask || !codeTask.prompt) {
          return res.status(400).json({ error: "Missing codeTask data" });
        }

        data.codeTask = {
          create: {
            prompt: codeTask.prompt,
            starterCode: codeTask.starterCode ?? null,
            tests:
              Array.isArray(codeTask.tests) && codeTask.tests.length > 0
                ? {
                    create: codeTask.tests.map((test: CodeTaskTest) => {
                      if (!Array.isArray(test.input)) {
                        throw new Error("Each test.input must be an array");
                      }

                      return {
                        input: test.input,
                        expected: test.expected,
                      };
                    }),
                  }
                : undefined,
          },
        };
      }

      const newTask = await prisma.task.create({
        data,
        include: {
          codeTask: {
            include: { tests: true },
          },
          theoryQuestions: true,
        },
      });

      return res.status(201).json(newTask);
    }

    res.setHeader("Allow", ["GET", "POST"]);
    return res.status(405).end(`Method ${req.method} Not Allowed`);
  } catch (error) {
    console.error("API error:", error);
    return res.status(500).json({ error: "Internal Server Error" });
  }
}
