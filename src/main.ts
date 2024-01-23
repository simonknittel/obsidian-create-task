import { parseDate } from "chrono-node";
import { Notice, Plugin, TFile } from "obsidian";
import { CreateTaskCreateModal } from "./CreateModal";
import { CreateTaskOnboardingModal } from "./OnboardingModal";
import { CreateTaskSettingTab, DEFAULT_SETTINGS } from "./settings";
import { CreateTaskSettings } from "./settings/types";

export default class CreateTask extends Plugin {
  settings: CreateTaskSettings;

  async onload() {
    await this.loadSettings();

    this.addRibbonIcon("check-square", "Create Task", () => {
      this.openModal();
    });

    this.addCommand({
      id: "open-modal",
      name: "Create",
      icon: "check-square",
      callback: () => {
        this.openModal();
      },
    });

    this.addCommand({
      id: "open-settings",
      name: "Open settings",
      icon: "settings",
      checkCallback: (checking) => {
        // Make sure this.app.setting is available since it's an undocumented/internal API
        // @ts-ignore
        if (checking && this.app.setting?.open && this.app.setting?.openTabById)
          return true;

        this.openSettings();
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
          params["task-details"],
        );
      } else {
        new CreateTaskCreateModal(this.app, this, {
          notePath: params["note-path"],
          taskDescription: params["task-description"],
          dueDate: params["due-date"],
          taskDetails: params["task-details"],
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

  openModal() {
    if (!this.settings.defaultNote) {
      new Notice("Create Task: You must set the Default note setting");
      new CreateTaskOnboardingModal(this.app, this).open();
      return;
    }

    new CreateTaskCreateModal(this.app, this, undefined).open();
  }

  openSettings() {
    // @ts-ignore
    this.app.setting.open?.();
    // @ts-ignore
    this.app.setting.openTabById?.(this.manifest.id);
  }

  async createTask(
    customNoteIndexOrNotePath: "default" | string | number,
    taskDescription: string,
    dueDate: string,
    taskDetails: string,
  ) {
    let path: string;
    let str: string;

    if (customNoteIndexOrNotePath === "default") {
      path = this.settings.defaultNote;

      str =
        this.compileLine(undefined, taskDescription, dueDate, taskDetails) +
        "\n";
    } else if (typeof customNoteIndexOrNotePath === "string") {
      path = customNoteIndexOrNotePath;

      str =
        this.compileLine(undefined, taskDescription, dueDate, taskDetails) +
        "\n";
    } else {
      const customNote = this.settings.customNotes[customNoteIndexOrNotePath];

      path = customNote.path;

      str =
        this.compileLine(
          customNote.tag,
          taskDescription,
          dueDate,
          taskDetails,
        ) + "\n";
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
    taskDetails: string,
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
        const format = this.settings.dateFormat || "@due(YYYY-MM-DD)";
        const dateString = `${parsedDate.getFullYear()}-${(parsedDate.getMonth() + 1).toString().padStart(2, "0")}-${parsedDate.getDate().toString().padStart(2, "0")}`;
        str += ` ${format.replace("YYYY-MM-DD", dateString)}`;
      }
    }

    if (taskDetails) {
      str += `\n\t- ${taskDetails.replace(/\n/g, "\n\t- ")}`;
    }

    return str;
  }
}
