import { StrictMode } from "react";
import { SubmitHandler, useForm } from "react-hook-form";
import CreateTask from "src/main";
import { CreateTaskCreateModal, InitialValues } from ".";
import { Heading } from "./Heading";
import { ObsidianProvider } from "./ObsidianContext";
import { Preview } from "./Preview";

type Inputs = {
  customNoteIndex: "default" | string;
  taskDescription: string;
  dueDate: string;
};

type Props = Readonly<{
  plugin: CreateTask;
  createModal: CreateTaskCreateModal;
  initialValues: InitialValues;
}>;

export const ReactApp = ({ plugin, createModal, initialValues }: Props) => {
  const {
    register,
    handleSubmit,
    formState: { errors },
    watch,
    setFocus,
    setValue,
  } = useForm<Inputs>({
    defaultValues: {
      customNoteIndex: "default",
      taskDescription: initialValues?.taskDescription || "",
      dueDate: initialValues?.dueDate || "",
    },
  });

  const customNoteIndex = watch("customNoteIndex");
  const taskDescription = watch("taskDescription");
  const dueDate = watch("dueDate");

  const onSubmit: SubmitHandler<Inputs> = async (data) => {
    await plugin.createTask(
      initialValues?.notePath
        ? initialValues.notePath
        : data.customNoteIndex === "default"
          ? "default"
          : parseInt(data.customNoteIndex),
      data.taskDescription,
      data.dueDate,
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
    );

    setValue("taskDescription", "");
    setValue("dueDate", "");

    setFocus("taskDescription");
  };

  const options = plugin.settings.customNotes.map((customNote, index) => (
    <option key={index} value={index}>
      {customNote.name}
    </option>
  ));

  return (
    <StrictMode>
      <ObsidianProvider plugin={plugin} createModal={createModal}>
        <Heading />

        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="setting-item">
            <div className="setting-item-info">
              <label className="setting-item-name">📁 Target note</label>

              <div className="setting-item-description">
                Corresponds to the custom notes added in the settings
              </div>
            </div>

            <div className="setting-item-control">
              {initialValues?.notePath ? (
                <input
                  type="text"
                  disabled
                  autoFocus
                  defaultValue={initialValues?.notePath}
                />
              ) : (
                <select
                  className="dropdown"
                  autoFocus
                  {...register("customNoteIndex", { required: true })}
                >
                  <option value="default">Default</option>
                  {options}
                </select>
              )}
            </div>
          </div>

          <div className="setting-item">
            <div className="setting-item-info">
              <label className="setting-item-name">🖊️ Task description</label>

              <div className="setting-item-description">
                Text of the task (required)
              </div>
            </div>

            <div className="setting-item-control">
              <input
                type="text"
                {...register("taskDescription", { required: true })}
                placeholder="My task"
              />

              {errors.taskDescription && (
                <p className="create-task__error">This field is required.</p>
              )}
            </div>
          </div>

          <div className="setting-item">
            <div className="setting-item-info">
              <label className="setting-item-name">📅 Due date</label>

              <div className="setting-item-description">(optional)</div>
            </div>

            <div className="setting-item-control">
              <input type="text" {...register("dueDate")} />
            </div>
          </div>

          <div className="setting-item">
            <div className="setting-item-info">
              <div className="setting-item-name"></div>

              <div className="setting-item-description"></div>
            </div>

            <div className="setting-item-control">
              <button type="button" onClick={handleCreateAnotherOne}>
                Create another one
              </button>

              <button type="submit" className="mod-cta">
                Create
              </button>
            </div>
          </div>
        </form>

        <Preview
          customNoteIndex={customNoteIndex}
          notePath={initialValues?.notePath}
          taskDescription={taskDescription}
          dueDate={dueDate}
        />
      </ObsidianProvider>
    </StrictMode>
  );
};
