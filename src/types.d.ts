import { LogLevelLogger } from "./app/globals";

type showDirectoryPickerOptions = {
  id?: unknown;
  mode?: "read" | "readwrite";
  startIn?: string;
};

interface Window {
  showDirectoryPicker: (
    options: showDirectoryPickerOptions,
  ) => Promise<FileSystemDirectoryHandle>;
  log: LogLevelLogger; // TODO fix this to correct type
}
