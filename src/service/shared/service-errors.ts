import ServiceError from "../../errors/ServiceError.js";

export class EmployeeAlreadyExists extends ServiceError {
    constructor(id: string) {
        super(409, `employee with id ${id} already exists`)
    }
}
export class EmployeeNotFound extends ServiceError {
    constructor(id: string) {
        super(404, `employee with ${id} not found`)
    }
}
export class AccountingError extends ServiceError {
    constructor() {
        super(400, "Incorrect User credentials")
    }
}
export class AccountAlreadyExists extends ServiceError {
    constructor(username: string) {
        super(409, `account ${username} already exists`)
    }
}
export class AccountNotFound extends ServiceError {
    constructor(username: string) {
        super(404, `account ${username} not found`)
    }
}
