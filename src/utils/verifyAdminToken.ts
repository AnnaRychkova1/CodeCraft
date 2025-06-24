import jwt, { JwtPayload } from "jsonwebtoken";
import { NextApiRequest, NextApiResponse } from "next";

export function verifyAdminToken(
  req: NextApiRequest,
  res: NextApiResponse
): { valid: boolean; error?: string } {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return { valid: false, error: "Unauthorized" };
  }

  const token = authHeader.split(" ")[1];

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET!);

    if (typeof decoded === "string") {
      return { valid: false, error: "Invalid token format" };
    }

    if ((decoded as JwtPayload).role !== "admin") {
      return { valid: false, error: "Forbidden" };
    }

    if (!res) {
      console.log("Something wrong");
    }

    return { valid: true };
  } catch (err) {
    console.log(err);
    return { valid: false, error: "Invalid or expired token" };
  }
}
