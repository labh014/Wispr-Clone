import { useState, useCallback, useRef } from 'react';
import { startAudio, stopAudio } from '../services/audioService';
import { connectToDeepgram, sendAudio, closeDeepgram } from '../services/deepgramService';

const useRecorder = () => {
    const [recordingState, setRecordingState] = useState('idle');
    const [errorMessage, setErrorMessage] = useState('');
    const [transcript, setTranscript] = useState('');
    const [interimTranscript, setInterimTranscript] = useState('');

    const socketRef = useRef(null);
    const audioQueue = useRef([]);

    const startRecording = useCallback(async () => {
        if (recordingState === 'loading' || recordingState === 'recording') return;

        try {
            setRecordingState('loading');
            setErrorMessage('');
            setTranscript('');
            setInterimTranscript('');
            audioQueue.current = [];

            const apiKey = import.meta.env.VITE_DEEPGRAM_API_KEY;
            if (!apiKey) throw new Error("API Key missing");

            // Connect WebSocket
            socketRef.current = connectToDeepgram(apiKey,
                (text, isFinal) => {
                    if (!text) return;

                    if (isFinal) {
                        setTranscript((prev) => prev + (prev ? " " : "") + text);
                        setInterimTranscript('');
                    } else {
                        setInterimTranscript(text);
                    }
                },
                // No-op logger
                () => { },
                // On Open: Flush buffer
                () => {
                    if (audioQueue.current.length > 0) {
                        audioQueue.current.forEach((chunk) => {
                            sendAudio(socketRef.current, chunk);
                        });
                        audioQueue.current = [];
                    }
                }
            );

            // Handle Audio
            const handleAudioChunk = (chunk) => {
                if (socketRef.current) {
                    const state = socketRef.current.readyState;
                    if (state === WebSocket.OPEN) {
                        sendAudio(socketRef.current, chunk);
                    } else if (state === WebSocket.CONNECTING) {
                        audioQueue.current.push(chunk);
                    }
                }
            };

            await startAudio(handleAudioChunk);
            setRecordingState('recording');

        } catch (error) {
            console.error(error);
            setRecordingState('error');
            setErrorMessage(error.message);
        }
    }, [recordingState]);

    const stopRecording = useCallback(() => {
        try {
            stopAudio();
            if (socketRef.current) {
                closeDeepgram(socketRef.current);
                socketRef.current = null;
            }
            audioQueue.current = [];
            setRecordingState('idle');
            setInterimTranscript('');
        } catch (error) {
            console.error(error);
            setRecordingState('idle');
        }
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
