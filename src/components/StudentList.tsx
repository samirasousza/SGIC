import { Badge } from "./Badge";
import { Icon } from "./Icon";

export function StudentList() {
  return (
    <div className="student-list">
      {[
        [
          "AM",
          "Ana Martins",
          "Relatório parcial",
          "Aguardando validação",
          "warning",
        ],
        ["LA", "Lucas Almeida", "Relatório mensal 8", "Em dia", "success"],
        ["JS", "Júlia Souza", "Relatório mensal 5", "Atrasado", "danger"],
      ].map(([initials, name, report, status, tone]) => (
        <div className="student-row" key={name}>
          <div className="avatar">{initials}</div>
          <div>
            <strong>{name}</strong>
            <small>{report}</small>
          </div>
          <Badge tone={tone as "success"}>{status}</Badge>
          <Icon name="arrow" size={17} />
        </div>
      ))}
    </div>
  );
}
