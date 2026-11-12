import { App, PluginSettingTab, SettingDefinitionItem } from "obsidian";
import { CreateTaskCustomNoteModal } from "../CustomNoteModal";
import CreateTask from "../main";
import { CreateTaskSettings, CustomNote } from "./types";

export const DEFAULT_SETTINGS: CreateTaskSettings = {
  defaultNote: "",
  dateFormat: "@due(YYYY-MM-DD)",
  customNotes: [],
};

const DATE_FORMATS = {
  "@due(YYYY-MM-DD)": "CardBoard: @due(YYYY-MM-DD)",
  "📅 YYYY-MM-DD": "Tasks: 📅 YYYY-MM-DD",
  "[due:: YYYY-MM-DD]": "Dataview: [due:: YYYY-MM-DD]",
};

const DOCUMENTATION_URL =
  "https://github.com/simonknittel/obsidian-create-task?tab=readme-ov-file#create-task";

const BUY_ME_A_COFFEE_URL = "https://buymeacoffee.com/simonknittel";

export class CreateTaskSettingTab extends PluginSettingTab {
  plugin: CreateTask;

  constructor(app: App, plugin: CreateTask) {
    super(app, plugin);
    this.plugin = plugin;
  }

  getSettingDefinitions(): SettingDefinitionItem<keyof CreateTaskSettings>[] {
    return [
      {
        name: "Default note",
        desc: "Tasks will be added to this note if no other note is selected. This is required to use the plugin.",
        control: {
          type: "file",
          key: "defaultNote",
          filter: (file) => file.extension === "md",
          validate: (value) => {
            if (!value) return "This field is required.";
            if (!this.app.vault.getFileByPath(value))
              return "This file doesn't exist.";
            return undefined;
          },
        },
      },
      {
        name: "Date format",
        desc: "You can choose different date formats depending on which plugins you use.",
        control: {
          type: "dropdown",
          key: "dateFormat",
          defaultValue: DEFAULT_SETTINGS.dateFormat,
          options: DATE_FORMATS,
        },
      },
      {
        name: "Disable changelog",
        desc: "Enable this to prevent the changelog from showing after an update.",
        control: { type: "toggle", key: "disableChangelog" },
      },
      {
        type: "list",
        heading: "Custom notes",
        emptyState: "No custom notes yet.",
        addItem: {
          name: "Add custom note",
          action: () => this.openCustomNoteModal(undefined),
        },
        onReorder: (oldIndex, newIndex) =>
          void this.moveCustomNote(oldIndex, newIndex),
        onDelete: (index) => void this.removeCustomNote(index),
        items: this.plugin.settings.customNotes.map((customNote) => ({
          name: customNote.name,
          desc: customNote.tag
            ? `${customNote.path} · #${customNote.tag}`
            : customNote.path,
          searchable: false,
          action: (_element, index) => this.openCustomNoteModal(index),
        })),
      },
      {
        type: "group",
        heading: "About",
        items: [
          {
            name: "Documentation",
            action: () => window.open(DOCUMENTATION_URL),
          },
          {
            name: "Changelog",
            action: () => this.plugin.openChangelogModal(),
          },
          {
            name: "Buy Me A Coffee",
            action: () => window.open(BUY_ME_A_COFFEE_URL),
          },
        ],
      },
    ];
  }

  private openCustomNoteModal(index: number | undefined) {
    const customNote =
      index === undefined ? undefined : this.plugin.settings.customNotes[index];

    new CreateTaskCustomNoteModal(this.app, customNote, (newCustomNote) =>
      this.saveCustomNote(index, newCustomNote),
    ).open();
  }

  private async saveCustomNote(
    index: number | undefined,
    customNote: CustomNote,
  ) {
    if (index === undefined) {
      this.plugin.settings.customNotes.push(customNote);
    } else {
      this.plugin.settings.customNotes[index] = customNote;
    }

    await this.plugin.saveSettings(true);
    this.update();
  }

  private async moveCustomNote(oldIndex: number, newIndex: number) {
    const [customNote] = this.plugin.settings.customNotes.splice(oldIndex, 1);
    if (!customNote) return;

    this.plugin.settings.customNotes.splice(newIndex, 0, customNote);
    await this.plugin.saveSettings(true);

    // Obsidian 1.15.0 keeps the old row positions after a drag, which gives
    // wrong indices to the edit and delete callbacks until the next update().
    this.update();
  }

  private async removeCustomNote(index: number) {
    this.plugin.settings.customNotes.splice(index, 1);
    await this.plugin.saveSettings(true);
    this.update();
  }
}
