import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import User from "../database/models/user.model";
import { Role } from "../enum/auth.enum";

export interface AuthRequest extends Request {
  user?: any;
}

class Auth {
  async isAuthenticated(
    req: AuthRequest,
    res: Response,
    next: NextFunction,
  ): Promise<void> {
    const token = req.headers.authorization?.split(" ")[1];
    if (!token || token === undefined) {
      res.status(403).json({
        message: "token not found",
      });
      return;
    }

    jwt.verify(
      token,
      process.env.JWT_SECRET as string,
      async (err, decoded: any) => {
        if (err) {
          res.status(403).json({
            message: "token not valid",
          });
          console.log("JWT_SECRET:", process.env.JWT_SECRET);
          console.log("Token:", token);
          return;
        } else {
          try {
            const userData = await User.findByPk(decoded.id);
            if (!userData) {
              res.status(404).json({
                message: "user not found",
              });
              return;
            }
            req.user = userData;
            next();
          } catch (error) {
            res.status(500).json({
              message: "something went wrong",
            });
          }
        }
      },
    );
  }

  restrictTo(...roles: Role[]) {
    return (req: AuthRequest, res: Response, next: NextFunction) => {
      let userRole = req.user?.role as Role;
      if (!roles.includes(userRole)) {
        res.status(403).json({
          message: "You do not have permission to perform this action",
        });
      } else {
        next();
      }
    };
  }
}

const auth = new Auth();
export default auth;
