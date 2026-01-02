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
            className={`btn-record ${isRecording ? 'recording' : ''}`}
            onClick={handleClick}
            disabled={isLoading}
        >
            {isLoading ? (
                <>
                    <span>Connecting...</span>
                </>
            ) : isRecording ? (
                <>
                    <span style={{ fontSize: '1em' }}>⏹</span>
                    <span>Stop Recording</span>
                </>
            ) : (
                <>
                    <span style={{ fontSize: '1em' }}>🎙</span>
                    <span>Start Recording</span>
                </>
            )}
        </button>
    );
};

export default RecorderButton;
