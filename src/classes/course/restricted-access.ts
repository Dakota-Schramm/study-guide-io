import { openDB } from "idb";
import { CourseConfig } from "../config/course";
import { BaseCourse } from "./abstract";
import { getDatabaseInfo, getDatabaseVersion } from "@/lib/idbUtils";

export class RestrictedAccessBaseCourse extends BaseCourse {
  private objectStoreName: string;
  private config?: CourseConfig;

  public constructor(objectStoreName: string) {
    // name cannot be changed after this initial definition, which has to be either at it's declaration or in the constructor.
    super();
    this.objectStoreName = objectStoreName;
    this.files = [];
  }

  async initialize() {
    if (!this.objectStoreName) {
      window.log.warn("ObjectStoreName not found");
      return;
    }

    window.log.debug(`Setting up course for ${this.getName()}...`);
    // TODO: Implement this and save settings for courses somewhere...

    // TODO get files from object store and set object with { name: storeName, blob: blob }

    const { version } = await getDatabaseInfo("courses");
    const db = await openDB("courses", version);
    const fileValues = await db.getAll(this.objectStoreName);
    const fileBlobs = await fileValues.map((file) => {
      return new Blob([file], { type: "application/pdf" });
    });

    console.log("fileBlobText", fileBlobs);

    // this.config = config;
    this._files = fileBlobs;
  }

  public toString(): string {
    return `${this.getName() ?? "Course"} with ${
      this?.files?.length ?? 0
    } files`;
  }

  public getName(): string | undefined {
    return this.courseHandle?.name;
  }

  public getCourseFiles() {
    if (!this.files) return [];
  }

  public changeConfigFile(kvPairs: [string, string][]) {}

  /**
   * Creates a new array of files to add to the config's "exams" key
   * @param filesToAssign
   * @returns
   */
  public async assignFilesToExam(filesToAssign: string[]) {}

  public async getExams() {
    return [];
  }

  public async deleteExam(idxToDelete: number): Promise<string[][]> {}
}

class RestrictedSTEMCourse extends RestrictedAccessBaseCourse {
  async initialize() {
    await super.initialize();
  }
}

export { RestrictedSTEMCourse };
