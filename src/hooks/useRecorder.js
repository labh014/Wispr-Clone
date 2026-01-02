import { useState, useCallback, useRef } from 'react';
import { startAudio, stopAudio } from '../services/audioService';
import { DeepgramClient } from '../services/deepgramService';

const useRecorder = () => {
    const [recordingState, setRecordingState] = useState('idle');
    const [errorMessage, setErrorMessage] = useState('');

    const [transcript, setTranscript] = useState('');
    const [interimTranscript, setInterimTranscript] = useState('');

    const deepgramRef = useRef(null);

    const startRecording = useCallback(async () => {
        if (recordingState === 'loading' || recordingState === 'recording') return;

        try {
            setRecordingState('loading');
            setErrorMessage('');
            setTranscript('');
            setInterimTranscript('');

            const apiKey = import.meta.env.VITE_DEEPGRAM_API_KEY;
            if (!apiKey) throw new Error("API Key missing");

            const client = new DeepgramClient(apiKey);
            deepgramRef.current = client;

            client.connect(
                (text, isFinal) => {
                    if (!text) return;
                    if (isFinal) {
                        setTranscript(prev => prev + (prev ? " " : "") + text);
                        setInterimTranscript('');
                    } else {
                        setInterimTranscript(text); // Live update
                    }
                },
                (err) => {
                    setErrorMessage(err);
                    setRecordingState('error');
                    stopRecording();
                }
            );

            await startAudio((chunk) => {
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
        stopAudio();

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
