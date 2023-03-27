import { UserEntry } from "../entities/user";
import { Request, Response } from "express";
import { HTTP_STATUS } from "../constants/statuses";

/**
 * auth controller
 *
 * @export
 * @class AuthController
 */
export class AuthController {
  memory: Record<string, UserEntry> = {};
  bcrypt: any;

  constructor(memory: Record<string, UserEntry>) {
    this.memory = memory;
    this.bcrypt = require("bcryptjs");
  }

  /**
   * get user by his name from memory object that defined in root file 
   *
   * @param {string} username 
   * @return {(UserEntry | undefined)} 
   * @memberof AuthController
   */
  getUserByUsername(username: string): UserEntry | undefined {
    return Object.values(this.memory).find(
      (user) => user.username === username
    );
  }

  /**
   *  get user by his email from memory object that defined in root file
   *
   * @param {string} email 
   * @return {(UserEntry | undefined)} 
   * @memberof AuthController
   */
  getUserByEmail(email: string): UserEntry | undefined {
    return Object.values(this.memory).find((user) => user.email === email);
  }

  /**
   * register a new user
   *
   * @param {Request} req 
   * @param {Response} res 
   * @return 
   * @memberof AuthController
   */
  register(req: Request, res: Response) {
    const { username, email, type, password } = req.body;

    // Check if user already exists
    if (this.getUserByUsername(username) || this.getUserByEmail(email)) {
      return res
        .status(HTTP_STATUS.RESOURCES_EXISTS)
        .json({ error: "User already exists" });
    }

    // Generate salt and hash password
    const salt = this.bcrypt.genSaltSync(10);
    const passwordhash = this.bcrypt.hashSync(password, salt);

    // Save user to memory database
    this.memory[username] = { username, email, type, salt, passwordhash };

    return res
      .status(HTTP_STATUS.CREATED)
      .json({ message: "User registered successfully" });
  }

  /**
   * login for users
   * 
   * @param {Request} req 
   * @param {Response} res 
   * @return 
   * @memberof AuthController
   */
  login(req: Request, res: Response) {
    const { email, password } = req.body;

    // Get user from memory database
    const user = this.getUserByEmail(email);

    // If user doesn't exist, return 401 Unauthorized
    if (!user) {
      return res
        .status(HTTP_STATUS.INVALID_CREDENTIALS)
        .json({ error: "Invalid credentials" });
    }

    // Compare password with stored hash
    const isPasswordValid = this.bcrypt.compareSync(
      password,
      user.passwordhash
    );

    if (!isPasswordValid) {
      return res
        .status(HTTP_STATUS.INVALID_CREDENTIALS)
        .json({ error: "Invalid credentials" });
    }

    return res.status(HTTP_STATUS.OK).json({ message: "Login successful" });
  }
}
