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
