export function formatRequestDate(date: string): string {
  const requestDate = new Date(date);

  if (Number.isNaN(requestDate.getTime())) {
    return "Data inválida";
  }

  const now = new Date();

  const isSameDay =
    requestDate.getDate() === now.getDate() &&
    requestDate.getMonth() === now.getMonth() &&
    requestDate.getFullYear() === now.getFullYear();

  const yesterday = new Date(now);
  yesterday.setDate(now.getDate() - 1);

  const isYesterday =
    requestDate.getDate() === yesterday.getDate() &&
    requestDate.getMonth() === yesterday.getMonth() &&
    requestDate.getFullYear() === yesterday.getFullYear();

  const time = requestDate.toLocaleTimeString("pt-BR", {
    hour: "2-digit",
    minute: "2-digit",
    timeZone: "America/Manaus",
  });

  if (isSameDay) return `Hoje, ${time}`;
  if (isYesterday) return `Ontem, ${time}`;

  const dateFormatted = requestDate.toLocaleDateString("pt-BR", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    timeZone: "America/Manaus",
  });

  return `${dateFormatted}, ${time}`;
}
