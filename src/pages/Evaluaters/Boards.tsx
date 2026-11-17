import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";

import { Badge } from "../../components/Badge";
import { Card } from "../../components/Card";
import { Icon } from "../../components/Icon";
import { PageHeader } from "../../components/PageHeader";
import { Breadcrumbs } from "../../components/Breadcrumbs";
import { ListPagination } from "../../components/ListPagination";
import type {
  BoardPanelModel,
  BoardPanelSlotModel,
} from "../../models/projectBoardModel";
import type { CourseModel } from "../../models/projectModel";
import { GetBoardsPanel } from "../../services/boardService";
import { GetAllCourses } from "../../services/coursesService";
import type { DefenseType } from "../../types/defenseType";
import { useAppContext } from "../../contexts/appContext";

type PanelRow = BoardPanelModel["rows"][number];
const PAGE_SIZE = 10;

function formatDefenseDate(date: string | null, time: string | null) {
  if (!date) return "Sem data";
  const [year, month, day] = date.split("-");
  return `${day}/${month}/${year}${time ? ` às ${time.slice(0, 5)}` : ""}`;
}

function BoardSlotBadge({ slot }: { slot?: BoardPanelSlotModel }) {
  if (!slot || slot.state === "EMPTY") {
    return (
      <Badge tone="neutral">
        <Icon name="minus" size={13} /> Não preenchido
      </Badge>
    );
  }

  const filled = slot.state === "FILLED";

  return (
    <div>
      <Badge tone={filled ? "success" : "warning"}>
        <Icon name={filled ? "check" : "clock"} size={13} />{" "}
        {filled ? "Preenchido" : "Aguardando cadastro"}
      </Badge>
      {slot.name && (
        <small className="mt-1 block text-xs text-slate-500">{slot.name}</small>
      )}
    </div>
  );
}

