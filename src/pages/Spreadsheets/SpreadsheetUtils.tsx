import type { SpreadsheetDefinition } from "../../models/spreadsheetModel";


export const spreadsheetDefinitions: SpreadsheetDefinition[] = [
  {
    id: "PARTICIPANTS",
    title: "Alunos Participantes",
    availability: "Parcial e final",
    sensitive: true,
    description:
      "Alunos com ao menos uma ficha da banca assinada na defesa selecionada.",
    columns: [
      "CPF do aluno",
      "SISPROJ",
      "Programa",
      "Título do projeto",
      "Nome do aluno",
      "Orientador",
      "Coorientador",
      "Relatório parcial",
      "Relatório final",
      "Resumo simples",
      "Observação",
    ],
  },
  {
    id: "HONORABLE_MENTION",
    title: "Menção Honrosa",
    availability: "Somente final",
    sensitive: true,
    description:
      "Um aluno indicado por curso, considerando a maior pontuação da apresentação final.",
    columns: ["CPF", "SISPROJ", "Nome do aluno", "Curso"],
  },
  {
    id: "EVALUATORS",
    title: "Membros Avaliadores",
    availability: "Parcial e final",
    sensitive: true,
    description:
      "Avaliadores que assinaram ao menos uma ficha, sem repetição por pessoa.",
    columns: ["CPF", "Nome completo"],
  },
  {
    id: "GRADES",
    title: "Cálculo de Notas",
    availability: "Parcial e final",
    sensitive: false,
    description:
      "Consolidação das notas do orientador, avaliadores interno e externo e aluno.",
    columns: [
      "Curso",
      "SISPROJ",
      "Título",
      "Aluno",
      "Orientador",
      "Nota orientador",
      "Avaliador externo",
      "Nota externa",
      "Avaliador interno",
      "Nota interna",
      "Aluno(a)",
      "Nota aluno",
    ],
  },
  {
    id: "FINAL_EVALUATION",
    title: "Avaliação Final com Notas",
    availability: "Somente final",
    sensitive: false,
    description:
      "Resultado final ordenado por curso e média decrescente, incluindo menção honrosa.",
    columns: [
      "Curso",
      "Nº SISPROJ",
      "Título",
      "Aluno",
      "Orientador",
      "Nota orientador",
      "Nota externa",
      "Nota interna",
      "Nota aluno",
      "Média final",
      "Menção honrosa",
    ],
  },
];
