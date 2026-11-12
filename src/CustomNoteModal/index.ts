import { App, Modal } from "obsidian";
import { createElement } from "react";
import { createRoot, Root } from "react-dom/client";
import { CustomNote } from "../settings/types";
import { ReactApp } from "./ReactApp";

export class CreateTaskCustomNoteModal extends Modal {
  customNote: CustomNote | undefined;
  onSave: (customNote: CustomNote) => Promise<void>;
  root: Root | null = null;

  /**
   * @param customNote The custom note to edit. Use `undefined` to add a new custom note.
   */
  constructor(
    app: App,
    customNote: CustomNote | undefined,
    onSave: (customNote: CustomNote) => Promise<void>,
  ) {
    super(app);
    this.customNote = customNote;
    this.onSave = onSave;
  }

  onOpen() {
    this.setTitle(this.customNote ? "Edit custom note" : "Add custom note");

    const reactRoot = this.contentEl.createDiv();
    this.root = createRoot(reactRoot);
    this.root.render(
      createElement(ReactApp, {
        app: this.app,
        customNote: this.customNote,
        onSave: async (customNote: CustomNote) => {
          await this.onSave(customNote);
          this.close();
        },
      }),
    );
  }

  onClose() {
    this.root?.unmount();
  }
}
