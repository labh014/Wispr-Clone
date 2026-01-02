import React from 'react';
import RecorderButton from './components/RecorderButton';
import TranscriptView from './components/TranscriptView';
import useRecorder from './hooks/useRecorder';

function App() {
  const { recordingState, errorMessage, transcript, interimTranscript, startRecording, stopRecording } = useRecorder();

  return (
    <>
      <header>
        <h1>Vocal</h1>
      </header>

      <main>
        {errorMessage && (
          <div className="error-banner">
            ❌ {errorMessage}
          </div>
        )}

        <div className="transcript-card">
          <TranscriptView
            transcript={transcript}
            interimTranscript={interimTranscript}
          />
        </div>

        <div className="controls">
          <RecorderButton
            recordingState={recordingState}
            onStart={startRecording}
            onStop={stopRecording}
          />
        </div>
      </main>

      <footer className="status-bar">
        <div className="status-indicator">
          <span className={`dot ${recordingState === 'recording' ? 'connected' : (recordingState === 'loading' ? 'connecting' : (recordingState === 'error' ? 'error' : ''))}`}></span>
          <span>{recordingState.charAt(0).toUpperCase() + recordingState.slice(1)}</span>
        </div>
        <div style={{ opacity: 0.5 }}>v0.1.0</div>
      </footer>
    </>
  );
}

export default App;
