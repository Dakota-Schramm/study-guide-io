import { openDB } from "idb";

import { FullAccessUserConfig } from "@/classes/config/user/full-access";
import { RestrictedAccessUserConfig } from "../config/user/restricted-access";
import { FullAccessBaseCourse, FullAccessSTEMCourse } from "./full-access";
import { RestrictedSTEMCourse } from "./restricted-access";
import { BaseCourse } from "./abstract";

export class CourseFactory {
  private userConfig: FullAccessUserConfig | RestrictedAccessUserConfig;
  private _courses: string[] = [];

  constructor(config: FullAccessUserConfig | RestrictedAccessUserConfig) {
    this.userConfig = config;
  }

  async initialize(root?: FileSystemDirectoryHandle): Promise<void> {
    let courses: BaseCourse[] = [];
    if (this.userConfig instanceof FullAccessUserConfig) {
      courses = await this.initializeFullAccessCourses(root);
    } else if (this.userConfig instanceof RestrictedAccessUserConfig) {
      courses = await this.initializeRestrictedAccessCourses();
    }

    this._courses = courses;
  }

  get courses(): string[] {
    return this._courses;
  }

  set courses(courses: string[]) {
    this._courses = courses;
  }

  async initializeFullAccessCourses(root?: FileSystemDirectoryHandle) {
    if (root === undefined) {
      throw new Error("Root directory handle must be passed to this function");
    }

    const ResyncConfig = {
      STEM: FullAccessSTEMCourse,
    };

    const courseTypeHandles = this.userConfig.getCourseTypeHandles();

    const courses: FullAccessBaseCourse[] = [];
    if (courseTypeHandles) {
      for (const [key, handle] of courseTypeHandles) {
        const courseConstructor = ResyncConfig[key];

        const loadedCourses =
          await this.collectAndInitializeCoursesForCourseType(
            root,
            handle,
            courseConstructor,
          );
        courses.push(...loadedCourses);
      }
    }

    return courses;
  }

  async collectAndInitializeCoursesForCourseType<
    C extends FullAccessBaseCourse,
  >(
    root: FileSystemDirectoryHandle,
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

  async initializeRestrictedAccessCourses() {
    const CourseConstructors = {
      STEM: RestrictedSTEMCourse,
    };

    const idb = await openDB("courses");

    const courses = [];

    for (const objectStoreName of idb.objectStoreNames) {
      // const courseType = await idb.get(objectStoreName, "type");

      const courseConstructor = CourseConstructors.STEM;
      const course = new courseConstructor(objectStoreName);
      await course.initialize();
      courses.push(course);
    }

    return courses;
  }
}
