import React from 'react';

const TranscriptView = ({ transcript }) => {
    return (
        <div className="transcript-view">
            {transcript ? (
                <p className="transcript-text">{transcript}</p>
            ) : (
                <p className="placeholder-text">Transcript will appear here...</p>
            )}
        </div>
    );
};

export default TranscriptView;
