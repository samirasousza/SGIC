import { api } from "../config/apiConfig";
import type { CourseModel } from "../models/projectModel";

const API_URL_COURSES = "/courses";

export const GetAllCourses = async (
  unitId?: string,
): Promise<CourseModel[]> => {
  return (await api.get<CourseModel[]>(API_URL_COURSES, { params: unitId }))
    .data;
};
