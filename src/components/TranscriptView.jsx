import React, { useEffect, useRef } from 'react';

const TranscriptView = ({ transcript, interimTranscript }) => {
    const endRef = useRef(null);

    // Auto-scroll to bottom
    useEffect(() => {
        endRef.current?.scrollIntoView({ behavior: "smooth" });
    }, [transcript, interimTranscript]);

    if (!transcript && !interimTranscript) {
        return (
            <div className="placeholder">
                <p>Tap the microphone to start transcribing.....</p>
            </div>
        );
    }

    return (
        <div className="transcript-content">
            <span className="transcript-final">{transcript}</span>
            {interimTranscript && (
                <span className="transcript-interim">
                    {(transcript ? " " : "") + interimTranscript}
                </span>
            )}
            <div ref={endRef} />
        </div>
    );
};

export default TranscriptView;