export function BoardsPage() {
  const navigate = useNavigate();
  const [stage, setStage] = useState<DefenseType>("PARTIAL");
  const [query, setQuery] = useState("");
  const [courseId, setCourseId] = useState("all");
  const [page, setPage] = useState(1);
  const [rows, setRows] = useState<PanelRow[]>([]);
  const [courses, setCourses] = useState<CourseModel[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const { cycle, cyclesLoading } = useAppContext();

  useEffect(() => {
    let active = true;
    GetAllCourses()
      .then((data) => {
        if (active) setCourses(data);
      })
      .catch(() => {
        if (active) setCourses([]);
      });
    return () => {
      active = false;
    };
  }, []);

  useEffect(() => {
    if (cyclesLoading || !cycle) return;
    let active = true;

    Promise.resolve()
      .then(() => {
        if (!active) return null;

        setLoading(true);
        setError("");

        return GetBoardsPanel({
          ...(cycle && cycle !== "Todos os ciclos" ? { cycle } : {}),
          ...(query.trim() ? { q: query.trim() } : {}),
          ...(courseId !== "all" ? { studentCourseId: courseId } : {}),
        });
      })
      .then((data) => {
        if (!active || !data) return;

        setRows(data.rows);
        setPage(1);
      })
      .catch(() => {
        if (active) {
          setRows([]);
          setError("Não foi possível carregar o painel de bancas.");
        }
      })
      .finally(() => {
        if (active) setLoading(false);
      });

    return () => {
      active = false;
    };
  }, [cycle, cyclesLoading, query, courseId]);

  const visibleRows = useMemo(
    () => rows.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE),
    [rows, page],
  );

  return (
    <>
      <Breadcrumbs
        items={[
          { label: "Início", onClick: () => navigate("/") },
          { label: "Bancas" },
        ]}
      />
      <PageHeader title="Bancas por defesa" />

      <div className="mb-6 grid grid-cols-1 gap-3 sm:grid-cols-2">
        {(["PARTIAL", "FINAL"] as DefenseType[]).map((type, index) => (
          <button
            key={type}
            type="button"
            onClick={() => setStage(type)}
            className={`flex cursor-pointer items-center gap-4 rounded-xl border p-4 text-left transition ${stage === type ? "border-indigo-300 bg-indigo-50 ring-1 ring-indigo-100" : "border-slate-200 bg-white hover:border-slate-300"}`}
          >
            <span
              className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-full text-sm font-semibold ${stage === type ? "bg-indigo-600 text-white" : "bg-slate-100 text-slate-500"}`}
            >
              0{index + 1}
            </span>
            <span>
              <strong className="block text-sm font-semibold text-slate-800">
                Defesa {type === "PARTIAL" ? "parcial" : "final"}
              </strong>
              <small className="mt-1 block text-xs text-slate-500">
                Avaliadores indicados para a banca
              </small>
            </span>
          </button>
        ))}
      </div>

      <div className="mb-5 grid grid-cols-1 gap-3 md:grid-cols-2">
        <label className="relative block">
          <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400">
            <Icon name="search" size={18} />
          </span>
          <input
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="Buscar projeto, aluno ou SISPROJ"
            className="h-10 w-full rounded-lg border border-slate-200 bg-white pl-10 pr-3 text-sm outline-none transition focus:border-indigo-400 focus:ring-2 focus:ring-indigo-100"
          />
        </label>
        <select
          value={courseId}
          onChange={(event) => setCourseId(event.target.value)}
          className="h-10 rounded-lg border border-slate-200 bg-white px-3 text-sm text-slate-700 outline-none transition focus:border-indigo-400 focus:ring-2 focus:ring-indigo-100"
        >
          <option value="all">Todos os cursos</option>
          {courses.map((course) => (
            <option key={course.id} value={course.id}>
              {course.name}
            </option>
          ))}
        </select>
      </div>

      <div className="mb-5 flex flex-wrap items-center gap-3">
        <strong className="text-sm text-slate-700">Legenda:</strong>
        <Badge tone="success">Preenchido</Badge>
        <Badge tone="warning">Aguardando cadastro</Badge>
        <Badge>Não preenchido</Badge>
      </div>

      <Card>
        <div className="border-b border-slate-100 px-5 py-4">
          <h2 className="text-base font-semibold text-slate-800">
            {rows.length} projetos
          </h2>
          <p className="mt-1 text-sm text-slate-500">
            Selecione um projeto para consultar a banca e o agendamento da
            defesa.
          </p>
        </div>

        {loading ? (
          <div className="px-5 py-12 text-center text-sm text-slate-500">
            Carregando bancas...
          </div>
        ) : error ? (
          <div className="px-5 py-12 text-center text-sm text-red-600">
            {error}
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full min-w-[850px] text-left text-sm">
              <thead className="border-b border-slate-200 bg-slate-50 text-xs uppercase text-slate-500">
                <tr>
                  <th className="px-4 py-3">Projeto / aluno</th>
                  <th className="px-4 py-3">Orientador</th>
                  <th className="px-4 py-3">Defesa</th>
                  <th className="px-4 py-3">Av. interno</th>
                  <th className="px-4 py-3">Av. externo</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {visibleRows.map((row) => {
                  const defense = row.defenses.find(
                    (item) => item.defenseType === stage,
                  );
                  return (
                    <tr
                      key={row.project.id}
                      onClick={() =>
                        navigate(`/projects/${row.project.id}/evaluators`)
                      }
                      className="cursor-pointer transition hover:bg-indigo-50/50"
                    >
                      <td className="px-4 py-4">
                        <strong className="block font-medium text-slate-800">
                          {row.project.title}
                        </strong>
                        <small className="mt-1 block text-xs text-slate-500">
                          {row.project.student.name} •{" "}
                          {row.project.studentCourse ?? "Curso não informado"}
                        </small>
                      </td>
                      <td className="px-4 py-4 text-slate-700">
                        {row.project.advisor.name}
                      </td>
                      <td className="px-4 py-4 text-slate-600">
                        {formatDefenseDate(
                          defense?.defenseDate ?? null,
                          defense?.defenseTime ?? null,
                        )}
                      </td>
                      <td className="px-4 py-4">
                        <BoardSlotBadge slot={defense?.internal} />
                      </td>
                      <td className="px-4 py-4">
                        <BoardSlotBadge slot={defense?.external} />
                      </td>
                    </tr>
                  );
                })}
                {rows.length === 0 && (
                  <tr>
                    <td
                      colSpan={5}
                      className="px-4 py-10 text-center text-sm text-slate-500"
                    >
                      Nenhum projeto encontrado com os filtros selecionados.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        )}
        {!loading && !error && rows.length > PAGE_SIZE && (
          <ListPagination
            page={page}
            total={rows.length}
            label="projetos"
            onPageChange={setPage}
          />
        )}
      </Card>
    </>
  );
}
