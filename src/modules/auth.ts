import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";

/**
 * BCRYPT
 */

// for login
export const comparePassword = async (
  password: string,
  hashedPassword: string
) => {
  return bcrypt.compare(password, hashedPassword);
};

// for sign-up
export const hashPassword = async (password: string) => {
  const saltRounds = 5;
  return bcrypt.hash(password, saltRounds);
};

/**
 * JWT
 */

// for headers
export const createJWT = (user: any) => {
  const token = jwt.sign(
    {
      id: user.id,
      username: user.username,
    },
    process.env.JWT_SECRET!
  );
  return token;
};

// to protect routes from unauthorized users
export const protectRoute = (req, res, next) => {
  const bearer = req.headers.authorization;

  if (!bearer) {
    res.status(401);
    res.json({ message: "Not authorized!" });
    return;
  }

  const [, token] = bearer.split(" ");

  if (!token) {
    res.status(401);
    res.json({ message: "Not authorized with valid token!" });
    return;
  }

  try {
    const user = jwt.verify(token, process.env.JWT_SECRET!);
    console.log(user);
    req.user = user;
    res.status(200);
    // res.json({ message: "Authorized!" });
    next();
  } catch (e) {
    console.log(e);
    res.status(401);
    res.json({ message: "Not authorized with valid token!" });
  }
};
