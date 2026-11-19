import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";

import { Badge } from "../../components/Badge";
import { Breadcrumbs } from "../../components/Breadcrumbs";
import { Card } from "../../components/Card";
import { Icon } from "../../components/Icon";
import { ListPagination } from "../../components/ListPagination";
import { PageHeader } from "../../components/PageHeader";
import { useAppContext } from "../../contexts/appContext";
import { GetProjectFilterOptions } from "../../services/projectService";
import { GetReportsPanel } from "../../services/reportsService";
import type { CourseModel } from "../../models/projectModel";
import type { ReportCell } from "../../types/reportType";
import type { ReportPanelModel } from "../../models/reportModel";

const cellLabels: Record<ReportCell, string> = {
  APPROVED: "Aprovado",
  IN_REVIEW: "Em revisão",
  CHANGES_REQUESTED: "Em ajuste",
  LATE: "Atrasado",
  NOT_DUE: "Prazo não iniciado",
};

const reportColumns = [
  ...Array.from({ length: 6 }, (_, index) => ({
    label: `M${index + 1}`,
    type: "MONTHLY" as const,
    month: index + 1,
  })),
  { label: "Parcial", type: "PARTIAL" as const, month: null },
  ...Array.from({ length: 6 }, (_, index) => ({
    label: `M${index + 7}`,
    type: "MONTHLY" as const,
    month: index + 7,
  })),
  { label: "Final", type: "FINAL" as const, month: null },
];

