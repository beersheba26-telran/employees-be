import morgan from "morgan"
const morganFormat = process.env.MORGAN_FORMAT || 'tiny'
const skipCode = process.env.MORGAN_SKIP_CODE || 400
const logger_http = morganFormat === "none" ? morgan(() => null):
morgan(morganFormat, {
    skip: (_, res) => res.statusCode < +skipCode
})
export default logger_http