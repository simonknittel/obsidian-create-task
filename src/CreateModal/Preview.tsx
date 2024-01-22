import clsx from "clsx";
import { useObsidianContext } from "./ObsidianContext";

type Props = Readonly<{
  className?: string;
  notePath?: string;
  customNoteIndex: "default" | string;
  taskDescription: string;
  dueDate: string;
}>;

export const Preview = ({
  className,
  notePath,
  customNoteIndex,
  taskDescription,
  dueDate,
}: Props) => {
  const { plugin } = useObsidianContext();

  let to: string;
  let task: string;

  if (notePath) {
    to = notePath;
    task = plugin.compileLine(undefined, taskDescription, dueDate);
  } else if (customNoteIndex === "default") {
    to = plugin.settings.defaultNote;
    task = plugin.compileLine(undefined, taskDescription, dueDate);
  } else {
    const customNote = plugin.settings.customNotes[parseInt(customNoteIndex)];
    to = customNote.path;
    task = plugin.compileLine(customNote.tag, taskDescription, dueDate);
  }

  return (
    <div className={clsx(className)}>
      <h2>Preview</h2>

      <p className="create-task__info">
        The following line will get added to: <i>{to}</i>
      </p>

      <code className="create-task__preview">{task}</code>
    </div>
  );
};
