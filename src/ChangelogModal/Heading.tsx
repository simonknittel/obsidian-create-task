import clsx from "clsx";
import { Settings } from "lucide-react";
import { useObsidianContext } from "./ObsidianContext";

type Props = Readonly<{
  className?: string;
}>;

export const Heading = ({ className }: Props) => {
  const { plugin, changelogModal } = useObsidianContext();

  return (
    <div className={clsx(className, "create-task__changelog-modal-heading")}>
      <h1>Create Task: Changelog</h1>

      <button
        type="button"
        onClick={() => {
          changelogModal.close();
          plugin.openSettings();
        }}
      >
        Settings
        <Settings className="svg-icon" />
      </button>
    </div>
  );
};
