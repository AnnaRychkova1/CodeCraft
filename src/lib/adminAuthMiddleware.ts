import type { NextApiRequest, NextApiResponse, NextApiHandler } from "next";
import jwt, { JwtPayload } from "jsonwebtoken";

export function adminAuthMiddleware(handler: NextApiHandler): NextApiHandler {
  return async (req: NextApiRequest, res: NextApiResponse) => {
    const adminToken = req.cookies.adminToken;

    if (!adminToken) {
      return res.status(401).json({ error: "Unauthorized: No token provided" });
    }

    try {
      const decoded = jwt.verify(
        adminToken,
        process.env.JWT_SECRET!
      ) as JwtPayload;

      if (decoded.role !== "admin") {
        return res
          .status(403)
          .json({ error: "Forbidden: Insufficient rights" });
      }
    } catch (error) {
      console.log(error);
      return res.status(401).json({ error: "Invalid or expired token" });
    }

    await handler(req, res);
  };
}
