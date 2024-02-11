import React, { useContext, useEffect, useState } from "react";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Course } from "@/classes/course/course";
import { UserContext } from "@/contexts/UserContext";

const CourseActions = ({ course }: { course: Course }) => {
  const { user } = useContext(UserContext);
  const [exams, setExams] = useState<string[][]>([]);

  useEffect(() => {
    async function getExams() {
      const exams = await course.getExams();
      setExams(exams);
    }
    getExams();
  }, [course]);

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
          <DropdownMenuItem onClick={() => handleDownload(course, exam)}>
            Download Exam {idx + 1}
          </DropdownMenuItem>
        ))}
        <DropdownMenuItem
          onClick={() => handleFinalDownload(user?.config, course)}
        >
          Download Final Exam
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

async function handleDownload(course, exam) {
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

  user.config?.download(pdfFiles, attachmentFiles);
}

async function handleFinalDownload(userConfig, course) {
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

  userConfig.download(pdfFiles, attachmentFiles);
}

export default CourseActions;
