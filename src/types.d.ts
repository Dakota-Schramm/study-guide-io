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
}

type Nullable<T> = T | null | undefined;

type Course = "STEM";
