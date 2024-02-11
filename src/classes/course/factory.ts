import { FullAccessUserConfig } from "@/classes/config/user/full-access";
import { RestrictedAccessUserConfig } from "../config/user/restricted-access";
import { Course } from "./course";

export class CourseFactory {
  private userConfig: FullAccessUserConfig | RestrictedAccessUserConfig;
  private _courses: Course[] = [];

  constructor(config: FullAccessUserConfig | RestrictedAccessUserConfig) {
    this.userConfig = config;
  }

  async initialize(): Promise<void> {
    const root = await this.userConfig.getRoot();

    if (root === undefined || root === null) {
      throw new Error("Root must exist for course initialization");
    }

    // TODO: Allow for different course types
    const ResyncConfig = {
      STEM: Course,
    };

    const courseTypeHandles = this.userConfig.getCourseTypeHandles();

    const courses: Course[] = [];
    if (courseTypeHandles) {
      for (const [key, handle] of courseTypeHandles) {
        const courseConstructor = ResyncConfig[key];

        const loadedCourses =
          await this.collectAndInitializeCoursesForCourseType(
            handle,
            courseConstructor,
          );
        courses.push(...loadedCourses);
      }
    }

    this._courses = courses;
  }

  get courses(): Course[] {
    return this._courses;
  }

  set courses(courses: Course[]) {
    this._courses = courses;
  }

  async collectAndInitializeCoursesForCourseType<C extends Course>(
    courseTypeHandle: FileSystemDirectoryHandle,
    courseConstructor: new (...args: FileSystemDirectoryHandle[]) => C,
  ) {
    const courseFiles = await Array.fromAsync(courseTypeHandle.entries());
    const coursePromises = courseFiles.map(async ([_, courseFileHandle]) => {
      if (courseFileHandle.kind !== "directory") {
        return;
      }
      const course = new courseConstructor(courseFileHandle);
      await course.initialize();

      return course;
    });

    const courses = await Promise.all(coursePromises);
    return courses.filter((course) => course !== undefined);
  }
}
