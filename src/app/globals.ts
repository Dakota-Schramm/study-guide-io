import log from "loglevel";

const appLogger = log;
appLogger.setDefaultLevel(log.levels.INFO);

declare global {
  interface Window {
    log: log.RootLogger; // TODO fix this to correct type
  }
}

if (typeof window !== "undefined") {
  window.log = appLogger;
}
