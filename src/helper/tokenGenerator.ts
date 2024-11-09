import jwt from "jsonwebtoken";
import config from "../config/config";

export function tokenGenerator(payload: { id: string }, expiry?: string) {
  return {
    accessToken: jwt.sign(payload, config.JWT_SECRET ?? "", {
      expiresIn: expiry || config.JWT_EXPIRE,
    }),
    refreshToken: jwt.sign(payload, config.JWT_REFRESH_SECRET ?? "", {
      expiresIn: expiry || config.JWT_REFRESH_EXPIRE,
    }),
  };
}
