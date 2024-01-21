import type { ReactNode } from "react";
import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
} from "react";
import CreateTask from "src/main";
import { CustomNote } from "./types";

type SettingsContextInterface = {
  customNotes: CustomNote[];
  addCustomNote: (customNote: CustomNote) => Promise<void>;
  updateCustomNote: (index: number, customNote: CustomNote) => Promise<void>;
  moveCustomNote: (direction: "up" | "down", index: number) => Promise<void>;
  removeCustomNote: (index: number) => Promise<void>;
};

const SettingsContext = createContext<SettingsContextInterface | undefined>(
  undefined,
);

type ProviderProps = Readonly<{
  children: ReactNode;
  plugin: CreateTask;
}>;

export const SettingsProvider = ({ children, plugin }: ProviderProps) => {
  const [customNotes, _setCustomNotes] = useState<CustomNote[]>(
    structuredClone(plugin.settings.customNotes),
  );

  const addCustomNote = useCallback(
    async (customNote: CustomNote) => {
      plugin.settings.customNotes.push(customNote);
      await plugin.saveSettings();

      _setCustomNotes((value) => [...value, customNote]);
    },
    [plugin, _setCustomNotes],
  );

  const updateCustomNote = useCallback(
    async (index: number, customNote: CustomNote) => {
      plugin.settings.customNotes[index] = customNote;
      await plugin.saveSettings();

      _setCustomNotes((value) => {
        const copy = [...value];
        copy[index] = customNote;
        return copy;
      });
    },
    [plugin, _setCustomNotes],
  );

  const moveCustomNote = useCallback(
    async (direction: "up" | "down", index: number) => {
      const newIndex = direction === "up" ? index - 1 : index + 1;
      const customNote = plugin.settings.customNotes[index];

      plugin.settings.customNotes.splice(index, 1);
      plugin.settings.customNotes.splice(newIndex, 0, customNote);

      await plugin.saveSettings();

      _setCustomNotes((value) => {
        const copy = [...value];
        copy.splice(index, 1);
        copy.splice(newIndex, 0, customNote);
        return copy;
      });
    },
    [plugin, _setCustomNotes],
  );

  const removeCustomNote = useCallback(
    async (index: number) => {
      plugin.settings.customNotes.splice(index, 1);

      await plugin.saveSettings();

      _setCustomNotes((value) => {
        const copy = [...value];
        copy.splice(index, 1);
        return copy;
      });
    },
    [plugin, _setCustomNotes],
  );

  const value = useMemo(
    () => ({
      customNotes,
      addCustomNote,
      updateCustomNote,
      moveCustomNote,
      removeCustomNote,
    }),
    [
      customNotes,
      addCustomNote,
      updateCustomNote,
      moveCustomNote,
      removeCustomNote,
    ],
  );

  return (
    <SettingsContext.Provider value={value}>
      {children}
    </SettingsContext.Provider>
  );
};

/**
 * Check for undefined since the defaultValue of the context is undefined. If
 * it's still undefined, the provider component is missing.
 */
export function useSettingsContext() {
  const context = useContext(SettingsContext);
  if (!context)
    throw new Error(
      "Provider for useSettingsContext() is missing! Make sure to use useSettingsContext() as child of <SettingsProvider>...</SettingsProvider>",
    );
  return context;
}
