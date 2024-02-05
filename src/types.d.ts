// TODO: Move these types into a different file and just import them.
// d.ts files shouldn't be used since behavior is confusing...
//! DO NOT PUT IMPORTS OR EXPORTS IN THIS FILE

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
