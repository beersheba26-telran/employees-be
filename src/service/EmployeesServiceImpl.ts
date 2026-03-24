import { Employee } from "../models/Employee.js";
import EmployeesService from "./EmployeesService.js";
import path from "node:path";
import {existsSync, readFileSync} from "node:fs"
import {writeFile} from "node:fs/promises"
import { getId } from "./shared/helper.js";
import { EmployeeAlreadyExists, EmployeeNotFound } from "./shared/service-errors.js";
import logger from "../logger.js";
const DEFAULT_FILE_NAME = "employees-data.txt"
class EmployeesServiceMap implements EmployeesService {
    private _employees: Map<string, Employee> = new Map();
    private _filePath: string
    constructor(private _flUpdate: boolean = false) {
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
            logger.debug(`${employees.length} employee objects have been restored`)
            this._flUpdate = false;
        } else {
            logger.debug("employees are not restored as file doesn't exist")
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
        this._flUpdate = true;
        return empl

    }
    async updateEmployee(id: string, field: Partial<Employee>): Promise<Employee> {
        delete field["id"] //make sure id isn't changed
        const empl: Employee = await this.getEmployee(id);
        this._flUpdate = true;
        return Object.assign(empl, field)
    }
    async deleteEmployee(id: string): Promise<Employee> {
        const empl: Employee = await this.getEmployee(id);
        this._employees.delete(id);
        this._flUpdate = true;
        return empl;

    }
    async getEmployee(id: string): Promise<Employee> {
        const empl = this._employees.get(id);
        if(!empl) {
            throw new EmployeeNotFound(id)
        }
        return empl;
    }
    async getAll(department?: string): Promise<Employee[]> {
        const employees: Employee[] = Array.from(this._employees.values())
        return department ? employees.filter(empl => empl.department === department): employees
    }
    async save(): Promise<void> {

        if (this._flUpdate) {
            const employees: Employee[] = Array.from(this._employees.values())
            await writeFile(this._filePath, JSON.stringify(employees), {encoding:"utf8"})
            this._flUpdate = false;
            logger.debug(`${employees.length} employee objects have been saved into ${this._filePath}`)
        } else {
            logger.debug("Employees are not saved because not updated")
        }
    }
    
}
const employeesService:EmployeesService = new EmployeesServiceMap();
export default employeesService