export function ReportsPage() {
  const navigate = useNavigate();
  const { cycle, cyclesLoading } = useAppContext();

  const [query, setQuery] = useState("");
  const [courseId, setCourseId] = useState("all");
  const [sort, setSort] = useState<"az" | "za">("az");
  const [page, setPage] = useState(1);
  const [rows, setRows] = useState<ReportPanelModel["rows"]>([]);
  const [courses, setCourses] = useState<CourseModel[]>([]);
  const [pendingMyReview, setPendingMyReview] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let active = true;

    GetProjectFilterOptions()
      .then((data) => {
        if (active) setCourses(data.studentCourses ?? []);
      })
      .catch(() => {
        if (active) setCourses([]);
      });

    return () => {
      active = false;
    };
  }, []);

  useEffect(() => {
    if (cyclesLoading) return;
    let active = true;

    Promise.resolve()
      .then(() => {
        if (!active) return null;
        setLoading(true);
        setError("");

        return GetReportsPanel({
          ...(cycle && cycle !== "all" ? { cycle } : {}),
          ...(query.trim() ? { q: query.trim() } : {}),
          ...(courseId !== "all" ? { studentCourseId: courseId } : {}),
          sort: "TITLE",
          direction: sort === "az" ? "ASC" : "DESC",
        });
      })
      .then((data) => {
        if (!active || !data) return;
        setRows(data.rows);
        setPendingMyReview(data.pendingMyReview);
        setPage(1);
      })
      .catch(() => {
        if (!active) return;
        setRows([]);
        setPendingMyReview(0);
        setError("Não foi possível carregar os relatórios dos projetos.");
      })
      .finally(() => {
        if (active) setLoading(false);
      });

    return () => {
      active = false;
    };
  }, [cycle, query, courseId, sort, cyclesLoading]);

  const visibleRows = useMemo(() => rows, [rows]);
  const pageSize = 10;
  const pageRows = visibleRows.slice((page - 1) * pageSize, page * pageSize);

  function cellFor(
    row: ReportPanelModel["rows"][number],
    column: (typeof reportColumns)[number],
  ): ReportCell | null {
    return (
      row.cells.find(
        (cell) =>
          cell.type === column.type &&
          (column.type !== "MONTHLY" || cell.referenceMonth === column.month),
      )?.cell ?? null
    );
  }

  return (
    <>
      <Breadcrumbs
        items={[
          { label: "Início", onClick: () => navigate("/") },
          { label: "Relatórios" },
        ]}
      />

      <PageHeader title="Relatórios por projeto" />

      {pendingMyReview > 0 && (
        <div className="mb-5 rounded-xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-900">
          Você tem <strong>{pendingMyReview}</strong> relatório(s) aguardando
          sua revisão.
        </div>
      )}

      <div className="grid grid-cols-1 gap-3 md:grid-cols-2 xl:grid-cols-4">
        <div className="relative">
          <div className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-slate-400">
            <Icon name="search" size={18} />
          </div>
          <input
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="Buscar por projeto ou aluno"
            className="h-10 w-full rounded-lg border border-slate-200 bg-white pl-10 pr-3 text-sm outline-none focus:border-indigo-400 focus:ring-2 focus:ring-indigo-100"
          />
        </div>

        <select
          value={courseId}
          onChange={(event) => setCourseId(event.target.value)}
          className="h-10 rounded-lg border border-slate-200 bg-white px-3 text-sm text-slate-700 outline-none focus:border-indigo-400"
        >
          <option value="all">Todos os cursos</option>
          {courses.map((course) => (
            <option key={course.id} value={course.id}>
              {course.name}
            </option>
          ))}
        </select>

        <select
          value={sort}
          onChange={(event) => setSort(event.target.value as "az" | "za")}
          className="h-10 rounded-lg border border-slate-200 bg-white px-3 text-sm text-slate-700 outline-none focus:border-indigo-400"
        >
          <option value="az">Projeto: A–Z</option>
          <option value="za">Projeto: Z–A</option>
        </select>
      </div>

      <div className="flex flex-wrap items-center gap-3 py-6">
        <strong className="text-sm text-slate-700">Legenda:</strong>
        <Badge tone="success">Aprovado</Badge>
        <Badge tone="warning">Em revisão</Badge>
        <Badge tone="orange">Em ajuste</Badge>
        <Badge tone="danger">Atrasado</Badge>
        <Badge>Prazo não iniciado</Badge>
      </div>

      <Card>
        {error && (
          <p className="px-4 py-3 text-sm text-red-600" role="alert">
            {error}
          </p>
        )}

        <div className="overflow-x-auto">
          <table className="w-full min-w-[1050px] text-left text-sm">
            <thead className="border-b border-slate-200 bg-slate-50 text-xs uppercase text-slate-500">
              <tr>
                <th className="sticky left-0 bg-slate-50 px-4 py-3">
                  Projeto / aluno
                </th>
                {reportColumns.map((column) => (
                  <th key={column.label} className="px-3 py-3 text-center">
                    {column.label}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {loading ? (
                <tr>
                  <td
                    colSpan={15}
                    className="px-4 py-10 text-center text-sm text-slate-500"
                  >
                    Carregando relatórios...
                  </td>
                </tr>
              ) : (
                pageRows.map((row) => (
                  <tr
                    key={row.project.id}
                    onClick={() =>
                      navigate(`/projects/${row.project.id}/reports`)
                    }
                    className="cursor-pointer transition hover:bg-indigo-50/50"
                  >
                    <td className="sticky left-0 bg-white px-4 py-4">
                      <strong className="block max-w-[320px] truncate font-medium text-slate-800">
                        {row.project.title}
                      </strong>
                      <small className="mt-1 block text-xs text-slate-500">
                        {row.project.student.name}
                        {row.project.studentCourse
                          ? ` • ${row.project.studentCourse}`
                          : ""}
                      </small>
                    </td>
                    {reportColumns.map((column) => {
                      const cell = cellFor(row, column);
                      return (
                        <td
                          key={column.label}
                          className="px-3 py-4 text-center"
                        >
                          {cell ? (
                            <span
                              className={`inline-block h-3 w-3 rounded-full ${
                                cell === "APPROVED"
                                  ? "bg-emerald-500"
                                  : cell === "IN_REVIEW"
                                    ? "bg-amber-400"
                                    : cell === "CHANGES_REQUESTED"
                                      ? "bg-orange-500"
                                      : cell === "LATE"
                                        ? "bg-red-500"
                                        : "bg-slate-200"
                              }`}
                              title={cellLabels[cell]}
                              aria-label={cellLabels[cell]}
                            />
                          ) : (
                            <span className="text-slate-300">—</span>
                          )}
                        </td>
                      );
                    })}
                  </tr>
                ))
              )}
              {!loading && pageRows.length === 0 && (
                <tr>
                  <td
                    colSpan={15}
                    className="px-4 py-10 text-center text-sm text-slate-500"
                  >
                    Nenhum projeto encontrado com os filtros selecionados.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        <ListPagination
          page={page}
          total={visibleRows.length}
          label="projetos"
          onPageChange={setPage}
        />
      </Card>
    </>
  );
}
