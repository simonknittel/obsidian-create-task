import clsx from "clsx";
import { CustomNote } from "./CustomNote";
import { useObsidianContext } from "./ObsidianContext";

type Props = Readonly<{
  className?: string;
}>;

export const CustomNotes = ({ className }: Props) => {
  const { customNotes } = useObsidianContext();

  return (
    <section className={clsx(className, "create-task__custom-notes")}>
      <h2>Custom notes</h2>

      <div className="create-task__custom-notes-column-labels">
        <div>Note path</div>
        <div>Display name</div>
        <div>Tag (optional)</div>
      </div>

      {customNotes.map((customNote, index) => (
        <CustomNote
          key={customNote.path}
          customNote={customNote}
          index={index}
          first={index === 0}
          last={index === customNotes.length - 1}
        />
      ))}
    </section>
  );
};
