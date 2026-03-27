import {Request, Response, NextFunction} from "express"
import ServiceError from "../errors/ServiceError.js"
import { ZodError } from "zod";
import logger from "../logger.js";
export default function errorsHandler(error: Error, _: Request, res: Response, __: NextFunction) {
    if (error instanceof ServiceError) {
        res.statusCode = error.code;
    }  else if ((error as any).status) {
        res.statusCode = (error as any).status;
    } else {
        res.statusCode = 500;
        error.message = `unknown error: ${error.message}`
    }
    res.end(error.message)
    logger.error(error.message)
}