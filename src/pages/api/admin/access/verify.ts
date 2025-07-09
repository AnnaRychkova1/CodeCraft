import type { NextApiRequest, NextApiResponse } from "next";
import jwt from "jsonwebtoken";
import { parse } from "cookie";

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "POST") {
    return res.status(405).end("Method Not Allowed");
  }

  const cookies = req.headers.cookie ? parse(req.headers.cookie) : {};
  const adminToken = cookies.adminToken;

  if (!adminToken) {
    return res.status(401).json({ valid: false, message: "Missing token" });
  }

  try {
    const decoded = jwt.verify(adminToken, process.env.JWT_SECRET!);

    if (typeof decoded === "object" && decoded.role === "admin") {
      return res.status(200).json({ valid: true });
    }

    return res.status(403).json({ valid: false, message: "Invalid role" });
  } catch (error) {
    if (error instanceof jwt.TokenExpiredError) {
      console.log("Token expired at:", error.expiredAt);
      return res
        .status(401)
        .json({ valid: false, reason: "expired", message: "Token expired" });
    }

    console.log("Invalid token error:", error);
    return res
      .status(401)
      .json({ valid: false, reason: "invalid", message: "Invalid token" });
  }
}
