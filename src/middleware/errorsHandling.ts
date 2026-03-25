import {Request, Response, NextFunction} from "express"
import ServiceError from "../errors/ServiceError.js"
import { ZodError } from "zod";
export default function errorsHandler(error: Error, _: Request, res: Response, __: NextFunction) {
    if (error instanceof ServiceError) {
        res.statusCode = error.code;
        res.end(error.message);
    } else if (error instanceof ZodError) {
        res.statusCode = 400
        res.end(error.issues.map(issue => `${issue.path}: ${issue.message}`).join(";"))
    } else if ((error as any).status) {
        res.statusCode = (error as any).status;
        res.end(error.message)
    } else {
        res.statusCode = 500;
        res.end(`unknown error: ${error.message}`)
    }
}