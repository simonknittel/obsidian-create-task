import { App, Modal, Notice, Setting } from "obsidian";
import CreateTask from "./main";

type InitialValues =
  | {
      notePath: string | undefined;
      taskDescription: string | undefined;
      dueDate: string | undefined;
    }
  | undefined;

export class CreateTaskModal extends Modal {
  plugin: CreateTask;

  customNoteIndex: "default" | number;
  notePath: string;
  taskDescription: string;
  dueDate: string;

  previewElDescription: HTMLElement;
  previewElLine: HTMLElement;

  initialValues: InitialValues;

  constructor(app: App, plugin: CreateTask, initialValues: InitialValues) {
    super(app);
    this.plugin = plugin;

    if (initialValues?.notePath) {
      this.notePath = initialValues.notePath;
    } else {
      this.customNoteIndex = "default";
    }

    this.taskDescription = initialValues?.taskDescription || "";
    this.dueDate = initialValues?.dueDate || "";
  }

  onOpen() {
    const { contentEl } = this;

    contentEl.createEl("h1", { text: "Create task" });

    if (this.notePath) {
      new Setting(contentEl)
        .setName("📁 Target note")
        .setDesc("Corresponds to the custom notes added in the settings")
        .addText((text) => {
          text.setValue(this.notePath);
          text.setDisabled(true);
        });
    } else {
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
            this.customNoteIndex =
              value === "default" ? value : parseInt(value);
            this.updatePreview();
          });
        });
    }

    new Setting(contentEl)
      .setName("🖊️ Task description")
      .setDesc("Text of the task (required)")
      .addText((text) => {
        text.onChange((value) => {
          this.taskDescription = value;
          this.updatePreview();
        });

        text.setPlaceholder("My task");
        text.setValue(this.taskDescription);
      });

    new Setting(contentEl)
      .setName("📅 Due date")
      .setDesc("(optional)")
      .addText((text) => {
        text.onChange((value) => {
          this.dueDate = value;
          this.updatePreview();
        });

        text.setValue(this.dueDate);
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
    if (this.notePath) {
      this.previewElDescription.setText(
        `The following line will get added to: ${this.notePath}`,
      );

      this.previewElLine.setText(
        this.plugin.compileLine(undefined, this.taskDescription, this.dueDate),
      );
    } else if (this.customNoteIndex === "default") {
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
