"use client";

import React, { useContext } from "react";

import { Button } from "@/components/ui/button";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

import { ButtonContent } from "./ButtonContent";
import { UserContext } from "@/contexts/UserContext";
import { useRouter } from "next/navigation";

const DeleteAppDataButton = () => {
  const { user } = useContext(UserContext);
  const router = useRouter();

  async function handleDelete() {
    const root = await user.config?.getRoot();
    if (!root) return;

    for await (const [directoryName, directoryHandle] of root.entries()) {
      await root.removeEntry(directoryName, { recursive: true });
    }
    alert("Data deleted");
    router.push("/permissions");
  }

  return (
    <>
      <AlertDialog>
        <AlertDialogTrigger asChild>
          <Button className="flex flex-col" variant="destructive">
            <ButtonContent
              title="Delete App Data"
              description="Deletes everything inside of your home directory (all PDFs and configs)"
            />
          </Button>
        </AlertDialogTrigger>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete all
              PDFs and config files created using this app.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleDelete}>
              Continue
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
};

export default DeleteAppDataButton;
