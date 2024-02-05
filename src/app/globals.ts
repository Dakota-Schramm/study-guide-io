import log from "loglevel";

const appLogger = log;
appLogger.setDefaultLevel(log.levels.INFO);

declare global {
  interface Window {
    log: LogLevelLogger; // TODO fix this to correct type
  }
}

export type LogLevelLogger = typeof appLogger;
window.log = appLogger;
