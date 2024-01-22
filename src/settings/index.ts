import { App, PluginSettingTab, Setting } from "obsidian";
import { createElement } from "react";
import { createRoot } from "react-dom/client";
import CreateTask from "../main";
import { ReactApp } from "./ReactApp";
import { CreateTaskSettings } from "./types";

export const DEFAULT_SETTINGS: CreateTaskSettings = {
  defaultNote: "",
  customNotes: [],
};

export class CreateTaskSettingTab extends PluginSettingTab {
  plugin: CreateTask;

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

    const reactRoot = containerEl.createDiv();
    const root = createRoot(reactRoot);
    root.render(
      createElement(ReactApp, {
        plugin: this.plugin,
      }),
    );
  }
}