import { parseDate } from "chrono-node";
import { Notice, Plugin } from "obsidian";
import { gte } from "semver";
import { CreateTaskChangelogModal } from "./ChangelogModal";
import { CreateTaskCreateModal } from "./CreateModal";
import { CreateTaskOnboardingModal } from "./OnboardingModal";
import { CreateTaskSettingTab, DEFAULT_SETTINGS } from "./settings";
import { CreateTaskSettings } from "./settings/types";

export default class CreateTask extends Plugin {
  settings!: CreateTaskSettings;

  async onload() {
    await this.loadSettings();

    this.addRibbonIcon("check-square", "Create Task", () => {
      this.openCreateModal();
    });

    this.addCommand({
      id: "open-modal",
      name: "Create",
      icon: "check-square",
      callback: () => {
        this.openCreateModal();
      },
    });

    this.addCommand({
      id: "open-changelog",
      name: "Changelog",
      icon: "package-plus",
      callback: () => {
        this.openChangelogModal();
      },
    });

    this.addCommand({
      id: "open-settings",
      name: "Settings",
      icon: "settings",
      checkCallback: (checking) => {
        if (!this.app.setting?.open || !this.app.setting.openTabById)
          return false;

        if (!checking) this.openSettings();
        return true;
      },
    });

    this.addSettingTab(new CreateTaskSettingTab(this.app, this));

    this.registerObsidianProtocolHandler("create-task", (params) => {
      if (
        params["create"] === "true" &&
        params["note-path"] &&
        this.app.vault.getFileByPath(params["note-path"])
      ) {
        void this.createTask(
          params["note-path"],
          params["task-description"] ?? "",
          params["due-date"] ?? "",
          params["task-details"] ?? "",
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

    this.app.workspace.onLayoutReady(() => void this.changelogModal());
  }

  onUserEnable() {
    if (this.settings.defaultNote) return;

    this.openOnboardingModal();
  }

  async changelogModal() {
    const lastChangelog = this.settings.lastChangelog || "1.3.5"; // Changelog detection was added in 1.4.0
    if (gte(lastChangelog, this.manifest.version)) return;
    this.settings.lastChangelog = this.manifest.version;
    await this.saveSettings(true);

    if (this.settings.disableChangelog) return;

    this.openChangelogModal(lastChangelog);
  }

  openChangelogModal(lastChangelog?: string) {
    new CreateTaskChangelogModal(this.app, this, lastChangelog).open();
  }

  onunload() {}

  async loadSettings() {
    const data = (await this.loadData()) as Partial<CreateTaskSettings> | null;

    this.settings = Object.assign({}, DEFAULT_SETTINGS, data);

    // Without data.json, this is a fresh install and not an update
    if (!data) this.settings.lastChangelog = this.manifest.version;
  }

  async saveSettings(skipNotice = false) {
    await this.saveData(this.settings);

    if (skipNotice) return;
    new Notice("Create Task: Settings saved");
  }

  openCreateModal() {
    if (!this.settings.defaultNote) {
      new Notice("Create Task: You must set the default note setting");
      this.openOnboardingModal();
      return;
    }

    new CreateTaskCreateModal(this.app, this, undefined).open();
  }

  openOnboardingModal() {
    new CreateTaskOnboardingModal(this.app, this).open();
  }

  openSettings() {
    this.app.setting?.open?.();
    this.app.setting?.openTabById?.(this.manifest.id);
  }

  async createTask(
    customNoteIndexOrNotePath: string | number,
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
      if (!customNote) {
        new Notice("Create Task: Note not found");
        return;
      }

      path = customNote.path;

      str =
        this.compileLine(
          customNote.tag,
          taskDescription,
          dueDate,
          taskDetails,
        ) + "\n";
    }

    const file = this.app.vault.getFileByPath(path);
    if (!file) {
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
      const parsedDate = parseDate(dueDate, undefined, {
        forwardDate: true,
      });

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
