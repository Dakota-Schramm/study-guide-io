/*
  File structure that's generated will look like
  StudyGuideIO
  ├── STEM
  |   ├── Course1
  |   ├   ├── File1
  |   ├   ├── File2
  |   ├── Course2
  |   ├   ├── File1
  |   ├   ├── File2
  |-- Writing
  |   ├── Course1
  |   ├── Course2

*/

/* 
  TODO: Add the following features:
    - Add course end date
*/
export class BaseCourse {
  private appHandle?: FileSystemDirectoryHandle;
  private courseHandle?: FileSystemDirectoryHandle;
  private files?: FileSystemFileHandle[];
  private readonly name: string;

  public constructor(name: string, appHandle: FileSystemDirectoryHandle) {
    // name cannot be changed after this initial definition, which has to be either at it's declaration or in the constructor.
    this.name = name;
    this.appHandle = appHandle;
  }

  async initialize(
    appHandle: FileSystemDirectoryHandle,
    courseType: "stem" | "writing",
    courseName: string,
  ) {
    const courseTypeHandle = await this.findDirectory(appHandle, courseType);
    const courseHandle = await courseTypeHandle?.getDirectoryHandle(
      courseName,
      {
        create: true,
      },
    );

    this.courseHandle = courseHandle;
  }

  public getName(): string {
    return this.name;
  }

  public getFiles(): FileSystemFileHandle[] | undefined {
    return this.files;
  }

  public setFiles(files: FileSystemFileHandle[]): void {
    this.files = files;
  }

  private async findDirectory(
    handle: FileSystemDirectoryHandle,
    name: string,
  ): Promise<FileSystemDirectoryHandle | null> {
    let found = null;
    for await (const subdirectory of handle.entries()) {
      const [fileName, fileObj] = subdirectory;
      if (fileName === name) {
        found = fileObj;
        break;
      }
    }

    return found;
  }
}

class STEMCourse extends BaseCourse {
  async initialize(appHandle: FileSystemDirectoryHandle, courseName: string) {
    await super.initialize(appHandle, "stem", courseName);
  }
}

/*
  HELPER FUNCTIONS
*/
/**
 * Creates all courses for the current user
 */
export async function instantiateCourses(
  courseParentDirectories: FileSystemDirectoryHandle[],
) {
  let courses: STEMCourse[] = [];

  console.log({ courseParentDirectories });
  for (const directory of courseParentDirectories) {
    if (directory.kind !== "directory") continue;

    switch (directory.name) {
      case "STEM":
        courses = await instantiateSTEMCourses(directory);
        console.log({ courses });
        break;
      default:
        break;
    }
  }

  return courses;
}

/**
 * Creates all courses for the STEM directory
 */
async function instantiateSTEMCourses(
  stemDirectory: FileSystemDirectoryHandle,
) {
  if (stemDirectory.name !== "STEM") {
    throw new Error("The wrong directory was passed to the function.");
  }

  const stemCourses = [];
  for await (const entry of stemDirectory.values()) {
    if (entry.kind === "directory") {
      const course = await instantiateCourse(entry, "STEM");
      stemCourses.push(course);
    }
  }
  return stemCourses;
}

// TODO: Extract to two methods when implementing the other1
async function instantiateCourse(
  root: FileSystemDirectoryHandle,
  courseType: string,
) {
  const newCourse = new STEMCourse(root.name, root);

  // const courseContents = await Array.fromAsync(root.entries());
  // const courseFiles = courseContents.filter((handle) => handle.kind === "file")

  const files = [];
  for await (const entry of root.values()) {
    if (entry.kind === "file") {
      files.push(entry);
    }
  }
  newCourse.setFiles(files);

  return newCourse;
}

export { STEMCourse };
