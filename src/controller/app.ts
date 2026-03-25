import express, {Request} from "express"
import logger from "../logger.js"
import employeesService from "../service/EmployeesServiceImpl.js";
import { Employee } from "../models/Employee.js";
import errorsHandler from "../middleware/errorsHandling.js";
import corsMW from "../middleware/cors-middleware.js";
import logger_http from "../middleware/logger_http.js";
const app = express();
app.use(corsMW)
app.use(express.json());
app.use(logger_http) //aspect logging
app.get("/employees", async(req: Request<{},{},{},{department?: string}>, res) => {
    const employees: Employee[] = await employeesService.getAll(req.query.department);
    logger.debug(`received ${employees.length} employee object`)
    res.json(employees)
})
app.post("/employees", async(req: Request<{},{}, Employee>, res) => {
    res.statusCode = 201;
    const empl = await employeesService.addEmployee(req.body)
    res.json(empl)
})
app.patch("/employees/:id", async(req: Request<{id: string},{}, Partial<Employee>>, res) => {
    logger.debug(`received query for updating employee with id "${req.params.id}"`)
    logger.debug(`updater is ${JSON.stringify(req.body)}`)
    const empl = await employeesService.updateEmployee(req.params.id.trim(), req.body)
    res.json(empl)
})
app.delete("/employees/:id", async(req: Request<{id: string}>, res) => {
    logger.debug(`received query for deleting employee with id "${req.params.id}"`)
    const empl = await employeesService.deleteEmployee(req.params.id.trim())
    logger.debug(`employee with id "${empl.id} deleted"`)
    res.json(empl)
})
app.use(errorsHandler)
export default app;