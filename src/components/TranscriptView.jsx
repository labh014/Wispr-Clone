import React from 'react';

const TranscriptView = ({ transcript, interimTranscript }) => {
    return (
        <div className="transcript-view" style={{
            marginTop: '2rem',
            padding: '1rem',
            border: '1px solid #e0e0e0',
            borderRadius: '12px',
            minHeight: '100px',
            backgroundColor: '#fff',
            fontSize: '1.2rem',
            lineHeight: '1.6',
            color: '#333',
            whiteSpace: 'pre-wrap', // Preserve lines
            boxShadow: '0 2px 8px rgba(0,0,0,0.05)'
        }}>
            {transcript || interimTranscript ? (
                <p className="transcript-text" style={{ margin: 0 }}>
                    {/* Final confirmed text */}
                    <span>{transcript}</span>

                    {/* Interim/Guessing text (Gray) */}
                    {interimTranscript && (
                        <span style={{ color: '#888', transition: 'color 0.2s' }}>
                            {(transcript ? " " : "") + interimTranscript}
                        </span>
                    )}
                </p>
            ) : (
                <p className="placeholder-text" style={{ color: '#aaa', fontStyle: 'italic', margin: 0 }}>
                    Start speaking to see your text here...
                </p>
            )}
        </div>
    );
};

export default TranscriptView;
