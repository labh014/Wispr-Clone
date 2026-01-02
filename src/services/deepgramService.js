export const connectToDeepgram = (apiKey, onTranscript, onLog = console.log, onOpen) => {
    // Optimized URL
    const url = 'wss://api.deepgram.com/v1/listen?model=nova-2&smart_format=true&interim_results=true&utterance_end_ms=1000&vad_events=true';

    const socket = new WebSocket(url, ['token', apiKey]);
    let keepAliveInterval;

    socket.onopen = () => {
        if (onOpen) onOpen();

        // KeepAlive heartbeat
        keepAliveInterval = setInterval(() => {
            if (socket.readyState === WebSocket.OPEN) {
                socket.send(JSON.stringify({ type: 'KeepAlive' }));
            }
        }, 3000);
    };

    socket.onmessage = (message) => {
        try {
            const data = JSON.parse(message.data);
            if (data.channel?.alternatives?.[0]) {
                const transcript = data.channel.alternatives[0].transcript;
                if (onTranscript) onTranscript(transcript, data.is_final);
            }
        } catch (error) {
            // Check console
        }
    };

    socket.onerror = (error) => {
        // Handle error
    };

    socket.onclose = (event) => {
        if (keepAliveInterval) clearInterval(keepAliveInterval);
    };

    return socket;
};

export const sendAudio = (socket, audioData) => {
    if (socket && socket.readyState === WebSocket.OPEN) {
        socket.send(audioData);
    }
};

export const closeDeepgram = (socket) => {
    if (socket) {
        socket.send(JSON.stringify({ type: 'CloseStream' }));
        socket.close();
    }
};
