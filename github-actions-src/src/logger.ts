/* eslint-disable @typescript-eslint/no-explicit-any */
import { PlatformServices } from './platformServices'

export enum LogLevel {
  DEBUG = 0,
  INFO = 10,
  WARN = 20,
  ERROR = 30
}

type LogWriter = (message: string) => void
type MessageProvider = () => string

export interface Logger {
  withTag(tag: string): Logger
  debug(message: MessageProvider, ...args: any[])
  info(message: MessageProvider, ...args: any[])
  warn(message: MessageProvider, ...args: any[])
  error(message: MessageProvider, ...args: any[])
}

export const createLogger = (platform: PlatformServices, name: string, tag?: string, logLevel: string = 'INFO'): Logger => {
  const logLevelValue = LogLevel[logLevel as keyof typeof LogLevel] || LogLevel.INFO
  const log = (level: LogLevel, logFunc: LogWriter, message: MessageProvider, args: any[]) => {
    if (level >= logLevelValue) {
      const argsString = args && args.length > 0 ? `args:\n ${JSON.stringify(args)}` : ''
      logFunc(`[${name}${tag ? `:${tag}` : ''}] ${message()} ${argsString}`)
    }
  }

  return {
    withTag: (tag: string) => createLogger(platform, name, tag, logLevel),
    debug: (message: MessageProvider, ...args: any[]) => log(LogLevel.DEBUG, platform.debug, message, args),
    info: (message: MessageProvider, ...args: any[]) => log(LogLevel.INFO, platform.info, message, args),
    warn: (message: MessageProvider, ...args: any[]) => log(LogLevel.WARN, platform.warning, message, args),
    error: (message: MessageProvider, ...args: any[]) => log(LogLevel.ERROR, platform.error, message, args)
  } as Logger
}
