import { StrictMode, useId, useRef } from "react";
import { FormProvider, SubmitHandler, useForm } from "react-hook-form";
import CreateTask from "src/main";
import { CreateTaskCreateModal, InitialValues } from ".";
import { Date } from "./Date";
import { Heading } from "./Heading";
import { ObsidianProvider } from "./ObsidianContext";
import { Preview } from "./Preview";

export type Inputs = {
  customNoteIndex: "default" | string;
  taskDescription: string;
  taskDetails: string;
  dueDate: string;
};

type Props = Readonly<{
  plugin: CreateTask;
  createModal: CreateTaskCreateModal;
  initialValues: InitialValues;
}>;

export const ReactApp = ({ plugin, createModal, initialValues }: Props) => {
  const methods = useForm<Inputs>({
    defaultValues: {
      customNoteIndex: "default",
      taskDescription: initialValues?.taskDescription || "",
      taskDetails: initialValues?.taskDetails || "",
      dueDate: initialValues?.dueDate || "",
    },
  });

  const customNoteIndex = methods.watch("customNoteIndex");
  const taskDescription = methods.watch("taskDescription");
  const taskDetails = methods.watch("taskDetails");
  const dueDate = methods.watch("dueDate");

  const targetNoteId = useId();
  const taskDescriptionId = useId();
  const taskDetailsId = useId();

  const createAnotherOneRef = useRef<HTMLButtonElement>(null);

  const onSubmit: SubmitHandler<Inputs> = async (data) => {
    await plugin.createTask(
      initialValues?.notePath
        ? initialValues.notePath
        : data.customNoteIndex === "default"
          ? "default"
          : parseInt(data.customNoteIndex),
      data.taskDescription,
      data.dueDate,
      data.taskDetails,
    );

    createModal.close();
  };

  const handleCreateAnotherOne = async () => {
    await plugin.createTask(
      initialValues?.notePath
        ? initialValues.notePath
        : customNoteIndex === "default"
          ? "default"
          : parseInt(customNoteIndex),
      taskDescription,
      dueDate,
      taskDetails,
    );

    methods.setValue("taskDescription", "");
    methods.setValue("taskDetails", "");
    methods.setValue("dueDate", "");

    methods.setFocus("taskDescription");
  };

  const options = plugin.settings.customNotes.map((customNote, index) => (
    <option key={index} value={index}>
      {customNote.name}
    </option>
  ));

  return (
    <StrictMode>
      <ObsidianProvider plugin={plugin} createModal={createModal}>
        <div className="create-task__create-modal">
          <Heading />

          <FormProvider {...methods}>
            <form onSubmit={methods.handleSubmit(onSubmit)}>
              <div className="create-task__create-modal-row">
                <div className="create-task__create-modal-left">
                  <div className="create-task__create-modal-icon">📁</div>

                  <div>
                    <label htmlFor={targetNoteId}>Target note</label>

                    <p className="create-task__info">
                      Required. Corresponds to the custom notes added in the
                      settings
                    </p>
                  </div>
                </div>

                <div className="create-task__create-modal-right">
                  {initialValues?.notePath ? (
                    <input
                      type="text"
                      disabled
                      autoFocus
                      defaultValue={initialValues?.notePath}
                      id={targetNoteId}
                    />
                  ) : (
                    <select
                      className="dropdown"
                      autoFocus
                      {...methods.register("customNoteIndex", {
                        required: true,
                      })}
                      id={targetNoteId}
                    >
                      <option value="default">Default</option>
                      {options}
                    </select>
                  )}
                </div>
              </div>

              <div className="create-task__create-modal-row">
                <div className="create-task__create-modal-left">
                  <div className="create-task__create-modal-icon">🖊️</div>

                  <div>
                    <label htmlFor={taskDescriptionId}>Task description</label>

                    <p className="create-task__info">
                      Required. Text of the task
                    </p>
                  </div>
                </div>

                <div className="create-task__create-modal-right">
                  <input
                    type="text"
                    {...methods.register("taskDescription", { required: true })}
                    placeholder="My task"
                    id={taskDescriptionId}
                  />

                  {methods.formState.errors.taskDescription && (
                    <p className="create-task__error">
                      This field is required.
                    </p>
                  )}
                </div>
              </div>

              <div className="create-task__create-modal-row">
                <div className="create-task__create-modal-left">
                  <div className="create-task__create-modal-icon">🖊️</div>

                  <div>
                    <label htmlFor={taskDetailsId}>Details</label>

                    <p className="create-task__info">
                      Optional. More details for this task
                    </p>
                  </div>
                </div>

                <div className="create-task__create-modal-right">
                  <textarea
                    rows={5}
                    {...methods.register("taskDetails")}
                    id={taskDetailsId}
                  />
                </div>
              </div>

              <Date nextFocusRef={createAnotherOneRef} />

              <div className="create-task__create-modal-actions">
                <button
                  type="button"
                  onClick={handleCreateAnotherOne}
                  ref={createAnotherOneRef}
                >
                  Create another one
                </button>

                <button type="submit" className="mod-cta">
                  Create
                </button>
              </div>
            </form>
          </FormProvider>

          <Preview
            customNoteIndex={customNoteIndex}
            notePath={initialValues?.notePath}
            taskDescription={taskDescription}
            taskDetails={taskDetails}
            dueDate={dueDate}
          />
        </div>
      </ObsidianProvider>
    </StrictMode>
  );
};
