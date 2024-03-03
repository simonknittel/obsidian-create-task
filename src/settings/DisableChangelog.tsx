import clsx from "clsx";
import { useId, useState } from "react";
import { useObsidianContext } from "./ObsidianContext";

type Props = Readonly<{
  className?: string;
}>;

export const DisableChangelog = ({ className }: Props) => {
  const { plugin } = useObsidianContext();
  const [value, setValue] = useState(plugin.settings.disableChangelog || false);
  const id = useId();

  const handleChange = async () => {
    setValue(!value);
    plugin.settings.disableChangelog = !value;
    await plugin.saveSettings();
  };

  return (
    <section className={clsx(className, "setting-item")}>
      <div className="setting-item-info">
        <label htmlFor={id} className="setting-item-name">
          Disable changelog
        </label>

        <div className="setting-item-description">
          Enable this to prevent the changelog from showing after an update.
        </div>
      </div>

      <div className="setting-item-control">
        <div
          className={clsx("checkbox-container", {
            "is-enabled": value,
          })}
          onClick={handleChange}
        >
          <input
            type="checkbox"
            id={id}
            checked={value}
            onChange={handleChange}
          />
        </div>
      </div>
    </section>
  );
};
