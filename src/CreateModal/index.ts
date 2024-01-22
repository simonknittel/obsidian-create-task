import { App, Modal } from "obsidian";
import { createElement } from "react";
import { createRoot, Root } from "react-dom/client";
import CreateTask from "../main";
import { ReactApp } from "./ReactApp";

export type InitialValues =
  | {
      notePath: string | undefined;
      taskDescription: string | undefined;
      dueDate: string | undefined;
    }
  | undefined;

export class CreateTaskCreateModal extends Modal {
  plugin: CreateTask;
  root: Root | null = null;
  initialValues: InitialValues;

  constructor(app: App, plugin: CreateTask, initialValues: InitialValues) {
    super(app);
    this.plugin = plugin;
    this.initialValues = initialValues;
  }

  onOpen() {
    const { contentEl } = this;

    const reactRoot = contentEl.createDiv();
    this.root = createRoot(reactRoot);
    this.root.render(
      createElement(ReactApp, {
        plugin: this.plugin,
        createModal: this,
        initialValues: this.initialValues,
      }),
    );
  }

  onClose() {
    this.root?.unmount();
  }
}
