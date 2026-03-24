import { Employee } from "../models/Employee.js";
import EmployeesService from "./EmployeesService.js";
import path from "node:path";
import {existsSync, readFileSync} from "node:fs"
import {writeFile} from "node:fs/promises"
import { getId } from "./shared/helper.js";
import { EmployeeAlreadyExists } from "./shared/service-errors.js";
const DEFAULT_FILE_NAME = "employees-data.txt"
class EmployeesServiceMap implements EmployeesService {
    private _employees: Map<string, Employee> = new Map();
    private _filePath: string
    constructor(private _flUpdate: false) {
            this._filePath = path.resolve(
                process.cwd(),
                process.env.EMPLOYEES_FILE_NAME || DEFAULT_FILE_NAME
            )
            this._load()
    }
    private _load() {
        if (existsSync(this._filePath)) {
            const employeesJSON = readFileSync(this._filePath, {encoding: "utf8"})
            const employees: Employee[] = JSON.parse(employeesJSON)
            employees.forEach(empl => this.addEmployee(empl))
        }
    }
    async addEmployee(empl: Employee): Promise<Employee> {
        if (!empl.id) {
            empl.id = getId();
        }
        if (this._employees.has(empl.id)) {
            throw new EmployeeAlreadyExists(empl.id)
        }
        this._employees.set(empl.id, empl)
        return empl

    }
    updateEmployee(id: string, field: Partial<Employee>): Promise<Employee> {
        throw new Error("Method not implemented.");
    }
    deleteEmployee(id: string): Promise<Employee> {
        throw new Error("Method not implemented.");
    }
    getEmployee(id: string): Promise<Employee> {
        throw new Error("Method not implemented.");
    }
    getAll(department?: string): Promise<Employee[]> {
        throw new Error("Method not implemented.");
    }
    async save(): Promise<void> {
        const employees: Employee[] = Array.from(this._employees.values())
        await writeFile(this._filePath, JSON.stringify(employees), {encoding:"utf8"})
    }
    
}