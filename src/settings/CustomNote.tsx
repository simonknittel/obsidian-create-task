import clsx from "clsx";
import { ArrowDown, ArrowUp, Save, Trash } from "lucide-react";
import { useId } from "react";
import { SubmitHandler, useForm } from "react-hook-form";
import { useSettingsContext } from "./SettingsContext";
import { type CustomNote as CustomNoteType } from "./types";

type Inputs = {
  notePath: string;
  displayName: string;
  tag: string;
};

type Props = Readonly<{
  className?: string;
  customNote: CustomNoteType;
  index: number;
  first: boolean;
  last: boolean;
}>;

export const CustomNote = ({
  className,
  customNote,
  index,
  first,
  last,
}: Props) => {
  const { updateCustomNote, moveCustomNote, removeCustomNote } =
    useSettingsContext();
  const notePathId = useId();
  const displayNameId = useId();
  const tagId = useId();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<Inputs>();

  const onSubmit: SubmitHandler<Inputs> = async (data) => {
    await updateCustomNote(index, {
      path: data.notePath,
      name: data.displayName,
      tag: data.tag,
    });
  };

  return (
    <section className={clsx(className, "create-task__custom-note")}>
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="create-task__add-custom-note-container"
      >
        <div>
          <input
            type="text"
            id={notePathId}
            defaultValue={customNote.path}
            {...register("notePath", { required: true })}
          />

          {errors.notePath && (
            <p className="create-task__settings-error">
              This field is required.
            </p>
          )}
        </div>

        <div>
          <input
            type="text"
            id={displayNameId}
            defaultValue={customNote.name}
            {...register("displayName", { required: true })}
          />

          {errors.displayName && (
            <p className="create-task__settings-error">
              This field is required.
            </p>
          )}
        </div>

        <div>
          <input
            type="text"
            id={tagId}
            defaultValue={customNote.tag}
            {...register("tag")}
          />
        </div>

        <div className="create-task__custom-note-actions">
          {!first && (
            <button
              type="button"
              className="clickable-icon"
              onClick={async () => await moveCustomNote("up", index)}
            >
              <ArrowUp className="svg-icon" />
            </button>
          )}

          {!last && (
            <button
              type="button"
              className="clickable-icon"
              onClick={async () => await moveCustomNote("down", index)}
            >
              <ArrowDown className="svg-icon" />
            </button>
          )}

          <button
            type="button"
            className="clickable-icon"
            onClick={async () => await removeCustomNote(index)}
          >
            <Trash className="svg-icon" />
          </button>

          <button type="submit" className="mod-cta">
            <Save className="svg-icon" />
          </button>
        </div>
      </form>
    </section>
  );
};
