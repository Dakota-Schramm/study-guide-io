import React, { useEffect, useRef } from "react";

type FileInputProps = {
  fileList: File[];
  onChange(fileList: FileList | null): void;
  accept?: string;
  multiple?: boolean;
};

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
