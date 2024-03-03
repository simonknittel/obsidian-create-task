import clsx from "clsx";
import { StrictMode } from "react";
import { gt } from "semver";
import CreateTask from "src/main";
import { CreateTaskChangelogModal } from ".";
import { Heading } from "./Heading";
import { ObsidianProvider } from "./ObsidianContext";

type Props = Readonly<{
  plugin: CreateTask;
  changelogModal: CreateTaskChangelogModal;
  lastChangelog?: string;
}>;

export const ReactApp = ({ plugin, changelogModal, lastChangelog }: Props) => {
  return (
    <StrictMode>
      <ObsidianProvider plugin={plugin} changelogModal={changelogModal}>
        <div className="create-task__changelog-modal">
          <Heading />

          <section>
            <article
              className={clsx("create-task__changelog-modal-release", {
                "create-task__changelog-modal-release--new":
                  lastChangelog && gt("1.4.0", lastChangelog),
              })}
            >
              <h2>1.4.0</h2>

              <ul>
                <li>
                  The due date input now suggests you some values on focus.
                  <img
                    src="https://raw.githubusercontent.com/simonknittel/obsidian-create-task/main/src/ChangelogModal/assets/1-4-0_suggestions.png"
                    alt=""
                  />
                </li>
                <li>
                  The due date input now provides you with a date picker.
                  <img
                    src="https://raw.githubusercontent.com/simonknittel/obsidian-create-task/main/src/ChangelogModal/assets/1-4-0_date-picker.png"
                    alt=""
                  />
                </li>
                <li>
                  Starting with this release, this modal with the latest
                  changelog will be shown after an update. You can disable this
                  in the settings.
                </li>
              </ul>
            </article>

            <article
              className={clsx("create-task__changelog-modal-release", {
                "create-task__changelog-modal-release--new":
                  lastChangelog && gt("1.3.5", lastChangelog),
              })}
            >
              <h2>1.3.5</h2>

              <ul>
                <li>
                  This release only upgrades dependencies. There are not changes
                  for users of this plugin.
                </li>
              </ul>
            </article>

            <article
              className={clsx("create-task__changelog-modal-release", {
                "create-task__changelog-modal-release--new":
                  lastChangelog && gt("1.3.4", lastChangelog),
              })}
            >
              <h2>1.3.4</h2>

              <ul>
                <li>Fix authorUrl in manifest.json</li>
              </ul>
            </article>

            <article
              className={clsx("create-task__changelog-modal-release", {
                "create-task__changelog-modal-release--new":
                  lastChangelog && gt("1.3.3", lastChangelog),
              })}
            >
              <h2>1.3.3</h2>

              <ul>
                <li>Improve description</li>
              </ul>
            </article>

            <article
              className={clsx("create-task__changelog-modal-release", {
                "create-task__changelog-modal-release--new":
                  lastChangelog && gt("1.3.2", lastChangelog),
              })}
            >
              <h2>1.3.2</h2>

              <ul>
                <li>
                  Show onboarding after enabling the plugin for the first time
                </li>
              </ul>
            </article>

            <article
              className={clsx("create-task__changelog-modal-release", {
                "create-task__changelog-modal-release--new":
                  lastChangelog && gt("1.3.1", lastChangelog),
              })}
            >
              <h2>1.3.1</h2>

              <ul>
                <li>
                  Improved error handling if files are configured incorrectly
                </li>
                <li>
                  Added example for configuring a homescreen shortcut on Android
                  to the documentation
                </li>
                <li>
                  Using natural language for the due date now only suggest
                  future dates
                </li>
              </ul>
            </article>

            <article
              className={clsx("create-task__changelog-modal-release", {
                "create-task__changelog-modal-release--new":
                  lastChangelog && gt("1.3.0", lastChangelog),
              })}
            >
              <h2>1.3.0</h2>

              <ul>
                <li>
                  When a default note wasn't set yet, you'll now be provided
                  with an onboarding
                </li>
                <li>Custom notes are now sortable</li>
                <li>UX of create modal and settings tab got improved</li>
                <li>You can now add additional details to your task</li>
                <li>
                  You can now choose between three date formats for the due date
                </li>
                <li>Docs got improved</li>
              </ul>
            </article>

            <article
              className={clsx("create-task__changelog-modal-release", {
                "create-task__changelog-modal-release--new":
                  lastChangelog && gt("1.2.0", lastChangelog),
              })}
            >
              <h2>1.2.0</h2>

              <ul>
                <li>You can now use parameters with the URL scheme</li>
                <li>Improved rendering/focus handling in the settings view</li>
              </ul>
            </article>

            <article
              className={clsx("create-task__changelog-modal-release", {
                "create-task__changelog-modal-release--new":
                  lastChangelog && gt("1.1.0", lastChangelog),
              })}
            >
              <h2>1.1.0</h2>

              <ul>
                <li>
                  Tags are now optional (closes{" "}
                  <a href="https://github.com/simonknittel/obsidian-create-task/issues/5">
                    Issue #5
                  </a>
                  )
                </li>
              </ul>
            </article>

            <article
              className={clsx("create-task__changelog-modal-release", {
                "create-task__changelog-modal-release--new":
                  lastChangelog && gt("1.0.0", lastChangelog),
              })}
            >
              <h2>1.0.0</h2>

              <ul>
                <li>Initial release</li>
              </ul>
            </article>
          </section>

          <div className="create-task__changelog-modal-actions">
            <button
              type="button"
              onClick={() => {
                plugin.settings.disableChangelog = true;
                plugin.saveSettings();
                changelogModal.close();
              }}
            >
              Close and never show again
            </button>
            <button
              type="button"
              onClick={() => changelogModal.close()}
              className="mod-cta"
            >
              Close
            </button>
          </div>
        </div>
      </ObsidianProvider>
    </StrictMode>
  );
};
