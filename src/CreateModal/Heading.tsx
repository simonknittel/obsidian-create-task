import clsx from "clsx";
import { useObsidianContext } from "./ObsidianContext";
import { Settings } from "lucide-react";

type Props = Readonly<{
  className?: string;
}>;

export const Heading = ({ className }: Props) => {
  const { plugin, createModal } = useObsidianContext();

  return (
    <div className={clsx(className, "create-task__create-heading")}>
      <h1>Create Task</h1>

      <button
        type="button"
        onClick={() => {
          createModal.close();
          plugin.openSettings();
        }}
        title="Open plugin settings"
        className="clickable-icon"
      >
        <Settings className="svg-icon" />
      </button>
    </div>
  );
};
