import React from 'react';

const RecorderButton = ({ recordingState, onStart, onStop }) => {

    const handleClick = () => {
        if (recordingState === 'recording') {
            onStop();
        } else if (recordingState === 'idle' || recordingState === 'error') {
            onStart();
        }
    };

    const isRecording = recordingState === 'recording';
    const isLoading = recordingState === 'loading';

    return (
        <button
            className={`recorder-button ${isRecording ? 'recording' : ''}`}
            onClick={handleClick}
            disabled={isLoading}
            style={{ opacity: isLoading ? 0.7 : 1, cursor: isLoading ? 'wait' : 'pointer' }}
        >
            {isLoading ? 'Connecting...' : (isRecording ? 'Stop Recording' : 'Start Recording')}
        </button>
    );
};

export default RecorderButton;
