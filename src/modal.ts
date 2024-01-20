import { App, Modal, Notice, Setting } from "obsidian";
import CreateTask from "./main";

export class CreateTaskModal extends Modal {
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
