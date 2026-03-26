import ServiceError from "./ServiceError.js";

export default class ValidationError extends ServiceError {
    constructor(message: string) {
        super(400, message)
    }
}