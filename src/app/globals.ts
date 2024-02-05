import log from "loglevel";

const appLogger = log;
appLogger.setDefaultLevel(log.levels.WARN);

export type LogLevelLogger = typeof appLogger;
window.log = appLogger;
