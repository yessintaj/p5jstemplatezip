# Running this project

This is a static p5.js game. No package installation or secrets are required.

- Use the **Run** button to start the existing **Serve static** workflow.
- The workflow serves the project with `static-web-server -w ./.config/static-web-server.toml` on port 80.
- Open Preview to play; use W, A, S, and D to move.
- Refresh Preview after editing the HTML or JavaScript.
- p5.js loads from jsDelivr, so the browser needs internet access.

Asset paths are case-sensitive. Keep just one static server running; a second server on port 80 cannot start.
