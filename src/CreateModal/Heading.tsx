import clsx from "clsx";
import { Settings } from "lucide-react";
import { useObsidianContext } from "./ObsidianContext";

type Props = Readonly<{
  className?: string;
}>;

export const Heading = ({ className }: Props) => {
  const { plugin, createModal } = useObsidianContext();

  return (
    <div className={clsx(className, "create-task__create-modal-heading")}>
      <h1>Create task</h1>

      <button
        type="button"
        onClick={() => {
          createModal.close();
          plugin.openSettings();
        }}
      >
        Settings
        <Settings className="svg-icon" />
      </button>
    </div>
  );
};
