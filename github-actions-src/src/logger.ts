import core from '@actions/core'

enum LogLevel {
  DEBUG = 0,
  INFO = 10,
  WARN = 20,
  ERROR = 30
}

type LogWriter = (message: string) => void;
type MessageProvider = () => string;

const logger = (name: string, tag?: string, logLevel: string = "INFO") => {
  const logLevelValue = LogLevel[logLevel as keyof typeof LogLevel] || LogLevel.INFO;
  const log = (level: LogLevel, logFunc: LogWriter, message: MessageProvider, args: any[]) => {
    if (level >= logLevelValue) {
      const argsString = args && args.length > 0 ? `args:\n ${JSON.stringify(args)}` : "";
      logFunc(`[${name}${tag ? `:${tag}` : ''}] ${message()} ${argsString}`);
    }
  }

  return {
    withTag: (tag: string) => logger(name, tag, logLevel),
    debug: (message: MessageProvider, ...args: any[]) => log(LogLevel.DEBUG, core.debug, message, args),
    info: (message: MessageProvider, ...args: any[]) => log(LogLevel.INFO, core.info, message, args),
    warn: (message: MessageProvider, ...args: any[]) => log(LogLevel.WARN, core.warning, message, args),
    error: (message: MessageProvider, ...args: any[]) => log(LogLevel.ERROR, core.error, message, args),
  }
}


export const createLogger = (name: string, tag?: string, logLevel: string = "INFO") => logger(name, tag, logLevel);
