import { BookText } from "lucide-react";
import { StrictMode, useId } from "react";
import { SubmitHandler, useForm } from "react-hook-form";
import CreateTask from "src/main";
import { CreateTaskOnboardingModal } from ".";
import { Heading } from "./Heading";
import { ObsidianProvider } from "./ObsidianContext";

type Inputs = {
  notePath: string;
};

type Props = Readonly<{
  plugin: CreateTask;
  onboardingModal: CreateTaskOnboardingModal;
}>;

export const ReactApp = ({ plugin, onboardingModal }: Props) => {
  const {
    register,
    handleSubmit,
    formState: { errors },
    setError,
  } = useForm<Inputs>({
    defaultValues: {
      notePath: "",
    },
  });

  const notePathId = useId();

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

    plugin.settings.defaultNote = data.notePath;
    await plugin.saveSettings();

    onboardingModal.close();
    plugin.openCreateModal();
  };

  return (
    <StrictMode>
      <ObsidianProvider plugin={plugin} onboardingModal={onboardingModal}>
        <div className="create-task__create-modal">
          <Heading />

          <form onSubmit={handleSubmit(onSubmit)}>
            <div className="create-task__create-modal-row">
              <div className="create-task__create-modal-left">
                <div className="create-task__create-modal-icon">🖊️</div>

                <div>
                  <label htmlFor={notePathId}>Note path</label>

                  <p className="create-task__info">
                    Tasks will be added to this note if no other note is
                    selected. This is required to use the plugin.
                  </p>
                </div>
              </div>

              <div className="create-task__create-modal-right">
                <input
                  type="text"
                  {...register("notePath", { required: true })}
                  id={notePathId}
                />

                {errors.notePath && (
                  <p className="create-task__error">
                    {errors.notePath.message || "This field is required."}
                  </p>
                )}
              </div>
            </div>

            <div className="create-task__create-modal-actions">
              <button type="submit" className="mod-cta">
                Save and create your first task
              </button>
            </div>
          </form>

          <section className="create-task__links">
            <a href="https://github.com/simonknittel/obsidian-create-task?tab=readme-ov-file#create-task">
              <BookText /> Documentation
            </a>
          </section>
        </div>
      </ObsidianProvider>
    </StrictMode>
  );
};
