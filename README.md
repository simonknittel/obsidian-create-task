<div style="text-align: center;">
  <h1>Create Task</h1>

  <p>Faster creation of tasks in Obsidian.</p>

<a href="#install">Install</a> • <a href="#usage">Usage</a> • <a href="#contributing">Contributing</a> • <a href="#contributing">Contributing</a>

  <div style="display: flex; gap: 1em; justify-content: center;">
    <a href="https://github.com/simonknittel/obsidian-create-task/blob/main/docs/new-task.png" style="display: block;">
      <img src="https://github.com/simonknittel/obsidian-create-task/blob/main/docs/new-task.png?raw=true" height="240">
    </a>

    <a href="https://github.com/simonknittel/obsidian-create-task/blob/main/docs/settings.png" style="display: block;">
      <img src="https://github.com/simonknittel/obsidian-create-task/blob/main/docs/settings.png?raw=true" height="240">
    </a>

  </div>
</div>

## Install

1. Download the [latest release](https://github.com/simonknittel/obsidian-create-task/releases/latest/download/obsidian-create-task.zip)
2. Extract the `.zip` file
3. Move the extracted directory into your vault's plugin directory (`.obsidian/plugins/`)
4. Restart Obsidian
5. Enable the plugin

## Usage

- Save tasks to multiple notes
- Add a tag to a task depending on the note
- Add a due date to a task using [natural language](https://github.com/wanasit/chrono)
- Create a new task using `Ctrl + P`
- Create a new task using the ribbon menu
- Create a new task using the [URL scheme standard](https://help.obsidian.md/Extending+Obsidian/Obsidian+URI)
  - This will open Obsidian and open the Create task modal: `obsidian://create-task`
  - You can use parameters to pre-fill the individual modal inputs
    - This pre-fills the Target note input: `note-path=Unsorted%20TODOs.md`
    - This pre-fills the Task description input: `task-description=Do%20stuff`
    - This pre-fills the Due date input: `due-date=tomorrow`
    - This will skip the modal and immediately create the task in the specified note: `create=true`

## Contributing

1. Install Bun
2. `bun install`
3. `bun run dev`
4. Reload Obsidian
