// export const config = {
//   runtime: "nodejs",
// };
// import type { NextApiRequest, NextApiResponse } from "next";
// // import { PrismaClient } from "@/generated/prisma";

// // const prisma = new PrismaClient();
// import { prisma } from "@/lib/prisma";

// export default async function handler(
//   req: NextApiRequest,
//   res: NextApiResponse
// ) {
//   const { id } = req.query;

//   if (typeof id !== "string") {
//     return res.status(400).json({ error: "Invalid or missing id" });
//   }

//   try {
//     if (req.method === "DELETE") {
//       await prisma.testCase.delete({
//         where: { id },
//       });

//       return res.status(204).end();
//     }

//     res.setHeader("Allow", ["DELETE"]);
//     return res.status(405).end(`Method ${req.method} Not Allowed`);
//   } catch (error) {
//     console.error("Delete test case error:", error);
//     return res.status(500).json({ error: "Internal Server Error" });
//   }
// }
