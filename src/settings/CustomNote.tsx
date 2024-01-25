import clsx from "clsx";
import { ArrowDown, ArrowUp, Save, Trash } from "lucide-react";
import { useId } from "react";
import { SubmitHandler, useForm } from "react-hook-form";
import { useObsidianContext } from "./ObsidianContext";
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
  const { plugin, updateCustomNote, moveCustomNote, removeCustomNote } =
    useObsidianContext();
  const notePathId = useId();
  const displayNameId = useId();
  const tagId = useId();

  const {
    register,
    handleSubmit,
    formState: { errors },
    setError,
  } = useForm<Inputs>();

  const onSubmit: SubmitHandler<Inputs> = async (data) => {
    try {
      await plugin.getFile(data.notePath);
    } catch (error) {
      setError("notePath", {
        type: "manual",
        message: "This file doesn't exist.",
      });

      return;
    }

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
        className="create-task__custom-note-grid"
      >
        <div>
          <label id={notePathId} className="create-task__custom-note-row-label">
            Note path
          </label>

          <input
            type="text"
            id={notePathId}
            defaultValue={customNote.path}
            {...register("notePath", { required: true })}
          />

          {errors.notePath && (
            <p className="create-task__error">
              {errors.notePath.message || "This field is required."}
            </p>
          )}
        </div>

        <div>
          <label id={notePathId} className="create-task__custom-note-row-label">
            Display name
          </label>

          <input
            type="text"
            id={displayNameId}
            defaultValue={customNote.name}
            {...register("displayName", { required: true })}
          />

          {errors.displayName && (
            <p className="create-task__error">
              {errors.displayName.message || "This field is required."}
            </p>
          )}
        </div>

        <div>
          <label id={notePathId} className="create-task__custom-note-row-label">
            Tag (optional)
          </label>

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
              onClick={async () => await moveCustomNote("up", index)}
              title="Move custom note up"
              className="clickable-icon"
            >
              <ArrowUp className="svg-icon" />
            </button>
          )}

          {!last && (
            <button
              type="button"
              onClick={async () => await moveCustomNote("down", index)}
              title="Move custom note down"
              className="clickable-icon"
            >
              <ArrowDown className="svg-icon" />
            </button>
          )}

          <button
            type="button"
            onClick={async () => await removeCustomNote(index)}
            title="Remove custom note"
            className="clickable-icon"
          >
            <Trash className="svg-icon" />
          </button>

          <button type="submit" title="Save custom note" className="mod-cta">
            <Save className="svg-icon" />
          </button>
        </div>
      </form>
    </section>
  );
};
