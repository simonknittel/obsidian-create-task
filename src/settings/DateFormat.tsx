import clsx from "clsx";
import { ChangeEventHandler, useId, useState } from "react";
import { useObsidianContext } from "./ObsidianContext";

const DATE_FORMATS = [
  {
    value: "@due(YYYY-MM-DD)",
    name: "CardBoard",
  },
  {
    value: "📅 YYYY-MM-DD",
    name: "Tasks",
  },
  {
    value: "[due:: YYYY-MM-DD]",
    name: "Dataview",
  },
];

type Props = Readonly<{
  className?: string;
}>;

export const DateFormat = ({ className }: Props) => {
  const { plugin } = useObsidianContext();
  const [value, setValue] = useState(plugin.settings.dateFormat);
  const id = useId();

  const handleChange: ChangeEventHandler<HTMLSelectElement> = async (e) => {
    setValue(e.target.value);
    plugin.settings.dateFormat = e.target.value;
    await plugin.saveSettings();
  };

  return (
    <section className={clsx(className, "setting-item")}>
      <div className="setting-item-info">
        <label htmlFor={id} className="setting-item-name">
          Date format (required)
        </label>

        <div className="setting-item-description">
          You can choose different date formats depending on which plugins you
          use.
        </div>
      </div>

      <div className="setting-item-control">
        <select value={value} onChange={handleChange} className="dropdown">
          {DATE_FORMATS.map((format) => (
            <option key={format.value} value={format.value}>
              {format.name}: {format.value}
            </option>
          ))}
        </select>
      </div>
    </section>
  );
};
