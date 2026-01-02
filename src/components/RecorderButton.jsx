import React from 'react';

const RecorderButton = ({ recordingState, onStart, onStop }) => {

    const handleClick = () => {
        if (recordingState === 'recording') {
            onStop();
        } else {
            onStart();
        }
    };

    const isRecording = recordingState === 'recording';

    return (
        <button
            className={`recorder-button ${isRecording ? 'recording' : ''}`}
            onClick={handleClick}
            disabled={recordingState === 'error'} // Maybe allow retry if error? keeping simple for now
        >
            {isRecording ? 'Stop Recording' : 'Start Recording'}
        </button>
    );
};

export default RecorderButton;
