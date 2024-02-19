import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import React from "react";

type DesiredInputProps = Omit<
  HTMLInputElement,
  "id" | "type" | "required" | "minLength"
>;
type OptionalInputProps = Partial<DesiredInputProps>;
type TextInputProps = OptionalInputProps & { labelText: string };

const TextInput = ({ labelText, name, ...props }: TextInputProps) => {
  return (
    <Label>
      {labelText}
      <Input
        id={name}
        type="text"
        required
        minLength={2}
        {...{ name }}
        {...props}
      />
    </Label>
  );
};

export default TextInput;
