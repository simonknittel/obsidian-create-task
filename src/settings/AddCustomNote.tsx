import clsx from "clsx";
import { Save } from "lucide-react";
import { useEffect, useId } from "react";
import { SubmitHandler, useForm } from "react-hook-form";
import { useSettingsContext } from "./SettingsContext";

type Inputs = {
  notePath: string;
  displayName: string;
  tag: string;
};

type Props = Readonly<{
  className?: string;
}>;

export const AddCustomNote = ({ className }: Props) => {
  const { addCustomNote } = useSettingsContext();
  const notePathId = useId();
  const displayNameId = useId();
  const tagId = useId();

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitSuccessful },
    reset,
  } = useForm<Inputs>();

  const onSubmit: SubmitHandler<Inputs> = async (data) => {
    await addCustomNote({
      path: data.notePath,
      name: data.displayName,
      tag: data.tag,
    });
  };

  // 🤨 https://react-hook-form.com/docs/useform/reset#:~:text=It%27s%20recommended%20to%20reset%20inside%20useEffect%20after%20submission.
  useEffect(() => {
    if (!isSubmitSuccessful) return;
    reset();
  }, [isSubmitSuccessful]);

  return (
    <section className={clsx(className)}>
      <h2>Add custom note</h2>

      <form
        onSubmit={handleSubmit(onSubmit)}
        className="create-task__add-custom-note-container"
      >
        <div>
          <label
            htmlFor={notePathId}
            className="create-task__add-custom-note-label"
          >
            Note path
          </label>

          <input
            type="text"
            id={notePathId}
            defaultValue=""
            {...register("notePath", { required: true })}
          />

          {errors.notePath && (
            <p className="create-task__settings-error">
              This field is required.
            </p>
          )}

          <p className="create-task__info">The file path of this note.</p>
        </div>

        <div>
          <label
            htmlFor={displayNameId}
            className="create-task__add-custom-note-label"
          >
            Display name
          </label>

          <input
            type="text"
            id={displayNameId}
            defaultValue=""
            {...register("displayName", { required: true })}
          />

          {errors.displayName && (
            <p className="create-task__settings-error">
              This field is required.
            </p>
          )}

          <p className="create-task__info">
            A custom name for this note. This will only be used within the
            modal.
          </p>
        </div>

        <div>
          <label htmlFor={tagId} className="create-task__add-custom-note-label">
            Tag (optional)
          </label>

          <input type="text" id={tagId} defaultValue="" {...register("tag")} />

          <p className="create-task__info">
            This tag will get added to the task.
          </p>
        </div>

        <div className="create-task__add-custom-note-actions">
          <span className="create-task__add-custom-note-label">Actions</span>

          <div>
            <button type="submit" className="mod-cta">
              <Save className="svg-icon" />
            </button>
          </div>
        </div>
      </form>
    </section>
  );
};
