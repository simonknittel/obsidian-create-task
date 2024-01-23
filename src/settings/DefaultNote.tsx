import clsx from "clsx";
import { useId, useState } from "react";
import { useObsidianContext } from "./ObsidianContext";

type Props = Readonly<{
  className?: string;
}>;

export const DefaultNote = ({ className }: Props) => {
  const { plugin } = useObsidianContext();
  const [value, setValue] = useState(plugin.settings.defaultNote);
  const id = useId();

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    plugin.settings.defaultNote = value;
    await plugin.saveSettings();
  };

  const handleBlur = async () => {
    if (value === plugin.settings.defaultNote) return;
    plugin.settings.defaultNote = value;
    await plugin.saveSettings();
  };

  return (
    <form onSubmit={handleSubmit} className={clsx(className)}>
      <div className="setting-item">
        <div className="setting-item-info">
          <label htmlFor={id} className="setting-item-name">
            Default note (required)
          </label>

          <div className="setting-item-description">
            Tasks will be added to this note if no other note is selected. This
            is required to use the plugin.
          </div>
        </div>

        <div className="setting-item-control">
          <input
            type="text"
            value={value}
            onChange={(e) => setValue(e.target.value)}
            onBlur={handleBlur}
            id={id}
          />
        </div>
      </div>
    </form>
  );
};
