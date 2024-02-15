import React, { useEffect, useRef } from "react";

type FileInputProps = {
  fileList: File[];
  onChange(fileList: FileList | null): void;
  accept?: string;
  multiple?: boolean;
};

// From https://stackoverflow.com/questions/76103230/proper-way-to-create-a-controlled-input-type-file-element-in-react
const FileInput = ({ fileList = [], onChange, ...props }: FileInputProps) => {
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (inputRef.current) {
      const dataTransfer = new DataTransfer();
      fileList.forEach((file) => dataTransfer.items.add(file));
      inputRef.current.files = dataTransfer.files;
    }
  }, [fileList]);

  return (
    <input
      type="file"
      ref={inputRef}
      data-testid="uploader"
      onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
        onChange(e.target.files);
      }}
      {...props}
    />
  );
};

export default FileInput;
