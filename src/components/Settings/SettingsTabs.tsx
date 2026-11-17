import type { SettingsSection } from "../../types/settingsTypes";

type SettingsTabsProps = {
  section: SettingsSection;
  onChange: (section: SettingsSection) => void;
};

const tabs: { key: SettingsSection; label: string }[] = [
  { key: "cycles", label: "Ciclos acadêmicos" },
  { key: "catalog", label: "Unidades e cursos" },
  { key: "import", label: "Importar projetos" },
  { key: "emails", label: "E-mails" },
];

export function SettingsTabs({ section, onChange }: SettingsTabsProps) {
  return (
    <nav
      className="flex flex-wrap gap-2 border-b border-gray-200"
      aria-label="Configurações administrativas"
    >
      {tabs.map(({ key, label }) => (
        <button
          key={key}
          type="button"
          onClick={() => onChange(key)}
          className={`cursor-pointer border-b-2 px-3 py-3 text-sm font-medium transition ${
            section === key
              ? "border-blue-700 text-blue-700"
              : "border-transparent text-gray-500 hover:text-gray-800"
          }`}
        >
          {label}
        </button>
      ))}
    </nav>
  );
}
