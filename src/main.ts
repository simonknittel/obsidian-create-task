import { parseDate } from "chrono-node";
import { Notice, Plugin, TFile } from "obsidian";
import { CreateTaskModal } from "./modal";
import { CreateTaskSettingTab, DEFAULT_SETTINGS } from "./settings";
import { CreateTaskSettings } from "./settings/types";

export default class CreateTask extends Plugin {
  settings: CreateTaskSettings;

  async onload() {
    await this.loadSettings();

    this.addRibbonIcon("check-square", "Create Task", () => {
      new CreateTaskModal(this.app, this, undefined).open();
    });

    this.addCommand({
      id: "open-modal",
      name: "Create",
      icon: "check-square",
      checkCallback: (checking) => {
        if (!this.settings.defaultNote) return false;

        if (checking) return true;

        new CreateTaskModal(this.app, this, undefined).open();
      },
    });

    this.addCommand({
      id: "open-settings",
      name: "Open settings",
      icon: "settings",
      checkCallback: (checking) => {
        // @ts-ignore
        if (checking && this.app.setting?.open && this.app.setting?.openTabById)
          return true;

        // @ts-ignore
        this.app.setting.open();
        // @ts-ignore
        this.app.setting.openTabById?.(this.manifest.id);
      },
    });

    this.addSettingTab(new CreateTaskSettingTab(this.app, this));

    this.registerObsidianProtocolHandler("create-task", (params) => {
      if (
        params["create"] === "true" &&
        params["note-path"] &&
        this.app.vault.getAbstractFileByPath(params["note-path"])
      ) {
        this.createTask(
          params["note-path"],
          params["task-description"],
          params["due-date"],
        );
      } else {
        new CreateTaskModal(this.app, this, {
          notePath: params["note-path"],
          taskDescription: params["task-description"],
          dueDate: params["due-date"],
        }).open();
      }
    });
  }

  onunload() {}

  async loadSettings() {
    this.settings = Object.assign({}, DEFAULT_SETTINGS, await this.loadData());
  }

  async saveSettings() {
    await this.saveData(this.settings);
    new Notice("Create Task: Settings saved");
  }

  async createTask(
    customNoteIndex: "default" | string | number,
    taskDescription: string,
    dueDate: string,
  ) {
    let path: string;
    let str: string;

    if (customNoteIndex === "default") {
      path = this.settings.defaultNote;

      str = this.compileLine(undefined, taskDescription, dueDate) + "\n";
    } else if (typeof customNoteIndex === "string") {
      path = customNoteIndex;

      str = this.compileLine(undefined, taskDescription, dueDate) + "\n";
    } else {
      const customNote = this.settings.customNotes[customNoteIndex];

      path = customNote.path;

      str = this.compileLine(customNote.tag, taskDescription, dueDate) + "\n";
    }

    const file = this.app.vault.getAbstractFileByPath(path);

    if (!file || !(file instanceof TFile)) {
      new Notice("Create Task: Note not found");
      return;
    }

    await this.app.vault.append(file, str);

    new Notice("Create Task: Task created");
  }

  compileLine(
    tag: string | undefined,
    taskDescription: string,
    dueDate: string,
  ) {
    let str = `- [ ]`;

    if (taskDescription) {
      str += ` ${taskDescription}`;
    } else {
      str += ` My task`;
    }

    if (tag) {
      str += ` #${tag}`;
    }

    if (dueDate) {
      const parsedDate = parseDate(dueDate);
      if (parsedDate) {
        str += ` @due(${parsedDate.getFullYear()}-${(parsedDate.getMonth() + 1).toString().padStart(2, "0")}-${parsedDate.getDate().toString().padStart(2, "0")})`;
      }
    }

    return str;
  }
}
