import { ensureError } from "@/lib/utils";

const exampleCourseConfig = {
  foo: "baz",
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

        const writable = await handle.createWritable();
        await writable.write(JSON.stringify(exampleCourseConfig));
        await writable.close();
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

  public write() {
    return;
  }
}
