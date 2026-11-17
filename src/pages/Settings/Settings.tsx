import { useEffect, useMemo, useState } from "react";
import type { FormEvent } from "react";
import type {
  CourseModel,
  ImportProjectsModel,
  ImportResultModel,
  UnitModel,
} from "../../models/projectModel";
import type { CycleModel } from "../../models/cycleModel";
import {
  GetCycles,
  RegisterCycle,
  UpdateCycle,
} from "../../services/cyclesServices";
import {
  GetAllUnits,
  RegisterUnit,
  UpdateUnit,
} from "../../services/unitsService";
import {
  GetAllCourses,
  RegisterCourse,
  UpdateCourse,
} from "../../services/coursesService";
import { ImportProjects } from "../../services/projectService";
import { CatalogSection } from "../../components/Settings/CatalogSection";
import { CyclesSection } from "../../components/Settings/CyclesSection";
import { ImportProjectsSection } from "../../components/Settings/ImportProjectsSection";
import { SettingsFeedback } from "../../components/Settings/SettingsFeedback";
import { SettingsTabs } from "../../components/Settings/SettingsTabs";
import { EmailsSection } from "../../components/Settings/EmailsSection";
import { emptyCourse, emptyCycle, emptyUnit } from "../../types/settingsTypes";
import type {
  CourseFormModel,
  CycleFormModel,
  SettingsFeedback as Feedback,
  SettingsSection,
  UnitFormModel,
} from "../../types/settingsTypes";

function getErrorMessage(error: unknown): string {
  if (typeof error === "object" && error !== null && "response" in error) {
    const response = (
      error as { response?: { data?: { message?: string; detail?: string } } }
    ).response;
    return (
      response?.data?.message ||
      response?.data?.detail ||
      "Não foi possível concluir a operação."
    );
  }
  return error instanceof Error
    ? error.message
    : "Não foi possível concluir a operação.";
}

