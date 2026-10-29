import { Card } from "./Card";
import { Icon } from "./Icon";

const tones = {
  blue: "bg-blue-100 text-blue-600",
  green: "bg-green-100 text-green-600",
  orange: "bg-orange-100 text-orange-600",
};

export function Metric({
  icon,
  value,
  label,
  detail,
  tone = "blue",
}: {
  icon: string;
  value: string;
  label: string;
  detail: string;
  tone?: keyof typeof tones;
}) {
  return (
    <Card className="flex flex-col gap-3">
      <div
        className={`flex h-12 w-12 items-center justify-center rounded-xl ${tones[tone]}`}
      >
        <Icon name={icon} />
      </div>

      <span className="text-3xl font-bold text-gray-900">{value}</span>

      <div>
        <strong className="block text-gray-900">{label}</strong>
        <small className="text-gray-500">{detail}</small>
      </div>
    </Card>
  );
}