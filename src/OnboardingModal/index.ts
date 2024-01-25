import { App, Modal } from "obsidian";
import { createElement } from "react";
import { createRoot, Root } from "react-dom/client";
import CreateTask from "../main";
import { ReactApp } from "./ReactApp";

export class CreateTaskOnboardingModal extends Modal {
  plugin: CreateTask;
  root: Root | null = null;

  constructor(app: App, plugin: CreateTask) {
    super(app);
    this.plugin = plugin;
  }

  onOpen() {
    const { contentEl } = this;

    const reactRoot = contentEl.createDiv();
    this.root = createRoot(reactRoot);
    this.root.render(
      createElement(ReactApp, {
        plugin: this.plugin,
        onboardingModal: this,
      }),
    );
  }

  onClose() {
    this.root?.unmount();
  }
}
