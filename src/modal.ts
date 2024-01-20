import { App, Modal, Notice, Setting } from "obsidian";
import CreateTask from "./main";

export class CreateTaskModal extends Modal {
  plugin: CreateTask;

  customNoteIndex: "default" | number;
  taskDescription: string;
  dueDate: string;

  previewElDescription: HTMLElement;
  previewElLine: HTMLElement;

  constructor(app: App, plugin: CreateTask) {
    super(app);
    this.plugin = plugin;
    this.customNoteIndex = "default";
  }

  onOpen() {
    const { contentEl } = this;

    contentEl.createEl("h1", { text: "Create Task" });

    new Setting(contentEl)
      .setName("📁 Target note")
      .setDesc("Corresponds to the custom notes added in the settings")
      .addDropdown((dropdown) => {
        dropdown.addOption("default", "Default");
        dropdown.setValue("default");

        for (const [
          index,
          customNote,
        ] of this.plugin.settings.customNotes.entries()) {
          dropdown.addOption(index.toString(), customNote.name);
        }

        dropdown.onChange((value) => {
          this.customNoteIndex = value === "default" ? value : parseInt(value);
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
            this.customNoteIndex,
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
    if (this.customNoteIndex === "default") {
      this.previewElDescription.setText(
        `The following line will get added to: ${this.plugin.settings.defaultNote}`,
      );

      this.previewElLine.setText(
        this.plugin.compileLine(undefined, this.taskDescription, this.dueDate),
      );
    } else {
      const customNote = this.plugin.settings.customNotes[this.customNoteIndex];

      this.previewElDescription.setText(
        `The following line will get added to: ${customNote.path}`,
      );

      this.previewElLine.setText(
        this.plugin.compileLine(
          customNote.tag,
          this.taskDescription,
          this.dueDate,
        ),
      );
    }
  }
}
