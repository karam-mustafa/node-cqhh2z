import { Request, Response } from "express";
const joi = require("joi");

/**
 * validate the inputs of register a new user request
 *
 * @param {Request} req 
 * @param {Response} res 
 * @param {*} next 
 * @return 
 */
export const validateUserRegistration = (
  req: Request,
  res: Response,
  next: any
) => {
  const schema = joi.object({
    username: joi.string().required().min(3).max(24),
    email: joi.string().required().email(),
    type: joi.string().required().valid("user", "admin"),
    password: joi.string().required().min(5).max(24),
  });

  const { error } = schema.validate(req.body);

  if (error) {
    return res.status(400).json({ error: error.details[0].message });
  }

  next();
};

/**
 * validate the inputs of a login request
 *
 * @param {Request} req 
 * @param {Response} res 
 * @param {*} next 
 * @return 
 */
export  const validateUserLogin = (req: Request, res: Response, next: any) => {
  const schema = joi.object({
    email: joi.string().required().email(),
    password: joi.string().required().min(5).max(24),
  });

  const { error } = schema.validate(req.body);

  if (error) {
    return res.status(400).json({ error: error.details[0].message });
  }

  next();
};
