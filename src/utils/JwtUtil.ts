import { Account } from "../models/Account.js";
import jwt, { JwtPayload } from "jsonwebtoken"

export default class JwtUtil {
    static sign(account: Account): string {
        return jwt.sign({role: account.role}, process.env.JWT_SECRET!, {
            subject: account.username,
            expiresIn: +(process.env.JWT_EXPIRES_IN || 3600)

        })
    }
    static verify(token: string): JwtPayload {
        return jwt.verify(token, process.env.JWT_SECRET!) as JwtPayload
    }
}