import { Employee } from "../models/Employee.js";

export default interface EmployeesService {
     addEmployee(empl: Employee): Promise<Employee>;
     updateEmployee(id: string, field: Partial<Employee>): Promise<Employee>;
     deleteEmployee(id: string): Promise<Employee>;
     getEmployee(id: string): Promise<Employee>;
     getAll(department?: string): Promise<Employee[]>;
     save(): Promise<void>

}