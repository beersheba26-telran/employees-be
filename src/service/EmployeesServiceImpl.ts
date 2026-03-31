import { Employee } from "../models/Employee.js";
import EmployeesService from "./EmployeesService.js";
import {MongoClient, Db, Collection} from "mongodb"
import { getId } from "./shared/helper.js";
import {
  EmployeeAlreadyExists,
  EmployeeNotFound,
} from "./shared/service-errors.js";
import logger from "../logger.js";

const COLLECTION_NAME = process.env.MONGO_COLLECTION_NAME || "employees";
const DB_NAME = process.env.MONGO_DB_NAME || "employees-db"
const USER = process.env.MONGO_USER || "root"
const PASSWORD = process.env.MONGO_PASSWORD
const URI =`mongodb+srv://${USER}:${PASSWORD}@cluster0.nxjwscr.mongodb.net/?appName=Cluster0`
class EmployeesServiceMongo implements EmployeesService {
  private _client: MongoClient;
  private _db: Db | undefined;
  private _collection: Collection<Employee> | undefined
  constructor() {
      this._client = new MongoClient(URI)
      
  }
  async init(): Promise<void> {
      await this._client.connect();
      this._db = this._client.db(DB_NAME)
      this._collection = this._db.collection(COLLECTION_NAME)
      this._collection.createIndex({id: 1}, {unique: true})
      this._collection.createIndex({department: "hashed"}, {unique:false})
  }
 async addEmployee(empl: Employee): Promise<Employee> {
    if(!empl.id) {
      empl.id = getId()
    }
    try {
      await this._collection?.insertOne(empl)
    } catch (error) {
       throw new EmployeeAlreadyExists(empl.id)
    }
    return empl;
  }
  async updateEmployee(id: string, fields: Partial<Employee>): Promise<Employee> {
    const empl = await this._collection?.findOneAndUpdate (
      {id},
      {$set: fields},
      {returnDocument: "after"}
    )
    if(!empl) {
      throw new EmployeeNotFound(id)
    }
    return empl
  }
  async deleteEmployee(id: string): Promise<Employee> {
    const empl = await this._collection?.findOneAndDelete({id})
    if (!empl) {
      throw new EmployeeNotFound(id)
    }
    return empl
  }
  async getEmployee(id: string): Promise<Employee> {
    const empl = await this._collection?.findOne({id})
    if (!empl) {
      throw new EmployeeNotFound(id)
    }
    return empl
  }
  async getAll(department?: string): Promise<Employee[]> {
    const filter: object = department ? {department} : {};
    return await this._collection!.find(filter).toArray()
  }
  async save(): Promise<void> {
    await this._client.close()
  }
}
 const employeesService: EmployeesService = new  EmployeesServiceMongo()
 await (employeesService as EmployeesServiceMongo).init()
export default employeesService;
