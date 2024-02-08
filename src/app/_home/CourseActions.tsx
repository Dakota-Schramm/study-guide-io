import React, { useContext, useEffect, useState } from "react";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { BaseCourse } from "@/classes/course";
import { UserContext } from "@/contexts/UserContext";
import { RestrictedAccessUserConfig } from "@/classes/config/user/restricted-access";

const CourseActions = ({ course }: { course: BaseCourse }) => {
  const { user } = useContext(UserContext);

  const [exams, setExams] = useState<string[][]>([]);
  useEffect(() => {
    async function getExams() {
      const exams = await course.getExams();
      setExams(exams);
    }
    getExams();
  }, []);

  async function handleDownload(exam) {
    const examFiles = course.files?.filter((file) => exam.includes(file.name));

    if (!examFiles) {
      alert("No files included in this exam!");
      return;
    }

    const pdfFileHandles = examFiles?.filter((file) =>
      file.name.endsWith(".pdf"),
    );
    const pdfFiles = await Promise.all(
      pdfFileHandles.map(async (file) => await file.getFile()),
    );

    const attachmentFileHandles = examFiles?.filter(
      (file) => file.name.endsWith(".png") || file.name.endsWith(".jpg"),
    );
    const attachmentFiles = await Promise.all(
      attachmentFileHandles.map(async (file) => await file.getFile()),
    );

    if (pdfFiles.length === 0 && attachmentFiles.length === 0) {
      alert(
        "Make sure that you're only attachment the following file types to exams: .pdf, .jpg, .png",
      );
      return;
    }

    new RestrictedAccessUserConfig().downloadGuide(pdfFiles, attachmentFiles);
  }

  async function handleFinalDownload() {
    const courseFiles = course.getCourseFiles();
    if (!courseFiles) {
      alert("No files exist for course");
    }

    const pdfFileHandles = courseFiles?.filter((file) =>
      file.name.endsWith(".pdf"),
    );
    const pdfFiles = await Promise.all(
      pdfFileHandles.map(async (file) => await file.getFile()),
    );

    const attachmentFileHandles = courseFiles?.filter(
      (file) => file.name.endsWith(".png") || file.name.endsWith(".jpg"),
    );
    const attachmentFiles = await Promise.all(
      attachmentFileHandles.map(async (file) => await file.getFile()),
    );

    if (pdfFiles.length === 0 && attachmentFiles.length === 0) {
      alert(
        "Make sure that you're only attachment the following file types to exams: .pdf, .jpg, .png",
      );
      return;
    }

    new RestrictedAccessUserConfig().downloadGuide(pdfFiles, attachmentFiles);
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <button type="button" className="bg-green-500">
          Actions
        </button>
      </DropdownMenuTrigger>
      <DropdownMenuContent>
        <DropdownMenuLabel>Exam Actions</DropdownMenuLabel>
        <DropdownMenuSeparator />
        {exams.map((exam, idx) => (
          <DropdownMenuItem onClick={() => handleDownload(exam)}>
            Download Exam {idx + 1}
          </DropdownMenuItem>
        ))}
        <DropdownMenuItem onClick={handleFinalDownload}>
          Download Final Exam
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default CourseActions;
