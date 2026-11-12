import { App } from "obsidian";
import { StrictMode, useId } from "react";
import { SubmitHandler, useForm } from "react-hook-form";
import { CustomNote } from "../settings/types";
import { useNoteSuggest } from "../useNoteSuggest";

type Inputs = {
  notePath: string;
  displayName: string;
  tag: string;
};

type Props = Readonly<{
  app: App;
  customNote: CustomNote | undefined;
  onSave: (customNote: CustomNote) => Promise<void>;
}>;

export const ReactApp = ({ app, customNote, onSave }: Props) => {
  const {
    register,
    handleSubmit,
    formState: { errors },
    setError,
    setValue,
  } = useForm<Inputs>({
    defaultValues: {
      notePath: customNote?.path ?? "",
      displayName: customNote?.name ?? "",
      tag: customNote?.tag ?? "",
    },
  });

  const notePathId = useId();
  const displayNameId = useId();
  const tagId = useId();

  const { ref: notePathRef, ...notePathField } = register("notePath", {
    required: true,
  });
  const noteSuggestRef = useNoteSuggest(app, (path) =>
    setValue("notePath", path, { shouldValidate: true }),
  );

  const onSubmit: SubmitHandler<Inputs> = async (data) => {
    if (!app.vault.getFileByPath(data.notePath)) {
      setError("notePath", {
        type: "manual",
        message: "This file doesn't exist.",
      });

      return;
    }

    await onSave({
      path: data.notePath,
      name: data.displayName,
      tag: data.tag,
    });
  };

  return (
    <StrictMode>
      <form
        onSubmit={(event) => void handleSubmit(onSubmit)(event)}
        className="create-task__create-modal"
      >
        <div className="create-task__create-modal-row">
          <div className="create-task__create-modal-left">
            <div className="create-task__create-modal-icon">📁</div>

            <div>
              <label htmlFor={notePathId}>Note path</label>

              <p className="create-task__info">
                Required. The file path of this note.
              </p>
            </div>
          </div>

          <div className="create-task__create-modal-right">
            <input
              type="text"
              autoFocus
              {...notePathField}
              ref={(input) => {
                notePathRef(input);
                noteSuggestRef(input);
              }}
              id={notePathId}
            />

            {errors.notePath && (
              <p className="create-task__error">
                {errors.notePath.message || "This field is required."}
              </p>
            )}
          </div>
        </div>

        <div className="create-task__create-modal-row">
          <div className="create-task__create-modal-left">
            <div className="create-task__create-modal-icon">🖊️</div>

            <div>
              <label htmlFor={displayNameId}>Display name</label>

              <p className="create-task__info">
                Required. A custom name for this note. This will only be used
                within the modal.
              </p>
            </div>
          </div>

          <div className="create-task__create-modal-right">
            <input
              type="text"
              {...register("displayName", { required: true })}
              id={displayNameId}
            />

            {errors.displayName && (
              <p className="create-task__error">This field is required.</p>
            )}
          </div>
        </div>

        <div className="create-task__create-modal-row">
          <div className="create-task__create-modal-left">
            <div className="create-task__create-modal-icon">🏷️</div>

            <div>
              <label htmlFor={tagId}>Tag</label>

              <p className="create-task__info">
                Optional. This tag will get added to the task.
              </p>
            </div>
          </div>

          <div className="create-task__create-modal-right">
            <input type="text" {...register("tag")} id={tagId} />
          </div>
        </div>

        <div className="create-task__create-modal-actions">
          <button type="submit" className="mod-cta">
            {customNote ? "Save" : "Add"}
          </button>
        </div>
      </form>
    </StrictMode>
  );
};
