import type { NextApiRequest, NextApiResponse } from "next";
import { PrismaClient } from "@/generated/prisma";

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
    if (req.method === "DELETE") {
      await prisma.theoryQuestion.delete({
        where: { id },
      });

      return res.status(204).end();
    }

    res.setHeader("Allow", ["DELETE"]);
    return res.status(405).end(`Method ${req.method} Not Allowed`);
  } catch (error) {
    console.error("Delete theory question error:", error);
    return res.status(500).json({ error: "Internal Server Error" });
  }
}
