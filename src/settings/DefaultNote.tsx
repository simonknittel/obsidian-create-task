import clsx from "clsx";
import { useId, useState } from "react";
import { useObsidianContext } from "./ObsidianContext";
import { CreateTaskSettings } from "./types";

type Props = Readonly<{
  className?: string;
}>;

export const DefaultNote = ({ className }: Props) => {
  const { plugin } = useObsidianContext();
  const [value, setValue] = useState(plugin.settings.defaultNote);
  const id = useId();
  const [error, setError] = useState<string | null>(null);

  const save = async (value: CreateTaskSettings["defaultNote"]) => {
    if (!value) {
      setError("This field is required.");
      return;
    }

    try {
      await plugin.getFile(value);
    } catch (error) {
      setError("This file doesn't exist.");
      return;
    }

    plugin.settings.defaultNote = value;
    await plugin.saveSettings();
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    save(value);
  };

  const handleBlur = async () => {
    if (value === plugin.settings.defaultNote) return;
    save(value);
  };

  return (
    <form
      onSubmit={handleSubmit}
      className={clsx(className, "create-task__default-note")}
    >
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

          {error && <div className="create-task__error">{error}</div>}
        </div>
      </div>
    </form>
  );
};
