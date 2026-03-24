import pino from "pino"
import pretty from "pino-pretty"
const prettyTime = new Intl.DateTimeFormat(undefined,{
    timeZone: process.env.TZ,
    dateStyle: "short",
    timeStyle: "medium",
    hour12: false

    
})
const stream = pretty({
  translateTime: false,
  customPrettifiers: {
    time: (value) => prettyTime.format(new Date(Number(value)))
  },
  ignore: "pid,hostname",
  levelFirst: true,
  singleLine: true
})

const validLevels = new Set(["trace", "debug", "info", "warn", "error", "fatal", "silent"])
const envLevel = (process.env.LOGGER_LEVEL ?? "").toLowerCase()
const level = validLevels.has(envLevel) ? envLevel : "info"

const logger = pino({ level }, stream)
export default logger