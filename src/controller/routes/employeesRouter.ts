import express, {Request, Response} from "express";
import employeesService from "../../service/EmployeesServiceImpl.js";
import { auth } from "../../middleware/auth.js";
import { Employee } from "../../models/Employee.js";
import logger from "../../logger.js";
import accountingService from "../../service/AccountingServiceImpl.js";
import { validation_create, validation_update } from "../../middleware/validation-middleware.js";
const employeesRouter = express.Router();
employeesRouter.get("/", auth(),async(req: Request<{},{},{},{department?: string}>, res: Response) => {
    const employees: Employee[] = await employeesService.getAll(req.query.department);
    logger.debug(`received ${employees.length} employee object`)
    res.json(employees)
})
employeesRouter.post("/", auth("ADMIN"), validation_create, async(req: Request<{},{}, Employee>,
     res: Response) => {
    res.statusCode = 201;
    const empl = await employeesService.addEmployee(req.body)
    res.json(empl)
})
employeesRouter.patch("/:id", auth("ADMIN", accountingService.accountAdminRole), validation_update, async(req: Request<{id: string},{}, Partial<Employee>>,
     res: Response) => {
    logger.debug(`received query for updating employee with id "${req.params.id}"`)
    logger.debug(`updater is ${JSON.stringify(req.body)}`)
    const empl = await employeesService.updateEmployee(req.params.id.trim(), req.body)
    res.json(empl)
})
employeesRouter.delete("/:id", auth("ADMIN"),async(req: Request<{id: string}>, res) => {
    logger.debug(`received query for deleting employee with id "${req.params.id}"`)
    const empl = await employeesService.deleteEmployee(req.params.id.trim())
    logger.debug(`employee with id "${empl.id} deleted"`)
    res.json(empl)
})
export default employeesRouter;