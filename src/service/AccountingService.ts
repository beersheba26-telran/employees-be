import { User } from "../models/User.js";

export default interface AccountingService {
    rootUsername: string
    accountAdminRole: string
    getToken(username: string, password: string): Promise<User>;
    addAccount(username: string, password: string, role: string): Promise<void>
    deleteAccount(username: string): Promise<void>
    updatePassword(username: string, newPassword: string): Promise<void>
    save(): Promise<void>
}