export function SettingsPage() {
  const [section, setSection] = useState<SettingsSection>("cycles");
  const [cycles, setCycles] = useState<CycleModel[]>([]);
  const [units, setUnits] = useState<UnitModel[]>([]);
  const [courses, setCourses] = useState<CourseModel[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [feedback, setFeedback] = useState<Feedback>(null);

  const [cycleForm, setCycleForm] = useState<CycleFormModel>(emptyCycle);
  const [editingCycleId, setEditingCycleId] = useState<string | null>(null);
  const [unitForm, setUnitForm] = useState<UnitFormModel>(emptyUnit);
  const [editingUnitId, setEditingUnitId] = useState<string | null>(null);
  const [courseForm, setCourseForm] = useState<CourseFormModel>(emptyCourse);
  const [editingCourseId, setEditingCourseId] = useState<string | null>(null);
  const [courseUnitFilter, setCourseUnitFilter] = useState("all");

  const [importJson, setImportJson] = useState("");
  const [importResult, setImportResult] = useState<ImportResultModel | null>(
    null,
  );

  const visibleCourses = useMemo(
    () =>
      courseUnitFilter === "all"
        ? courses
        : courses.filter((course) => course.unit.id === courseUnitFilter),
    [courses, courseUnitFilter],
  );

  async function loadSettings() {
    setLoading(true);
    try {
      const [cycleData, unitData, courseData] = await Promise.all([
        GetCycles(),
        GetAllUnits(),
        GetAllCourses(),
      ]);
      setCycles(cycleData);
      setUnits(unitData);
      setCourses(courseData);
    } catch (error) {
      setFeedback({ type: "error", message: getErrorMessage(error) });
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    let active = true;
    Promise.all([GetCycles(), GetAllUnits(), GetAllCourses()])
      .then(([cycleData, unitData, courseData]) => {
        if (!active) return;
        setCycles(cycleData);
        setUnits(unitData);
        setCourses(courseData);
      })
      .catch((error: unknown) => {
        if (active) {
          setFeedback({ type: "error", message: getErrorMessage(error) });
        }
      })
      .finally(() => {
        if (active) setLoading(false);
      });
    return () => {
      active = false;
    };
  }, []);

  async function handleCycleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setSaving(true);
    setFeedback(null);

    const dates = {
      partialReportDueDate: cycleForm.partialReportDueDate || null,
      finalReportDueDate: cycleForm.finalReportDueDate || null,
      closesOn: cycleForm.closesOn || null,
    };

    try {
      if (editingCycleId) {
        await UpdateCycle(editingCycleId, dates);
        setFeedback({
          type: "success",
          message:
            "Prazos do ciclo atualizados. Os relatórios vinculados ao ciclo também foram atualizados.",
        });
      } else {
        await RegisterCycle({ cycle: cycleForm.cycle.trim(), ...dates });
        setFeedback({
          type: "success",
          message: "Ciclo cadastrado com sucesso.",
        });
      }
      setCycleForm(emptyCycle);
      setEditingCycleId(null);
      setCycles(await GetCycles());
    } catch (error) {
      setFeedback({ type: "error", message: getErrorMessage(error) });
    } finally {
      setSaving(false);
    }
  }

  function editCycle(cycle: CycleModel) {
    setEditingCycleId(cycle.id);
    setCycleForm({
      cycle: cycle.cycle,
      partialReportDueDate: cycle.partialReportDueDate || "",
      finalReportDueDate: cycle.finalReportDueDate || "",
      closesOn: cycle.closesOn || "",
    });
    setFeedback(null);
  }

  async function handleUnitSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setSaving(true);
    setFeedback(null);
    try {
      if (editingUnitId) {
        await UpdateUnit(editingUnitId, unitForm);
        setFeedback({
          type: "success",
          message: "Unidade atualizada com sucesso.",
        });
      } else {
        await RegisterUnit(unitForm);
        setFeedback({
          type: "success",
          message: "Unidade cadastrada com sucesso.",
        });
      }
      setUnitForm(emptyUnit);
      setEditingUnitId(null);
      const [unitData, courseData] = await Promise.all([
        GetAllUnits(),
        GetAllCourses(),
      ]);
      setUnits(unitData);
      setCourses(courseData);
    } catch (error) {
      setFeedback({ type: "error", message: getErrorMessage(error) });
    } finally {
      setSaving(false);
    }
  }

  async function handleCourseSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setSaving(true);
    setFeedback(null);
    try {
      if (editingCourseId) {
        await UpdateCourse(editingCourseId, courseForm);
        setFeedback({
          type: "success",
          message: "Curso atualizado com sucesso.",
        });
      } else {
        await RegisterCourse(courseForm);
        setFeedback({
          type: "success",
          message: "Curso cadastrado com sucesso.",
        });
      }
      setCourseForm(emptyCourse);
      setEditingCourseId(null);
      setCourses(await GetAllCourses());
    } catch (error) {
      setFeedback({ type: "error", message: getErrorMessage(error) });
    } finally {
      setSaving(false);
    }
  }

  async function handleImport(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setSaving(true);
    setFeedback(null);
    setImportResult(null);
    try {
      const parsed = JSON.parse(importJson) as ImportProjectsModel;
      if (
        !parsed ||
        !Array.isArray(parsed.projects) ||
        parsed.projects.length === 0
      ) {
        throw new Error(
          'O JSON deve conter a propriedade "projects" com pelo menos um projeto.',
        );
      }
      const result = await ImportProjects(parsed);
      setImportResult(result);
      setImportJson("");
      setFeedback({
        type: "success",
        message:
          "Importação concluída. Guarde as senhas temporárias exibidas abaixo; elas não serão exibidas novamente.",
      });
    } catch (error) {
      setFeedback({
        type: "error",
        message:
          error instanceof SyntaxError
            ? "JSON inválido. Verifique a estrutura e as vírgulas do arquivo."
            : getErrorMessage(error),
      });
    } finally {
      setSaving(false);
    }
  }

  function handleImportFile(file?: File) {
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => setImportJson(String(reader.result || ""));
    reader.onerror = () =>
      setFeedback({
        type: "error",
        message: "Não foi possível ler o arquivo selecionado.",
      });
    reader.readAsText(file);
  }

  function cancelCycleEdit() {
    setEditingCycleId(null);
    setCycleForm(emptyCycle);
  }

  function cancelUnitEdit() {
    setEditingUnitId(null);
    setUnitForm(emptyUnit);
  }

  function cancelCourseEdit() {
    setEditingCourseId(null);
    setCourseForm(emptyCourse);
  }

  function handleSectionChange(nextSection: SettingsSection) {
    setSection(nextSection);
    setFeedback(null);
  }

  return (
    <div className="space-y-6">
      <header>
        <h1 className="mt-1 text-2xl font-bold text-gray-900">Configurações</h1>
        <p className="mt-1 text-sm text-gray-500">
          Gerencie ciclos acadêmicos, unidades, cursos, importações do SISPROJ e
          o histórico de e-mails.
        </p>
      </header>

      <SettingsTabs section={section} onChange={handleSectionChange} />
      <SettingsFeedback feedback={feedback} />

      {loading ? (
        <div className="rounded-xl border border-gray-200 bg-white p-8 text-center text-sm text-gray-500">
          Carregando configurações...
        </div>
      ) : (
        <>
          {section === "cycles" && (
            <CyclesSection
              cycles={cycles}
              cycleForm={cycleForm}
              editingCycleId={editingCycleId}
              saving={saving}
              onCycleFormChange={setCycleForm}
              onSubmit={handleCycleSubmit}
              onCancel={cancelCycleEdit}
              onEdit={editCycle}
              onRefresh={() => void loadSettings()}
            />
          )}

          {section === "catalog" && (
            <CatalogSection
              units={units}
              courses={courses}
              visibleCourses={visibleCourses}
              unitForm={unitForm}
              editingUnitId={editingUnitId}
              courseForm={courseForm}
              editingCourseId={editingCourseId}
              courseUnitFilter={courseUnitFilter}
              saving={saving}
              onUnitFormChange={setUnitForm}
              onCourseFormChange={setCourseForm}
              onCourseUnitFilterChange={setCourseUnitFilter}
              onUnitSubmit={handleUnitSubmit}
              onCourseSubmit={handleCourseSubmit}
              onEditUnit={(unit) => {
                setEditingUnitId(unit.id);
                setUnitForm({ name: unit.name, acronym: unit.acronym });
                setFeedback(null);
              }}
              onEditCourse={(course) => {
                setEditingCourseId(course.id);
                setCourseForm({
                  name: course.name,
                  unitId: course.unit.id,
                });
                setFeedback(null);
              }}
              onCancelUnit={cancelUnitEdit}
              onCancelCourse={cancelCourseEdit}
            />
          )}

          {section === "import" && (
            <ImportProjectsSection
              importJson={importJson}
              importResult={importResult}
              saving={saving}
              onJsonChange={setImportJson}
              onFileSelect={handleImportFile}
              onSubmit={handleImport}
            />
          )}

          {section === "emails" && <EmailsSection />}
        </>
      )}
    </div>
  );
}
