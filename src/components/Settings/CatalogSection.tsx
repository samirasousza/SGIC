import { Button } from "../Button";
import { SettingsField } from "./SettingsField";
import type {
  CatalogSectionProps,
} from "./settingsTypes";

export function CatalogSection({
  units,
  visibleCourses,
  unitForm,
  editingUnitId,
  courseForm,
  editingCourseId,
  courseUnitFilter,
  saving,
  onUnitFormChange,
  onCourseFormChange,
  onCourseUnitFilterChange,
  onUnitSubmit,
  onCourseSubmit,
  onEditUnit,
  onEditCourse,
  onCancelUnit,
  onCancelCourse,
}: CatalogSectionProps) {
  return (
    <div className="space-y-6">
      <div className="grid gap-6 xl:grid-cols-2">
        <section className="rounded-xl border border-gray-200 bg-white p-5 sm:p-6">
          <h2 className="font-semibold text-gray-900">
            {editingUnitId
              ? "Editar unidade acadêmica"
              : "Cadastrar unidade acadêmica"}
          </h2>
          <p className="mt-1 text-sm text-gray-500">
            A sigla será armazenada em letras maiúsculas.
          </p>
          <form onSubmit={onUnitSubmit} className="mt-5 space-y-4">
            <SettingsField
              label="Nome da unidade"
              value={unitForm.name}
              onChange={(value) =>
                onUnitFormChange({ ...unitForm, name: value })
              }
              placeholder="Escola Superior de Tecnologia"
              required
            />
            <SettingsField
              label="Sigla"
              value={unitForm.acronym}
              onChange={(value) =>
                onUnitFormChange({
                  ...unitForm,
                  acronym: value.toUpperCase(),
                })
              }
              placeholder="EST"
              required
            />
            <div className="flex flex-wrap gap-2">
              <Button type="submit" disabled={saving}>
                {saving
                  ? "Salvando..."
                  : editingUnitId
                    ? "Salvar unidade"
                    : "Cadastrar unidade"}
              </Button>
              {editingUnitId && (
                <Button
                  type="button"
                  variant="secondary"
                  onClick={onCancelUnit}
                >
                  Cancelar
                </Button>
              )}
            </div>
          </form>
        </section>

        <section className="rounded-xl border border-gray-200 bg-white p-5 sm:p-6">
          <h2 className="font-semibold text-gray-900">
            {editingCourseId ? "Editar curso" : "Cadastrar curso"}
          </h2>
          <p className="mt-1 text-sm text-gray-500">
            Todo curso deve estar vinculado a uma unidade acadêmica.
          </p>
          <form onSubmit={onCourseSubmit} className="mt-5 space-y-4">
            <SettingsField
              label="Nome do curso"
              value={courseForm.name}
              onChange={(value) =>
                onCourseFormChange({ ...courseForm, name: value })
              }
              placeholder="Engenharia da Computação"
              required
            />
            <label className="block space-y-1.5">
              <span className="text-sm font-medium text-gray-700">
                Unidade acadêmica
              </span>
              <select
                required
                value={courseForm.unitId}
                onChange={(event) =>
                  onCourseFormChange({
                    ...courseForm,
                    unitId: event.target.value,
                  })
                }
                className="w-full cursor-pointer rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm text-gray-900 outline-none focus:border-blue-600 focus:ring-2 focus:ring-blue-100"
              >
                <option value="">Selecione uma unidade</option>
                {units.map((unit) => (
                  <option key={unit.id} value={unit.id}>
                    {unit.acronym} — {unit.name}
                  </option>
                ))}
              </select>
            </label>
            <div className="flex flex-wrap gap-2">
              <Button
                type="submit"
                disabled={saving || units.length === 0}
              >
                {saving
                  ? "Salvando..."
                  : editingCourseId
                    ? "Salvar curso"
                    : "Cadastrar curso"}
              </Button>
              {editingCourseId && (
                <Button
                  type="button"
                  variant="secondary"
                  onClick={onCancelCourse}
                >
                  Cancelar
                </Button>
              )}
            </div>
          </form>
        </section>
      </div>

      <div className="grid gap-6 xl:grid-cols-2">
        <section className="rounded-xl border border-gray-200 bg-white p-5 sm:p-6">
          <div className="mb-4 flex items-center justify-between gap-3">
            <h2 className="font-semibold text-gray-900">
              Unidades acadêmicas
            </h2>
            <span className="text-xs text-gray-500">
              {units.length} cadastrada(s)
            </span>
          </div>
          <div className="divide-y divide-gray-100">
            {units.map((unit) => (
              <div
                key={unit.id}
                className="flex items-center justify-between gap-3 py-3"
              >
                <div className="min-w-0">
                  <p className="truncate text-sm font-medium text-gray-900">
                    {unit.name}
                  </p>
                  <p className="mt-0.5 text-xs text-gray-500">
                    {unit.acronym}
                  </p>
                </div>
                <Button
                  variant="table"
                  className="shrink-0"
                  onClick={() => onEditUnit(unit)}
                >
                  Editar
                </Button>
              </div>
            ))}
            {units.length === 0 && (
              <p className="py-4 text-sm text-gray-500">
                Nenhuma unidade cadastrada.
              </p>
            )}
          </div>
        </section>

        <section className="rounded-xl border border-gray-200 bg-white p-5 sm:p-6">
          <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
            <h2 className="font-semibold text-gray-900">Cursos cadastrados</h2>
            <select
              value={courseUnitFilter}
              onChange={(event) =>
                onCourseUnitFilterChange(event.target.value)
              }
              className="cursor-pointer rounded-lg border border-gray-300 bg-white px-2.5 py-1.5 text-xs text-gray-700"
            >
              <option value="all">Todas as unidades</option>
              {units.map((unit) => (
                <option key={unit.id} value={unit.id}>
                  {unit.acronym}
                </option>
              ))}
            </select>
          </div>
          <div className="divide-y divide-gray-100">
            {visibleCourses.map((course) => (
              <div
                key={course.id}
                className="flex items-center justify-between gap-3 py-3"
              >
                <div className="min-w-0">
                  <p className="truncate text-sm font-medium text-gray-900">
                    {course.name}
                  </p>
                  <p className="mt-0.5 text-xs text-gray-500">
                    {course.unit.acronym} — {course.unit.name}
                  </p>
                </div>
                <Button
                  variant="table"
                  className="shrink-0"
                  onClick={() => onEditCourse(course)}
                >
                  Editar
                </Button>
              </div>
            ))}
            {visibleCourses.length === 0 && (
              <p className="py-4 text-sm text-gray-500">
                Nenhum curso encontrado.
              </p>
            )}
          </div>
        </section>
      </div>
    </div>
  );
}
