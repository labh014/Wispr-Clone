# Vocal

 ## Architecture

The application follows a layered architecture to keep responsibilities clearly separated and the codebase maintainable.

UI Layer (App.jsx)
Handles rendering and user interaction only.

Controller Layer (useRecorder.js)
Manages application state (idle, recording, error) and coordinates services.

Service Layer (audioService.js, deepgramService.js)
Handles microphone access, audio streaming, and WebSocket communication with Deepgram.

 ##  Technology Choices

Tauri for lightweight, native desktop packaging using the system webview.

Native WebSocket implementation for real-time audio streaming to Deepgram.

React for UI and state-driven rendering.

Known Limitations

Requires an active internet connection.

A valid VITE_DEEPGRAM_API_KEY must be provided in a .env file.

Current build targets Windows (x64). Other platforms require building on their respective OS.

 ## Assumptions

Microphone access is available and granted by the user.

Transcription is configured for English (nova-2 model).

Designed for a single speaker dictation workflow.

 ## How to Run
npm install
npm run tauri dev

 ## Build
npm run tauri build
