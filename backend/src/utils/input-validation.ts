import express from "express";
import { type ContextRunner } from "express-validator";

const validateInputs = (validations: ContextRunner[]) => {
  return async (
    req: express.Request,
    res: express.Response,
    next: express.NextFunction,
  ) => {
    // sequential processing, stops running validations chain if one fails.
    for (const validation of validations) {
      console.log(req.body);
      const result = await validation.run(req);
      if (!result.isEmpty()) {
        return res.status(400).json({ errors: result.array() });
      }
    }

    next();
  };
};

export default validateInputs;
