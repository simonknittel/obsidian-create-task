import { parseDate } from "chrono-node";
import {
  App,
  ButtonComponent,
  ExtraButtonComponent,
  Modal,
  Notice,
  Plugin,
  PluginSettingTab,
  Setting,
  TextComponent,
  TFile,
} from "obsidian";

interface CreateTaskSettings {
  defaultNote: string;
  notes: Record<string, { name: string; path: string }>;
}

const DEFAULT_SETTINGS: CreateTaskSettings = {
  defaultNote: "",
  notes: {},
};

export default class CreateTask extends Plugin {
  settings: CreateTaskSettings;

  async onload() {
    await this.loadSettings();

    // This creates an icon in the left ribbon.
    this.addRibbonIcon("check-square", "Create Task", () => {
      // Called when the user clicks the icon.
      new CreateTaskModal(this.app, this).open();
    });

    // This adds a complex command that can check whether the current state of the app allows execution of the command
    this.addCommand({
      id: "open-modal",
      name: "Create",
      icon: "check-square",
      // This command will only show up in Command Palette when the check function returns true
      checkCallback: (checking: boolean) => {
        if (!this.settings.defaultNote) return false;

        // If checking is true, we're simply "checking" if the command can be run.
        // If checking is false, then we want to actually perform the operation.
        if (checking) return true;

        new CreateTaskModal(this.app, this).open();
      },
    });

    // This adds a settings tab so the user can configure various aspects of the plugin
    this.addSettingTab(new CreateTaskSettingTab(this.app, this));

    this.registerObsidianProtocolHandler("create-task", () => {
      new CreateTaskModal(this.app, this).open();
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

  async createTask(project: string, taskDescription: string, dueDate: string) {
    const str = this.compileLine(project, taskDescription, dueDate) + "\n";

    const file = this.app.vault.getAbstractFileByPath(
      this.settings.notes[project]?.path || this.settings.defaultNote,
    );

    if (!file || !(file instanceof TFile)) {
      new Notice("Create Task: Note not found");
      return;
    }

    await this.app.vault.append(file, str);

    new Notice("Create Task: Task created");
  }

  compileLine(project: string, taskDescription: string, dueDate: string) {
    let str = `- [ ]`;

    if (taskDescription) {
      str += ` ${taskDescription}`;
    } else {
      str += ` My task`;
    }

    if (project !== "default") {
      str += ` #${project}`;
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

class CreateTaskModal extends Modal {
  plugin: CreateTask;

  project: string;
  taskDescription: string;
  dueDate: string;

  previewElDescription: HTMLElement;
  previewElLine: HTMLElement;

  constructor(app: App, plugin: CreateTask) {
    super(app);
    this.plugin = plugin;
    this.project = "default";
  }

  onOpen() {
    const { contentEl } = this;

    contentEl.createEl("h1", { text: "Create Task" });

    new Setting(contentEl)
      .setName("📁 Target note")
      .setDesc("Corresponds to the notes added in the settings")
      .addDropdown((dropdown) => {
        dropdown.addOptions({
          default: "Default",
        });
        dropdown.setValue("default");

        for (const [key, { name }] of Object.entries(
          this.plugin.settings.notes,
        )) {
          dropdown.addOption(key, name);
        }

        dropdown.onChange((value) => {
          this.project = value;
          this.updatePreview();
        });
      });

    new Setting(contentEl)
      .setName("🖊️ Task description")
      .setDesc("Text of the task (required)")
      .addText((text) => {
        text.onChange((value) => {
          this.taskDescription = value;
          this.updatePreview();
        });

        text.setPlaceholder("My task");
      });

    new Setting(contentEl)
      .setName("📅 Due date")
      .setDesc("(optional)")
      .addText((text) => {
        text.onChange((value) => {
          this.dueDate = value;
          this.updatePreview();
        });
      });

    new Setting(contentEl).addButton((btn) =>
      btn
        .setButtonText("Submit")
        .setCta()
        .onClick(() => {
          if (!this.taskDescription) {
            new Notice("Create Task: A task description is required");
            return;
          }

          this.close();

          this.plugin.createTask(
            this.project,
            this.taskDescription,
            this.dueDate,
          );
        }),
    );

    contentEl.createEl("h2", { text: "Preview" });
    this.previewElDescription = contentEl.createEl("p");
    this.previewElLine = contentEl.createEl("code");
    this.updatePreview();
  }

  onClose() {
    const { contentEl } = this;
    contentEl.empty();
  }

  updatePreview() {
    let path = this.plugin.settings.notes[this.project]?.path;
    if (!path) path = this.plugin.settings.defaultNote;
    this.previewElDescription.setText(
      `The following line will get added to: ${path}`,
    );

    this.previewElLine.setText(
      this.plugin.compileLine(this.project, this.taskDescription, this.dueDate),
    );
  }
}

class CreateTaskSettingTab extends PluginSettingTab {
  plugin: CreateTask;

  newNoteKey: string;
  newNoteName: string;
  newNotePath: string;

  constructor(app: App, plugin: CreateTask) {
    super(app, plugin);
    this.plugin = plugin;
  }

  display(): void {
    const { containerEl } = this;

    containerEl.empty();

    new Setting(containerEl)
      .setName("Default note")
      .setDesc("Tasks will be added to this note if no other note is selected")
      .addText((text) => {
        text
          .setValue(this.plugin.settings.defaultNote)
          .onChange(async (value) => {
            this.plugin.settings.defaultNote = value;
            await this.plugin.saveSettings();
          });
      });

    containerEl.createEl("h2", {
      text: "Custom notes",
      cls: "create-task__settings__heading",
    });

    const notesTable = containerEl.createEl("table", {
      cls: "create-task__settings__table",
    });

    const notesThead = notesTable.createEl("thead");
    const notesTheadTr = notesThead.createEl("tr");
    notesTheadTr.createEl("th", { text: "Tag" });
    notesTheadTr.createEl("th", { text: "Name" });
    notesTheadTr.createEl("th", { text: "Path" });
    notesTheadTr.createEl("th");
    const notesTbody = notesTable.createEl("tbody");

    for (const [key, { name, path }] of Object.entries(
      this.plugin.settings.notes,
    )) {
      const noteTr = notesTbody.createEl("tr");

      let keyValue = key;
      let nameValue = name;
      let pathValue = path;

      const tagTd = noteTr.createEl("td");
      const tagTextComponent = new TextComponent(tagTd);
      tagTextComponent.setValue(key).onChange(async (value) => {
        keyValue = value.trim();
      });

      const nameTd = noteTr.createEl("td");
      const nameTextComponent = new TextComponent(nameTd);
      nameTextComponent.setValue(name).onChange(async (value) => {
        nameValue = value.trim();
      });

      const pathTd = noteTr.createEl("td");
      const pathTextComponent = new TextComponent(pathTd);
      pathTextComponent.setValue(path).onChange(async (value) => {
        pathValue = value.trim();
      });

      const actionsTd = noteTr.createEl("td");
      const deleteExtraButtonComponent = new ExtraButtonComponent(actionsTd);
      deleteExtraButtonComponent.setIcon("trash").onClick(async () => {
        delete this.plugin.settings.notes[key];
        await this.plugin.saveSettings();
        this.display();
      });
      const saveButtonComponent = new ButtonComponent(actionsTd);
      saveButtonComponent
        .setIcon("save")
        .setCta()
        .onClick(async () => {
          if (!keyValue || !nameValue || !pathValue) {
            new Notice("Create Task: All fields are required");
            return;
          }

          this.plugin.settings.notes[keyValue] = {
            name: nameValue,
            path: pathValue,
          };

          if (keyValue !== key) delete this.plugin.settings.notes[key];

          await this.plugin.saveSettings();
          this.display();
        });
    }

    containerEl.createEl("h2", {
      text: "Add custom note",
      cls: "create-task__settings__heading",
    });

    const addNoteTable = containerEl.createEl("table", {
      cls: "create-task__settings__table",
    });

    const addNoteThead = addNoteTable.createEl("thead");
    const addNoteTheadTr = addNoteThead.createEl("tr");
    addNoteTheadTr.createEl("th", { text: "Tag" });
    addNoteTheadTr.createEl("th", { text: "Name" });
    addNoteTheadTr.createEl("th", { text: "Path" });
    addNoteTheadTr.createEl("th");
    const addNoteTbody = addNoteTable.createEl("tbody");

    const addNoteTr = addNoteTbody.createEl("tr");

    const tagTd = addNoteTr.createEl("td");
    const tagTextComponent = new TextComponent(tagTd);
    tagTextComponent.setValue("").onChange(async (value) => {
      this.newNoteKey = value;
    });

    const nameTd = addNoteTr.createEl("td");
    const nameTextComponent = new TextComponent(nameTd);
    nameTextComponent.setValue("").onChange(async (value) => {
      this.newNoteName = value;
    });

    const pathTd = addNoteTr.createEl("td");
    const pathTextComponent = new TextComponent(pathTd);
    pathTextComponent.setValue("").onChange(async (value) => {
      this.newNotePath = value;
    });

    const addTd = addNoteTr.createEl("td");
    const addButtonComponent = new ButtonComponent(addTd);
    addButtonComponent
      .setIcon("save")
      .setCta()
      .onClick(async () => {
        if (!this.newNoteKey || !this.newNoteName || !this.newNotePath) {
          new Notice("Create Task: All fields are required");
          return;
        }

        this.plugin.settings.notes[this.newNoteKey] = {
          name: this.newNoteName,
          path: this.newNotePath,
        };

        await this.plugin.saveSettings();
        this.display();
      });

    const addNoteInfoTr = addNoteTbody.createEl("tr", {
      cls: "create-task__settings__info",
    });
    addNoteInfoTr.createEl("td", {
      text: "This tag will get added to the task.",
    });
    addNoteInfoTr.createEl("td", {
      text: "A custom display name for this note. This will only be used within the Create Task modal.",
    });
    addNoteInfoTr.createEl("td", { text: "The file path of this note." });
    addNoteInfoTr.createEl("td");
  }
}
