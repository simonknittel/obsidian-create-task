import { App, Modal } from "obsidian";
import { createElement } from "react";
import { Root, createRoot } from "react-dom/client";
import CreateTask from "../main";
import { ReactApp } from "./ReactApp";

export class CreateTaskChangelogModal extends Modal {
  plugin: CreateTask;
  lastChangelog?: string;
  root: Root | null = null;

  constructor(app: App, plugin: CreateTask, lastChangelog?: string) {
    super(app);
    this.plugin = plugin;
    this.lastChangelog = lastChangelog;
  }

  onOpen() {
    const { contentEl } = this;

    const reactRoot = contentEl.createDiv();
    this.root = createRoot(reactRoot);
    this.root.render(
      createElement(ReactApp, {
        plugin: this.plugin,
        changelogModal: this,
        lastChangelog: this.lastChangelog,
      }),
    );
  }

  onClose() {
    this.root?.unmount();
  }
}
