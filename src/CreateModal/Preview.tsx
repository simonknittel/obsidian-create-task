import clsx from "clsx";
import { useObsidianContext } from "./ObsidianContext";

type Props = Readonly<{
  className?: string;
  notePath?: string;
  customNoteIndex: "default" | string;
  taskDescription: string;
  taskDetails: string;
  dueDate: string;
}>;

export const Preview = ({
  className,
  notePath,
  customNoteIndex,
  taskDescription,
  taskDetails,
  dueDate,
}: Props) => {
  const { plugin } = useObsidianContext();

  let to: string;
  let task: string;

  if (notePath) {
    to = notePath;
    task = plugin.compileLine(undefined, taskDescription, dueDate, taskDetails);
  } else if (customNoteIndex === "default") {
    to = plugin.settings.defaultNote;
    task = plugin.compileLine(undefined, taskDescription, dueDate, taskDetails);
  } else {
    const customNote = plugin.settings.customNotes[parseInt(customNoteIndex)];
    to = customNote.path;
    task = plugin.compileLine(
      customNote.tag,
      taskDescription,
      dueDate,
      taskDetails,
    );
  }

  return (
    <div className={clsx(className)}>
      <h2>Preview</h2>

      <p className="create-task__info">
        The following line will get added to: <i>{to}</i>
      </p>

      <pre>
        <code className="create-task__preview">{task}</code>
      </pre>
    </div>
  );
};
