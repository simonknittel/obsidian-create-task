import { StrictMode } from "react";
import CreateTask from "src/main";
import { AddCustomNote } from "./AddCustomNote";
import { CustomNotes } from "./CustomNotes";
import { SettingsProvider } from "./SettingsContext";

type Props = Readonly<{
  plugin: CreateTask;
}>;

export const ReactApp = ({ plugin }: Props) => {
  return (
    <StrictMode>
      <SettingsProvider plugin={plugin}>
        <AddCustomNote />
        <CustomNotes />
      </SettingsProvider>
    </StrictMode>
  );
};
