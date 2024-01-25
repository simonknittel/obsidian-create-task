import { StrictMode } from "react";
import CreateTask from "src/main";
import { Links } from "../components/Links";
import { AddCustomNote } from "./AddCustomNote";
import { CustomNotes } from "./CustomNotes";
import { DateFormat } from "./DateFormat";
import { DefaultNote } from "./DefaultNote";
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
        <AddCustomNote />
        <CustomNotes />
        <Links items={["documentation", "changelog", "coffee"]} />
      </ObsidianProvider>
    </StrictMode>
  );
};
