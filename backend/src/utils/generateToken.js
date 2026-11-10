import jwt from "jsonwebtoken";

import { env } from "../config/env.js";

const generateToken = (id) =>
  jwt.sign({ id }, env.jwtSecret, { expiresIn: env.jwtExpire });

export default generateToken;
