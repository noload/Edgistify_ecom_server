import { NextFunction, Request, Response } from "express";
import Joi from "joi";
import passwordComplexity from "joi-password-complexity";

const complexityOptions = {
    min: 6,
    max: 30,
    lowerCase: 1,
    upperCase: 1,
    numeric: 1,
    symbol: 1,
    requirementCount: 2,
  };

export const validateRegisterUser = (
  req: Request,
  res: Response,
  next: NextFunction
):Promise<any> | void => {
  try {
    const userRegisterSchema = Joi.object({
      fullName: Joi.string().min(3).required().messages({
        "string.base": "FullName must be string",
        "any.required": "FullName is required",
        "string.min": "FullName must be atleast 3 character long",
      }),
      email: Joi.string().email().required().messages({}),

      password: passwordComplexity().messages({
        "any.required": "Password is required",
        "string.base": "Password must be a string",
        "string.min": "Password must be at least 6 characters long",
      }),
    });

    const { error } = userRegisterSchema.validate(req.body);

    if (error) {
        console.log(error);
        res.status(400).json({ message: error.details[0].message });
    }else{
        next();
    }
   
  } catch (error) {
    console.log(`Error in middleware`, error);
      res.status(500).json({message:"Failed user registration validation"});
  }
};


export const validateLoginUser = (
    req: Request,
    res: Response,
    next: NextFunction
  ):Promise<any> | void => {
    try {
      const userLoginSchema = Joi.object({
    
        email: Joi.string().email().required().messages({}),
  
        password: passwordComplexity().messages({
          "any.required": "Password is required",
          "string.base": "Password must be a string",
          "string.min": "Password must be at least 6 characters long",
        }),
      });
  
      const { error } = userLoginSchema.validate(req.body);
  
      if (error) {
          console.log(error);
          res.status(400).json({ message: error.details[0].message });
      }else{
          next();
      }
     
    } catch (error) {
      console.log(`Error in middleware`, error);
        res.status(500).json({message:"Failed user login validation"});
    }
  };

