import express, {Request, Response} from "express"
import logger from "../logger.js"
import employeesService from "../service/EmployeesServiceImpl.js";
import { Employee } from "../models/Employee.js";
import errorsHandler from "../middleware/errorsHandling.js";
import corsMW from "../middleware/cors-middleware.js";
import logger_http from "../middleware/logger_http.js";
import { validation_create, validation_create_account, validation_login, validation_update, validation_update_password } from "../middleware/validation-middleware.js";
import accountingService from "../service/AccountingServiceImpl.js";
import { LoginData } from "../models/LoginData.js";
import { Account } from "../models/Account.js";
import { security_context, auth } from "../middleware/auth.js";
import { PermissionError } from "../errors/authErrors.js";
import employeesRouter from "./routes/employeesRouter.js";
const app = express();
app.use(security_context)
app.use(corsMW)
app.use(express.json());
app.use(logger_http) //aspect logging
app.use("/employees", employeesRouter)
app.post("/accounts/login", validation_login, async (req: Request<{}, {}, LoginData>, res: Response) => {
    const {username, password} = req.body;
    const user = await accountingService.getToken(username, password)
    res.json(user)
})
app.post("/accounts", auth(accountingService.accountAdminRole), validation_create_account, async (req: Request<{}, {}, Account>, res: Response) => {
    res.statusCode = 204
    const {username, password, role} = req.body
    await accountingService.addAccount(username, password, role);
    res.end()
})
app.patch("/accounts",auth(),validation_update_password, async (req: Request<{}, {}, LoginData>, res: Response) => {
    if(req.username != req.body.username && req.role != accountingService.accountAdminRole) {
        throw new PermissionError()
    }
    res.statusCode = 204;
    const {username, password} = req.body
    await accountingService.updatePassword(username, password)
    res.end()
} )
app.delete("/accounts/:username", auth(accountingService.accountAdminRole), async (req: Request<{username: string}>, res: Response) => {
    res.statusCode = 204
    await accountingService.deleteAccount(req.params.username)
    res.end()
})
app.use(errorsHandler)
export default app;