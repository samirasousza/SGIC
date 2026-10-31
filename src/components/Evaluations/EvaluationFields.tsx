import type { Role } from "../../pages/Login/LoginTypes";
import { isAdvisorRole } from "../../pages/Projects/Projects.utils";
import { ScoreField } from "./ScoreField";

const fieldClass =
  "flex flex-col gap-2 text-sm font-medium text-slate-700";

const inputClass =
  "w-full rounded-lg border border-slate-200 bg-white px-3 py-2.5 text-sm font-normal text-slate-700 outline-none transition placeholder:text-slate-400 focus:border-indigo-400 focus:ring-2 focus:ring-indigo-100";

const textareaClass = `${inputClass} min-h-28 resize-y`;

const selectClass =
  "h-11 w-full rounded-lg border border-slate-200 bg-white px-3 text-sm font-normal text-slate-700 outline-none transition focus:border-indigo-400 focus:ring-2 focus:ring-indigo-100";

export function EvaluationFields({ role }: { role: Role }) {
  if (role === "Aluno") {
    return (
      <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
        <label className={`${fieldClass} md:col-span-2`}>
          Atividades realizadas no período
          <textarea
            className={textareaClass}
            placeholder="Descreva as principais atividades desenvolvidas..."
          />
        </label>

        <label className={`${fieldClass} md:col-span-2`}>
          Resultados alcançados
          <textarea
            className={textareaClass}
            placeholder="Apresente os resultados obtidos até esta etapa..."
          />
        </label>

        <label className={`${fieldClass} md:col-span-2`}>
          Dificuldades encontradas
          <textarea
            className={textareaClass}
            placeholder="Registre dificuldades técnicas, acadêmicas ou operacionais..."
          />
        </label>

        <label className={fieldClass}>
          Participação no projeto
          <select defaultValue="" className={selectClass}>
            <option value="" disabled>
              Selecione
            </option>
            <option>Muito satisfatória</option>
            <option>Satisfatória</option>
            <option>Parcialmente satisfatória</option>
          </select>
        </label>

        <label className={fieldClass}>
          Carga horária média semanal
          <input
            className={inputClass}
            placeholder="Ex.: 12 horas"
          />
        </label>
      </div>
    );
  }

  if (isAdvisorRole(role)) {
    return (
      <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
        <label className={fieldClass}>
          Cumprimento do plano de trabalho
          <select defaultValue="" className={selectClass}>
            <option value="" disabled>
              Selecione
            </option>
            <option>Integral</option>
            <option>Parcial</option>
            <option>Insuficiente</option>
          </select>
        </label>

        <label className={fieldClass}>
          Desempenho do aluno
          <select defaultValue="" className={selectClass}>
            <option value="" disabled>
              Selecione
            </option>
            <option>Excelente</option>
            <option>Bom</option>
            <option>Regular</option>
            <option>Insuficiente</option>
          </select>
        </label>

        <label className={`${fieldClass} md:col-span-2`}>
          Evolução acadêmica e científica
          <textarea
            className={textareaClass}
            placeholder="Avalie a evolução do aluno no período..."
          />
        </label>

        <label className={`${fieldClass} md:col-span-2`}>
          Parecer e recomendações
          <textarea
            className={textareaClass}
            placeholder="Registre seu parecer e as recomendações para a próxima etapa..."
          />
        </label>

        <label className={fieldClass}>
          Recomendação
          <select className={selectClass}>
            <option>Continuar o projeto</option>
            <option>Continuar com ajustes</option>
            <option>Não recomendar continuidade</option>
          </select>
        </label>
      </div>
    );
  }

  if (role === "Avaliador") {
    return (
      <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
        <ScoreField label="Qualidade e organização do trabalho" />
        <ScoreField label="Adequação da metodologia" />
        <ScoreField label="Consistência dos resultados" />
        <ScoreField label="Apresentação e domínio do tema" />

        <label className={`${fieldClass} md:col-span-2`}>
          Parecer técnico
          <textarea
            className={textareaClass}
            placeholder="Registre a fundamentação da sua avaliação..."
          />
        </label>

        <label className={fieldClass}>
          Resultado
          <select className={selectClass}>
            <option>Aprovado</option>
            <option>Aprovado com ajustes</option>
            <option>Não aprovado</option>
          </select>
        </label>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
      <label className={fieldClass}>
        Documentação conferida
        <select className={selectClass}>
          <option>Sim, completa</option>
          <option>Com pendências</option>
        </select>
      </label>

      <label className={fieldClass}>
        Conformidade com o ciclo
        <select className={selectClass}>
          <option>Regular</option>
          <option>Requer verificação</option>
        </select>
      </label>

      <label className={`${fieldClass} md:col-span-2`}>
        Observações de auditoria
        <textarea
          className={textareaClass}
          placeholder="Registre ocorrências ou observações para auditoria..."
        />
      </label>

      <label className={fieldClass}>
        Validação
        <select className={selectClass}>
          <option>Validar avaliação</option>
          <option>Devolver para correção</option>
        </select>
      </label>
    </div>
  );
}
