import { RequestHandler, Request, Response, NextFunction } from "express";
import logger from "../logger.js";
import JwtUtil from "../utils/JwtUtil.js";
import { JsonWebTokenError, JwtPayload } from "jsonwebtoken";
import { JwtError, AuthenticationError, PermissionError } from "../errors/authErrors.js";
const BEARER = "Bearer "
export const security_context: RequestHandler = (req, res, next) => {
    const authHeader = req.header("AUthorization")
    if (authHeader && authHeader.startsWith(BEARER)) {
        const token = authHeader.slice(BEARER.length)
        logger.debug(`security_context: url is ${req.url}; method is ${req.method}; received token ${token.slice(0, 5)}`)
        const {username, role, auth_error} = parseToken(token)
        req.username = username; req.role = role; req.auth_error = auth_error
        logger.debug(`added to request ${JSON.stringify({username, role, auth_error})}`)
    } else {
        logger.debug(`security_context: url is ${req.url}; method is ${req.method}; no token received`)
    }
    next()
   
}
function parseToken(token: string): {username: string|null, role: string|null, auth_error: string|null} {
    let payload: JwtPayload = {sub: null, role: null} as any
    let auth_error: string|null = null;
    try {
        payload = JwtUtil.verify(token)
    } catch (error) {
        const jwtError: JsonWebTokenError = error as JsonWebTokenError
        auth_error = `${jwtError.name}: ${jwtError.message}`
    }
    return {username: payload.sub!, role: payload.role, auth_error}
   
}
export function auth(...roles: string[]): RequestHandler {
    return (req: Request, res: Response, next: NextFunction) => {
        if (req.auth_error) {
            throw new JwtError(req.auth_error)
        }
        if (!req.username) {
            throw new AuthenticationError()
        }
        if (!req.role || (roles.length != 0 && !roles.includes(req.role))) {
            throw new PermissionError()
        }
        next()
    }
}
