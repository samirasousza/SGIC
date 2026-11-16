import { api } from "../config/apiConfig";
import type { CourseModel, CourseRequestModel } from "../models/courseModel";

const API_URL_COURSES = "/courses";

export const GetAllCourses = async (
  unitId?: string,
): Promise<CourseModel[]> => {
  return (
    await api.get<CourseModel[]>(API_URL_COURSES, {
      params: unitId ? { unitId } : undefined,
    })
  ).data;
};

export const RegisterCourse = async (
  data: CourseRequestModel,
): Promise<CourseModel> =>
  (await api.post<CourseModel>(API_URL_COURSES, data)).data;

export const UpdateCourse = async (
  id: string,
  data: CourseRequestModel,
): Promise<CourseModel> =>
  (await api.put<CourseModel>(`${API_URL_COURSES}/${id}`, data)).data;
