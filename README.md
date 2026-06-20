# gantt_viz_for_dashboard_studio

A Gantt chart for use in Dashboard Studio

## Project Info

- **Display Label:** Gantt Viz For Dashboard Studio
- **Author:** Daniel Spavin
- **App ID:** gantt_viz_for_dashboard_studio

App metadata (version, label, author, description, category) is stored in `package/app/app.conf`. Edit that file to change how the app appears in Splunk; `package.json` is for Node/npm only.

## Getting Started

```bash
# Install dependencies
yarn install

# Build the visualization
yarn build

# Package into Splunk app
yarn package
```

## Project Structure

```
gantt_viz_for_dashboard_studio/
├── package.json                              # Node/npm scripts and dependencies
├── package/
│   └── app/
│       └── app.conf                          # Splunk app metadata (id, version, label, author, description)
└── visualizations/                            # Visualizations directory
    └── gantt_viz_for_dashboard_studio/                        # Your visualization
        ├── src/
        │   └── visualization.jsx             # Visualization code (React)
        └── config.json                       # Visualization metadata
```

Edit `package/app/app.conf` to customize app identity, version, label, and other Splunk app settings. This structure supports multiple visualizations in one project!

## Development

Edit `visualizations/gantt_viz_for_dashboard_studio/src/visualization.jsx` to customize your visualization using React and the `@splunk/dashboard-studio-extension/react` hooks (e.g. `useDataSources()`).

## Adding More Visualizations

To add another visualization to this project:

1. Create a new directory under `visualizations/`:
   ```bash
   mkdir visualizations/my-new-viz
   ```

2. Add the required files:
   ```bash
   mkdir visualizations/my-new-viz/src
   touch visualizations/my-new-viz/src/visualization.jsx
   touch visualizations/my-new-viz/config.json
   ```

3. Implement your visualization in `src/visualization.jsx` (React component)

4. Configure metadata in `config.json`

5. Run `yarn build && yarn package` - it will automatically include all visualizations!

## Packaging

Run `yarn package` to create a `.spl` Splunk app archive ready for deployment.

The packager reads app metadata (id, version, label, author, description) from `package/app/app.conf` and automatically discovers all visualizations in the `visualizations/` directory.

For a production/release build (minified, no source maps in the .spl), run `yarn build:prod` then `yarn package` instead of `yarn build` then `yarn package`.
