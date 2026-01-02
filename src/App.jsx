import React from 'react';
import RecorderButton from './components/RecorderButton';
import TranscriptView from './components/TranscriptView';
import useRecorder from './hooks/useRecorder';

function App() {
  const { recordingState, errorMessage, transcript, startRecording, stopRecording } = useRecorder();

  return (
    <div className="container">
      <h1>Wispr Clone</h1>

      {errorMessage && (
        <div className="error-banner" style={{ color: 'red', margin: '1rem 0' }}>
          {errorMessage}
        </div>
      )}

      <div className="row">
        <RecorderButton
          recordingState={recordingState}
          onStart={startRecording}
          onStop={stopRecording}
        />
      </div>

      <div className="row">
        <TranscriptView transcript={transcript} />
      </div>

      <div className="status-bar" style={{ marginTop: '1rem', fontSize: '0.8rem', color: '#666' }}>
        Status: {recordingState}
      </div>
    </div>
  );
}

export default App;
