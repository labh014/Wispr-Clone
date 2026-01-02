import { useState, useCallback } from 'react';
import { startAudio, stopAudio } from '../services/audioService';

const useRecorder = () => {
    // Step 2.8: Handle UI states (idle, recording, error)
    const [recordingState, setRecordingState] = useState('idle'); // 'idle' | 'recording' | 'error'
    const [errorMessage, setErrorMessage] = useState('');
    const [transcript, setTranscript] = useState('');

    const startRecording = useCallback(async () => {
        try {
            setErrorMessage(''); // Clear previous errors

            // Step 2.7: Connect audioService to UI
            // Log chunks to console for verification for now
            const handleAudioChunk = (chunk) => {
                console.log("Audio chunk received:", chunk.size, "bytes");
                // TODO: Send to Deepgram in Hour 3
            };

            await startAudio(handleAudioChunk);

            setRecordingState('recording');

        } catch (error) {
            console.error("Failed to start recording:", error);
            setRecordingState('error');
            setErrorMessage(error.message);
        }
    }, []);

    const stopRecording = useCallback(() => {
        try {
            stopAudio();
            setRecordingState('idle');
        } catch (error) {
            console.error("Error stopping recording:", error);
            // Even if stop fails, we probably want to reset state to idle to allow retry
            setRecordingState('idle');
        }
    }, []);

    return {
        recordingState,
        errorMessage,
        transcript,
        startRecording,
        stopRecording
    };
};

export default useRecorder;
