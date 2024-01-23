import { App, PluginSettingTab } from "obsidian";
import { createElement } from "react";
import { createRoot, Root } from "react-dom/client";
import CreateTask from "../main";
import { ReactApp } from "./ReactApp";
import { CreateTaskSettings } from "./types";

export const DEFAULT_SETTINGS: CreateTaskSettings = {
  defaultNote: "",
  dateFormat: "@due(YYYY-MM-DD)",
  customNotes: [],
};

export class CreateTaskSettingTab extends PluginSettingTab {
  plugin: CreateTask;
  root: Root | null = null;

  constructor(app: App, plugin: CreateTask) {
    super(app, plugin);
    this.plugin = plugin;
  }

  display(): void {
    this.containerEl.empty();

    const reactRoot = this.containerEl.createDiv();

    this.root = createRoot(reactRoot);
    this.root.render(
      createElement(ReactApp, {
        plugin: this.plugin,
      }),
    );
  }

  hide() {
    this.root?.unmount();
  }
}
