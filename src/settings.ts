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
  customNotes: { name: string; path: string; tag: string }[];
}

export const DEFAULT_SETTINGS: CreateTaskSettings = {
  defaultNote: "",
  customNotes: [],
};

export class CreateTaskSettingTab extends PluginSettingTab {
  plugin: CreateTask;

  newNoteTag: string;
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
      text: "Add custom note",
      cls: "create-task__settings__heading",
    });

    const addNoteTable = containerEl.createEl("table", {
      cls: "create-task__settings__table",
    });

    const addNoteThead = addNoteTable.createEl("thead");
    const addNoteTheadTr = addNoteThead.createEl("tr");
    addNoteTheadTr.createEl("th", { text: "Path" });
    addNoteTheadTr.createEl("th", { text: "Name" });
    addNoteTheadTr.createEl("th", { text: "Tag (optional)" });
    addNoteTheadTr.createEl("th");
    const addNoteTbody = addNoteTable.createEl("tbody");

    const addNoteTr = addNoteTbody.createEl("tr");

    const pathTd = addNoteTr.createEl("td");
    const pathTextComponent = new TextComponent(pathTd);
    pathTextComponent.setValue("").onChange(async (value) => {
      this.newNotePath = value;
    });

    const nameTd = addNoteTr.createEl("td");
    const nameTextComponent = new TextComponent(nameTd);
    nameTextComponent.setValue("").onChange(async (value) => {
      this.newNoteName = value;
    });

    const tagTd = addNoteTr.createEl("td");
    const tagTextComponent = new TextComponent(tagTd);
    tagTextComponent.setValue("").onChange(async (value) => {
      this.newNoteTag = value;
    });

    const addTd = addNoteTr.createEl("td");
    const addButtonComponent = new ButtonComponent(addTd);
    addButtonComponent
      .setIcon("save")
      .setCta()
      .onClick(async () => {
        if (!this.newNoteName || !this.newNotePath) {
          new Notice("Create Task: Path and Name are required");
          return;
        }

        this.plugin.settings.customNotes.push({
          name: this.newNoteName,
          path: this.newNotePath,
          tag: this.newNoteTag,
        });

        await this.plugin.saveSettings();

        /**
         * Re-render custom notes table
         */
        notesTable.removeChild(notesTbody);
        notesTbody = this.renderAllCustomNotes();
        notesTable.appendChild(notesTbody);

        /**
         * Reset form
         */
        this.newNotePath = "";
        this.newNoteName = "";
        this.newNoteTag = "";
        pathTextComponent.setValue(this.newNotePath);
        nameTextComponent.setValue(this.newNoteName);
        tagTextComponent.setValue(this.newNoteTag);

        /**
         * Refocus path input
         */
        pathTextComponent.inputEl.focus();
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

    containerEl.createEl("h2", {
      text: "Custom notes",
      cls: "create-task__settings__heading",
    });

    const notesTable = containerEl.createEl("table", {
      cls: "create-task__settings__table",
    });

    const notesThead = notesTable.createEl("thead");
    const notesTheadTr = notesThead.createEl("tr");
    notesTheadTr.createEl("th", { text: "Path" });
    notesTheadTr.createEl("th", { text: "Name" });
    notesTheadTr.createEl("th", { text: "Tag (optional)" });
    notesTheadTr.createEl("th");

    let notesTbody = this.renderAllCustomNotes();
    notesTable.appendChild(notesTbody);
  }

  renderAllCustomNotes() {
    const notesTbody = createEl("tbody");

    for (const customNote of this.plugin.settings.customNotes) {
      const noteTr = notesTbody.createEl("tr");

      let tagValue = customNote.tag;
      let nameValue = customNote.name;
      let pathValue = customNote.path;

      const pathTd = noteTr.createEl("td");
      const pathTextComponent = new TextComponent(pathTd);
      pathTextComponent.setValue(customNote.path).onChange(async (value) => {
        pathValue = value.trim();
      });

      const nameTd = noteTr.createEl("td");
      const nameTextComponent = new TextComponent(nameTd);
      nameTextComponent.setValue(customNote.name).onChange(async (value) => {
        nameValue = value.trim();
      });

      const tagTd = noteTr.createEl("td");
      const tagTextComponent = new TextComponent(tagTd);
      tagTextComponent.setValue(customNote.tag).onChange(async (value) => {
        tagValue = value.trim();
      });

      const actionsTd = noteTr.createEl("td");
      const deleteExtraButtonComponent = new ExtraButtonComponent(actionsTd);
      deleteExtraButtonComponent.setIcon("trash").onClick(async () => {
        const index = this.plugin.settings.customNotes.findIndex(
          (note) => note === customNote,
        );
        this.plugin.settings.customNotes.splice(index, 1);

        await this.plugin.saveSettings();

        notesTbody.removeChild(noteTr);
      });
      const saveButtonComponent = new ButtonComponent(actionsTd);
      saveButtonComponent
        .setIcon("save")
        .setCta()
        .onClick(async () => {
          if (!nameValue || !pathValue) {
            new Notice("Create Task: Path and Name are required");
            return;
          }

          const index = this.plugin.settings.customNotes.findIndex(
            (note) => note === customNote,
          );

          this.plugin.settings.customNotes[index] = {
            name: nameValue,
            path: pathValue,
            tag: tagValue,
          };

          await this.plugin.saveSettings();
        });
    }

    return notesTbody;
  }
}
