import ServiceError from "../../errors/ServiceError.js";

export class EmployeeAlreadyExists extends ServiceError {
    constructor(id: string) {
        super(409, `employee with id ${id} already exists`)
    }
}