import {Request, Response, NextFunction} from "express"
import ServiceError from "../errors/ServiceError.js"
export default function errorsHandler(error: Error, _: Request, res: Response, __: NextFunction) {
    if (error instanceof ServiceError) {
        res.statusCode = error.code;
        res.end(error.message);
    }
}