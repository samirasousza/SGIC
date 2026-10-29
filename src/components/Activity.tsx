import { Icon } from "./Icon";

const tones = {
  blue: "bg-blue-100 text-blue-700",
  green: "bg-green-100 text-green-700",
  orange: "bg-orange-100 text-orange-700",
};

export function Activity({
  day,
  month,
  title,
  detail,
  tone,
}: {
  day: string;
  month: string;
  title: string;
  detail: string;
  tone: keyof typeof tones;
}) {
  return (
    <div className="flex items-center gap-4 rounded-xl border border-gray-200 p-4 transition hover:bg-gray-50">
      <div
        className={`flex h-14 w-14 flex-col items-center justify-center rounded-xl ${tones[tone]}`}
      >
        <strong className="text-lg">{day}</strong>
        <span className="text-xs font-semibold uppercase">{month}</span>
      </div>

      <div className="flex-1">
        <strong className="block text-gray-900">{title}</strong>
        <small className="text-gray-500">{detail}</small>
      </div>

      <Icon name="arrow" size={17} />
    </div>
  );
}