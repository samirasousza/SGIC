import type { CycleModel } from "../../models/cycleModel";
import type {
  CourseModel,
  ImportResultModel,
  UnitModel,
} from "../../models/projectModel";

export type SettingsSection = "cycles" | "catalog" | "import";
export type SettingsFeedback =
  | { type: "success" | "error"; message: string }
  | null;

export type CycleFormModel = {
  cycle: string;
  partialReportDueDate: string;
  finalReportDueDate: string;
  closesOn: string;
};

export type UnitFormModel = {
  name: string;
  acronym: string;
};

export type CourseFormModel = {
  name: string;
  unitId: string;
};

export const emptyCycle: CycleFormModel = {
  cycle: "",
  partialReportDueDate: "",
  finalReportDueDate: "",
  closesOn: "",
};

export const emptyUnit: UnitFormModel = { name: "", acronym: "" };
export const emptyCourse: CourseFormModel = { name: "", unitId: "" };

export type CyclesSectionProps = {
  cycles: CycleModel[];
  cycleForm: CycleFormModel;
  editingCycleId: string | null;
  saving: boolean;
  onCycleFormChange: (value: CycleFormModel) => void;
  onSubmit: (event: React.FormEvent<HTMLFormElement>) => void;
  onCancel: () => void;
  onEdit: (cycle: CycleModel) => void;
  onRefresh: () => void;
};

export type CatalogSectionProps = {
  units: UnitModel[];
  courses: CourseModel[];
  visibleCourses: CourseModel[];
  unitForm: UnitFormModel;
  editingUnitId: string | null;
  courseForm: CourseFormModel;
  editingCourseId: string | null;
  courseUnitFilter: string;
  saving: boolean;
  onUnitFormChange: (value: UnitFormModel) => void;
  onCourseFormChange: (value: CourseFormModel) => void;
  onCourseUnitFilterChange: (value: string) => void;
  onUnitSubmit: (event: React.FormEvent<HTMLFormElement>) => void;
  onCourseSubmit: (event: React.FormEvent<HTMLFormElement>) => void;
  onEditUnit: (unit: UnitModel) => void;
  onEditCourse: (course: CourseModel) => void;
  onCancelUnit: () => void;
  onCancelCourse: () => void;
};

export type ImportProjectsSectionProps = {
  importJson: string;
  importResult: ImportResultModel | null;
  saving: boolean;
  onJsonChange: (value: string) => void;
  onFileSelect: (file?: File) => void;
  onSubmit: (event: React.FormEvent<HTMLFormElement>) => void;
};
