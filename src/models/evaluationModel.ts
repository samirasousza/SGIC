import type { DefenseType } from "../types/defenseType";
import type {
  EvaluationItemCode,
  EvaluationState,
  FormType,
  ItemScale,
} from "../types/evaluationType";
import type { BoardMemberType } from "../types/boardMemberType";
import type {
  ProjectModel,
  ProjectPersonModel,
  UnitModel,
  CourseModel,
} from "./projectModel";
import type { ProjectProgram } from "../types/projectProgram";
import type { ScholarshipType } from "../types/scholarshipType";

export interface EvaluationFormModel {
  id: string | null;
  projectId: string;
  defenseType: DefenseType;
  formType: FormType;
  memberType: BoardMemberType | null;
  author: ProjectPersonModel;
  state: EvaluationState;
  blockedReason: string | null;
  editable: boolean;
  header: {
    sisprojNumber: string;
    projectTitle: string;
    noticeNumber: string | null;
    program: ProjectProgram;
    scholarshipType: ScholarshipType | null;
    unit: UnitModel;
    studentName: string | null;
    studentEmail: string | null;
    studentPhone: string | null;
    studentCpf: string | null;
    studentHasDegree: boolean | null;
    studentPcd: boolean | null;
    advisorName: string | null;
    advisorEmail: string | null;
    advisorPhone: string | null;
    advisorCpf: string | null;
  };
  presentationTime: string | null;
  items: EvaluationItemModel[];
  comments: string | null;
  score: number | null;
  savedAt: string | null;
  signedAt: string | null;
  signedPlace: string | null;
}

export interface EvaluationItemModel {
  code: EvaluationItemCode;
  section: string;
  label: string;
  scale: ItemScale;
  allowedValues: number[];
  allowsNotApplicable: boolean;
  score: number | null;
  notApplicable: boolean;
}

export interface SaveEvaluationModel {
  presentationTime?: string | null;
  items?: Array<{
    code: EvaluationItemCode;
    score: number | null;
    notApplicable: boolean;
  }>;
  comments?: string | null;
}

export interface SignEvaluationModel {
  signature: string;
}

export interface ProjectEvaluationsModel {
  projectId: string;
  defenses: Array<{
    defenseType: DefenseType;
    blockedReason: string | null;
    forms: Array<{
      evaluationId: string | null;
      formType: FormType;
      memberType: BoardMemberType | null;
      author: ProjectPersonModel | null;
      state: EvaluationState;
      score: number | null;
      signedAt: string | null;
      mine: boolean;
      canOpen: boolean;
      canReopen: boolean;
    }>;
  }>;
}

export interface EvaluationPanelModel {
  rows: Array<{
    project: ProjectModel;
    defenses: Array<{
      defenseType: DefenseType;
      student: EvaluationState | null;
      evaluator1: EvaluationState | null;
      evaluator2: EvaluationState | null;
      advisor: EvaluationState | null;
    }>;
  }>;
}

export interface FinalGradesModel {
  cycle: string;
  rows: Array<{
    projectId: string;
    sisprojNumber: string;
    projectTitle: string;
    student: ProjectPersonModel;
    advisor: ProjectPersonModel;
    course: CourseModel | null;
    advisorScore: number | null;
    externalEvaluator: ProjectPersonModel | null;
    externalScore: number | null;
    internalEvaluator: ProjectPersonModel | null;
    internalScore: number | null;
    studentScore: number | null;
    finalAverage: number | null;
    provisional: boolean;
    honorableMention: boolean;
  }>;
  mentions: Array<{
    course: CourseModel;
    projectId: string | null;
    studentName: string | null;
    finalAverage: number | null;
    tie: boolean;
    pendingForms: boolean;
    manual: boolean;
    justification: string | null;
  }>;
}

export interface SetHonorableMentionModel {
  cycle: string;
  courseId: string;
  projectId: string;
  justification: string;
}

export interface JustificationModel {
  justification: string;
}
