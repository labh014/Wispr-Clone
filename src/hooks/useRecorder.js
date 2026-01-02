import { useState, useCallback, useRef } from 'react';
import { startAudio, stopAudio } from '../services/audioService';
import { DeepgramClient } from '../services/deepgramService';

/**
 * Recorder Hook
 * Controller Layer: Manages UI State and orchestrates Audio + Deepgram services.
 */
const useRecorder = () => {
    const [recordingState, setRecordingState] = useState('idle');
    const [errorMessage, setErrorMessage] = useState('');

    // UI Data States
    const [transcript, setTranscript] = useState('');
    const [interimTranscript, setInterimTranscript] = useState('');

    // Refs for Services
    const deepgramRef = useRef(null);

    const startRecording = useCallback(async () => {
        if (recordingState === 'loading' || recordingState === 'recording') return;

        try {
            setRecordingState('loading');
            setErrorMessage('');
            setTranscript('');
            setInterimTranscript('');

            // 1. Initialize Deepgram Service
            const apiKey = import.meta.env.VITE_DEEPGRAM_API_KEY;
            if (!apiKey) throw new Error("API Key missing");

            const client = new DeepgramClient(apiKey);
            deepgramRef.current = client;

            client.connect(
                // On Transcript
                (text, isFinal) => {
                    if (!text) return;
                    if (isFinal) {
                        setTranscript(prev => prev + (prev ? " " : "") + text);
                        setInterimTranscript('');
                    } else {
                        setInterimTranscript(text);
                    }
                },
                // On Error
                (err) => {
                    setErrorMessage(err);
                    setRecordingState('error');
                    stopRecording();
                }
            );

            // 2. Start Audio & Pipe to Deepgram
            await startAudio((chunk) => {
                // Simply pass chunk to client. 
                // Client handles buffering if connecting, or sending if open.
                if (deepgramRef.current) {
                    deepgramRef.current.send(chunk);
                }
            });

            setRecordingState('recording');

        } catch (error) {
            setRecordingState('error');
            setErrorMessage(error.message);
        }
    }, [recordingState]);

    const stopRecording = useCallback(() => {
        // 1. Stop Audio
        stopAudio();

        // 2. Disconnect Deepgram
        if (deepgramRef.current) {
            deepgramRef.current.disconnect();
            deepgramRef.current = null;
        }

        setRecordingState('idle');
        setInterimTranscript('');
    }, []);

    return {
        recordingState,
        errorMessage,
        transcript,
        interimTranscript,
        startRecording,
        stopRecording
    };
};

export default useRecorder;
