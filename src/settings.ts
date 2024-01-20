import {
  App,
  ButtonComponent,
  ExtraButtonComponent,
  Notice,
  PluginSettingTab,
  Setting,
  TextComponent,
} from "obsidian";
import CreateTask from "./main";

export interface CreateTaskSettings {
  defaultNote: string;
  notes: Record<string, { name: string; path: string }>;
}

export const DEFAULT_SETTINGS: CreateTaskSettings = {
  defaultNote: "",
  notes: {},
};

export class CreateTaskSettingTab extends PluginSettingTab {
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
