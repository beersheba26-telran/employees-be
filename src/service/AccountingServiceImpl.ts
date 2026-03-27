import { Account } from "../models/Account.js";
import { User } from "../models/User.js";
import AccountingService from "./AccountingService.js";
import {readFileSync, existsSync} from "node:fs"
import {writeFile} from "node:fs/promises"
import {compare, hash} from "bcrypt-ts"
import { AccountAlreadyExists, AccountingError, AccountNotFound } from "./shared/service-errors.js";
import JwtUtil from "../utils/JwtUtil.js";
import logger from "../logger.js";
const DEFAULT_ACCOUNTS_FILE_PATH = "accounts-DataTransfer.txt"

class AccountingServiceMap implements AccountingService {
    private _accounts: Map<string, Account> = new Map() ;
    private _filePath: string;
    rootUsername: string;
    accountAdminRole: string ;
    private _flUpdate: boolean = false
    private _salt: number
    constructor () {
        this.rootUsername = process.env.ROOT_USERNAME || "root"
        this.accountAdminRole = process.env.ACCOUNT_ADMIN_ROLE || "ACCOUNTS_ADMIN"
        this._filePath = process.env.ACCOUNTS_FILE_PATH || DEFAULT_ACCOUNTS_FILE_PATH
        this._salt = +(process.env.SALT || 12)
        logger.debug(`config of AccountingService: rootUserName is ${this.rootUsername}\
            \naccountAdminRole is ${this.accountAdminRole}\
            \nfilePath is ${this._filePath}\
            \nsalt is ${this._salt}`)
        this._load()
        this._setRootAccount()

    }
    private _setRootAccount() {
        this.addAccount(this.rootUsername, process.env.ROOT_PASSWORD!, this.accountAdminRole)
        logger.debug(`root account has been set`)
        this._flUpdate = false;
    }
    private _load() {
       if (existsSync(this._filePath)) {
        const accountsJSON = readFileSync(this._filePath, {encoding: "utf8"})
        const accounts: Array<Account> = JSON.parse(accountsJSON)
        accounts.forEach(acc => this._accounts.set(acc.username, acc))
        logger.debug(`${accounts.length} accounts are restored`)
       } else {
        logger.debug(`file with accounts doesn't exist`)
       }
       this._flUpdate = false;
    }
    public async save(): Promise<void> {
       if (this._flUpdate) {
        const accounts: Array<Account> =
         Array.from(this._accounts.values()).filter(acc => acc.username != this.rootUsername)
         await writeFile(this._filePath, JSON.stringify(accounts), {encoding: "utf8"})
         logger.debug(`${accounts.length} accounts has been saved`)
       } else {
        logger.debug(`accounts are not changed and not saved`)
       }
    }
    async getToken(username: string, password: string): Promise<User> {
       const account = this._accounts.get(username);
       if(!account || !await compare(password, account.password)) {
        throw new AccountingError()
       }
       return {role: account.role, username, token: JwtUtil.sign(account)}
    }
    async addAccount(username: string, passwordText: string, role: string): Promise<void> {
        this.checkUsername(username);
        this._accounts.set(username, {username, role, password: await hash(passwordText, this._salt as number)})
        logger.debug(`account ${username} added`)
        this._flUpdate = true
    }
    private checkUsername(username: string, isExist: boolean = true) {
        if (isExist && this._accounts.has(username)) {
            throw new AccountAlreadyExists(username);
        }
        if (!isExist && !this._accounts.has(username)) {
            throw new AccountNotFound(username)
        }
    }

    async deleteAccount(username: string): Promise<void> {
        this.checkUsername(username, false)
        this._accounts.delete(username)
        logger.debug(`account ${username} deleted`)
        this._flUpdate = true
    }
    async updatePassword(username: string, newPassword: string): Promise<void> {
       this.checkUsername(username, false)
       const account = this._accounts.get(username)!
       logger.debug(`account ${username}; old password ${account.password}`)
       Object.assign(account, {password: await hash(newPassword, this._salt)});
        logger.debug(`account ${username}; new password ${account.password}`);
        this._flUpdate =true
       
    }
    
}
const accountingService: AccountingService = new AccountingServiceMap()
export default accountingService