import { App, Modal, Notice, Setting } from "obsidian";
import CreateTask from "../main";

export class CreateTaskOnboardingModal extends Modal {
  plugin: CreateTask;

  constructor(app: App, plugin: CreateTask) {
    super(app);
    this.plugin = plugin;
  }

  onOpen() {
    const { contentEl } = this;

    contentEl.createEl("h1", { text: "Create Task: Onboarding" });

    let defaultNote: string;

    new Setting(contentEl)
      .setName("Default note")
      .setDesc(
        "Tasks will be added to this note if no other note is selected. This is required to use the plugin.",
      )
      .addText((text) => {
        text.setValue(this.plugin.settings.defaultNote).onChange((value) => {
          defaultNote = value;
        });
      });

    new Setting(contentEl).addButton((button) => {
      button
        .setCta()
        .setButtonText("Save")
        .onClick(async () => {
          if (!defaultNote) {
            new Notice("Create Task: You must set the Default note setting");
            return;
          }

          this.plugin.settings.defaultNote = defaultNote;
          await this.plugin.saveSettings();
          this.close();
          new Notice("Create Task: Onboarding complete");
        });
    });
  }

  onClose() {
    const { contentEl } = this;
    contentEl.empty();
  }
}
