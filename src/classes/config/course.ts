import { ensureError } from "@/lib/utils";

const exampleCourseConfig = {
  exams: [],
};

export class CourseConfig {
  private courseHandle: FileSystemDirectoryHandle;
  public handle?: FileSystemFileHandle;

  public constructor(courseHandle: FileSystemDirectoryHandle) {
    // name cannot be changed after this initial definition, which has to be either at it's declaration or in the constructor.
    this.courseHandle = courseHandle;
  }

  public async initialize() {
    window.log.info(
      `Course Config ${this?.courseHandle?.name} being initialized...`,
    );

    let handle: FileSystemFileHandle;
    try {
      handle = await this.courseHandle.getFileHandle("config.json");
    } catch (error: unknown) {
      const err = ensureError(error);

      if (err.name === "NotFoundError") {
        handle = await this.courseHandle.getFileHandle("config.json", {
          create: true,
        });
        this.saveToFile(handle, exampleCourseConfig);
      } else {
        throw error;
      }
    }

    this.handle = handle;
  }

  public async read() {
    if (!this.handle) return;

    const f = await this.handle.getFile();
    const jsonResponse = await new Response(f).json();

    return jsonResponse;
  }

  public async write(kvPairs: [string, string][]) {
    const configObj = await this.read();
    for (const [k, v] of kvPairs) {
      configObj[k] = v;
    }

    await this.saveToFile(this.handle, configObj);
  }

  public async replace(newConfig: typeof exampleCourseConfig) {
    await this.saveToFile(this.handle, newConfig);
  }

  private async saveToFile(
    fileHandle: FileSystemFileHandle,
    json: typeof exampleCourseConfig,
  ) {
    const writable = await fileHandle.createWritable();
    await writable.write(JSON.stringify(json));
    await writable.close();
  }
}
