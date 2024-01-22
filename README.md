<h1 align="center">Create Task</h1>

<p align="center">Faster creation of tasks in Obsidian.</p>

<p align="center">
  <a href="#install">Install</a> • <a href="#usage">Usage</a> • <a href="#contributing">Contributing</a> • <a href="#contributing">Contributing</a>
</p>

<p align="center">
  <a href="https://github.com/simonknittel/obsidian-create-task/blob/main/docs/new-task.png" style="display: block;">
    <img src="https://github.com/simonknittel/obsidian-create-task/blob/main/docs/new-task.png?raw=true" height="240">
  </a>

  <a href="https://github.com/simonknittel/obsidian-create-task/blob/main/docs/settings.png" style="display: block;">
    <img src="https://github.com/simonknittel/obsidian-create-task/blob/main/docs/settings.png?raw=true" height="240">
  </a>
</p>

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

### Command palette

You can use Obsidian's [command palette](https://help.obsidian.md/Plugins/Command+palette) to open the modal or this plugin's settings.

![Screenshot of the command palette](./docs/command-palette.png)

### Ribbon menu

You can open the modal by clicking this plugin's icon in [Obsidian's ribbon menu](https://help.obsidian.md/User+interface/Ribbon).

![Screenshot of the ribbon menu](./docs/ribbon-menu.png)

### URL scheme / Obsidian URI

This plugin supports the [URL scheme/Obsidian URI standard](https://help.obsidian.md/Extending+Obsidian/Obsidian+URI).

Using this url (`obsidian://create-task`) will automatically start Obsidian and open the modal.

You can use parameters to prefill parts of the modal:

- This prefills the Target note input: `note-path=Unsorted%20TODOs.md`
- This prefills the Task description input: `task-description=Do%20stuff`
- This prefills the Due date input: `due-date=tomorrow`
- This will skip the modal and immediately create the task in the specified note: `create=true`

#### Examples

Here are some examples of where you could use the url:

##### Raycast

1. Open Raycast
2. Search for `Create Quicklink`
3. Fill out the form
   - Name: Create task
   - Link: `obsidian://create-task`
   - Open With: `Obsidian`
4. Save the Quicklink
5. Now you can open Raycast and search for `Create task` in order to start Obsidian and open the modal.

<img src="https://github.com/simonknittel/obsidian-create-task/blob/main/docs/raycast-quicklink.png?raw=true" height="240" />

##### Windows Start Menu/Search

1. Create a Windows Shortcut in `C:\Users\<your-username>\AppData\Roaming\Microsoft\Windows\Start Menu\Programs`
2. For `Type the location of the item` use the url: `obsidian://create-task`
3. For `Type the name of the item` use: `Create task`
4. Save the shortcut
5. Now you can use the Windows Search and search for `Create task`. You can also pin this shortcut to the Start Menu.

##### Google Chrome Bookmark

1. Create a bookmark by right-clicking the bookmarks bar and choosing `Add page...`
2. For `Name` use: `Create task`
3. For `URL` use the url: `obsidian://create-task`

<img src="https://github.com/simonknittel/obsidian-create-task/blob/main/docs/google-chome-bookmark.png?raw=true" height="240" />

## Contributing

1. Create a separate Obsidian vault for plugin development
2. Install and enable the Hot Reload plugin: <https://github.com/pjeby/hot-reload>
   - This will reload plugins when changes to their `main.js` or `styles.css` are detected (see step 6)
3. Clone this repository to your vault's `.obsidian/plugin/` directory
4. Install [Bun](https://bun.sh/)
5. Install this plugin's dependencies: `bun install`
6. Build and watch for changes: `bun dev`
7. Enable the Create Task plugin in Obsidian
