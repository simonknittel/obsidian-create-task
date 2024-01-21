import clsx from "clsx";
import { CustomNote } from "./CustomNote";
import { useSettingsContext } from "./SettingsContext";

type Props = Readonly<{
  className?: string;
}>;

export const CustomNotes = ({ className }: Props) => {
  const { customNotes } = useSettingsContext();

  return (
    <section className={clsx(className)}>
      <h2>Custom notes</h2>

      <div className="create-task__custom-notes-labels">
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
