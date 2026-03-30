import { Employee } from "../models/Employee.js";
import EmployeesService from "./EmployeesService.js";
import knex, { Knex } from "knex"
import { getId } from "./shared/helper.js";
import {
  EmployeeAlreadyExists,
  EmployeeNotFound,
} from "./shared/service-errors.js";
import logger from "../logger.js";
const DEFAULT_FILE_NAME = "employees-data.sqlite";
const TABLE_NAME ="employees"
class EmployeesServiceSQL implements EmployeesService {
    _db: Knex
    constructor(config: Knex.Config) {
        this._db = knex(config)
    }
    async createTable(): Promise<void> {
        const exists = await this._db.schema.hasTable(TABLE_NAME)
        if (!exists) {
            logger.debug(`Table ${TABLE_NAME} doesn't exist so will be created`)
            await this._db.schema.createTable(TABLE_NAME, table => {
                table.string('id').primary();
                table.string('fullName');
                table.string('department');
                table.string('avatar').defaultTo("");
                table.integer('salary');
                table.string('birthdate');
                table.index(["department"])
            })
            logger.debug(`Table ${TABLE_NAME} created`)
        } else {
            logger.debug(`Table ${TABLE_NAME} already exists`)
        }
    }
  async addEmployee(empl: Employee): Promise<Employee> {
    if (!empl.id) {
        empl.id = getId()
    }
    try {
        await this._db<Employee>(TABLE_NAME).insert(empl)
    } catch (error) {
        throw new EmployeeAlreadyExists(empl.id)
    }
    logger.debug(`employee with id ${empl.id} has been added`)
    return empl
  }
  async updateEmployee(
    id: string,
    field: Partial<Employee>,
  ): Promise<Employee> {
    const res = await this._db<Employee>(TABLE_NAME).where({id}).update(field);
    if(!res) {
        throw new EmployeeNotFound(id)
    }
    logger.debug(`employee with id ${id} has been updated with fields ${JSON.stringify(field)}`)
    return await this.getEmployee(id)
  }
  async deleteEmployee(id: string): Promise<Employee> {
    const empl = await this.getEmployee(id)
    await this._db<Employee>(TABLE_NAME).where({id}).delete()
    logger.debug(`deleted employee with id ${id}`)
    return empl;
  }
  async getEmployee(id: string): Promise<Employee> {
    const empl = await this._db<Employee>(TABLE_NAME).where({id}).first()
    if (!empl) {
        throw new EmployeeNotFound(id)
    }
    return empl;
  }
  async getAll(department?: string): Promise<Employee[]> {
    const query = this._db<Employee>(TABLE_NAME)
    if (department) {
        query.where({department})
    }
    return await query
  }
  async save(): Promise<void> {
    await this._db.destroy()
    logger.debug("connection with DB is closed")
  }
}

const employeesService: EmployeesService = new EmployeesServiceSQL({
    client: "sqlite3",
    connection: {
        filename: process.env.SQLITE_FILE_NAME || DEFAULT_FILE_NAME
    }
});
await (employeesService as EmployeesServiceSQL).createTable()
export default employeesService;
