# Contributing

## Local development

1. Create a separate Obsidian vault for plugin development
2. Install and enable the Hot Reload plugin: <https://github.com/pjeby/hot-reload>
   - This will reload plugins when changes to their `main.js` or `styles.css` are detected (see step 6)
3. Clone this repository to your vault's `.obsidian/plugin/` directory
4. Install [Bun](https://bun.sh/)
5. Install this plugin's dependencies: `bun install`
6. Build and watch for changes: `bun dev`
7. Enable the Create Task plugin in Obsidian
