"use client";

import React, { forwardRef, useContext, useState } from "react";
import { useRouter } from "next/navigation";

import { Button } from "@/components/ui/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { UserContext } from "@/contexts/UserContext";
import {
  downloadGuideToFileSystem,
  downloadToBrowser,
} from "@/lib/browserDownloadHelpers";
import { Input } from "@/components/ui/input";

// SUBMIT BUTTON STATES
// User has no config
//   - Give user option to allow permissions
//   - Download into downloads folder
// User has config
//   - Download into storage
//   - Download into downloads folder

export type SubmitButtonProps = {
  isValid?: boolean | "open" | "close";
  setIsValid?: React.Dispatch<
    React.SetStateAction<"open" | "close" | undefined>
  >;
};

// Add isOpen state to open and close popovers
// TODO: Change button color based on formValidity
export const SubmitButton = ({ isValid, setIsValid }: SubmitButtonProps) => {
  const { user } = useContext(UserContext);

  let primaryBtn;
  if (user.config === undefined) {
    primaryBtn = (
      <Input form="pdf-create" type="submit" value="Setup Permissions" />
    );
  } else {
    primaryBtn = (
      <Input form="pdf-create" type="submit" value="Add to Courses" />
    );
  }

  // Changew to use dialog instead of popover
  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button type="button" className="w-full">
          Submit
        </Button>
      </PopoverTrigger>
      <PopoverContent>
        {primaryBtn}
        <Input form="pdf-create" type="submit" value="Download" />
      </PopoverContent>
    </Popover>
  );
};
