import { BookText, Coffee, PackagePlus } from "lucide-react";
import { StrictMode } from "react";
import CreateTask from "src/main";
import { AddCustomNote } from "./AddCustomNote";
import { CustomNotes } from "./CustomNotes";
import { DateFormat } from "./DateFormat";
import { DefaultNote } from "./DefaultNote";
import { DisableChangelog } from "./DisableChangelog";
import { ObsidianProvider } from "./ObsidianContext";

type Props = Readonly<{
  plugin: CreateTask;
}>;

export const ReactApp = ({ plugin }: Props) => {
  return (
    <StrictMode>
      <ObsidianProvider plugin={plugin}>
        <DefaultNote />
        <DateFormat />
        <DisableChangelog />
        <AddCustomNote />
        <CustomNotes />

        <section className="create-task__links">
          <a href="https://github.com/simonknittel/obsidian-create-task?tab=readme-ov-file#create-task">
            <BookText /> Documentation
          </a>

          <button
            type="button"
            onClick={() => {
              plugin.openChangelogModal();
            }}
          >
            <PackagePlus /> Changelog
          </button>

          <a href="https://buymeacoffee.com/simonknittel">
            <Coffee /> Buy Me A Coffee
          </a>
        </section>
      </ObsidianProvider>
    </StrictMode>
  );
};
