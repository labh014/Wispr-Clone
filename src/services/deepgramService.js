export class DeepgramClient {
    constructor(apiKey) {
        this.apiKey = apiKey;
        this.socket = null;
        this.keepAliveInterval = null;
        this.audioQueue = [];
        this.callbacks = {
            onTranscript: null,
            onError: null,
        };
    }

    connect(onTranscript, onError) {
        this.callbacks.onTranscript = onTranscript;
        this.callbacks.onError = onError;

        const url = 'wss://api.deepgram.com/v1/listen?model=nova-2&smart_format=true&interim_results=true&utterance_end_ms=1000&vad_events=true';

        try {
            this.socket = new WebSocket(url, ['token', this.apiKey]);

            this.socket.onopen = this._handleOpen.bind(this);
            this.socket.onmessage = this._handleMessage.bind(this);
            this.socket.onerror = this._handleError.bind(this);
            this.socket.onclose = this._handleClose.bind(this);
        } catch (e) {
            if (this.callbacks.onError) this.callbacks.onError(e.message);
        }
    }

    send(audioChunk) {
        if (!this.socket) return;

        if (this.socket.readyState === WebSocket.OPEN) {
            this.socket.send(audioChunk);
        } else if (this.socket.readyState === WebSocket.CONNECTING) {
            this.audioQueue.push(audioChunk); // Buffer
        }
    }

    disconnect() {
        if (this.socket) {
            if (this.socket.readyState === WebSocket.OPEN) {
                this.socket.send(JSON.stringify({ type: 'CloseStream' }));
            }
            this.socket.close();
            this.socket = null;
        }

        if (this.keepAliveInterval) {
            clearInterval(this.keepAliveInterval);
            this.keepAliveInterval = null;
        }

        this.audioQueue = [];
    }

    _handleOpen() {
        // Flush buffer
        if (this.audioQueue.length > 0) {
            this.audioQueue.forEach(chunk => this.socket.send(chunk));
            this.audioQueue = [];
        }

        // Heartbeat
        this.keepAliveInterval = setInterval(() => {
            if (this.socket && this.socket.readyState === WebSocket.OPEN) {
                this.socket.send(JSON.stringify({ type: 'KeepAlive' }));
            }
        }, 3000);
    }

    _handleMessage(message) {
        try {
            const data = JSON.parse(message.data);
            if (data.channel?.alternatives?.[0]) {
                const { transcript } = data.channel.alternatives[0];
                const isFinal = data.is_final;

                if (this.callbacks.onTranscript) {
                    this.callbacks.onTranscript(transcript, isFinal);
                }
            }
        } catch (error) {
            // Ignore parse errors
        }
    }

    _handleError(error) {
        if (this.callbacks.onError) this.callbacks.onError("WebSocket Error");
    }

    _handleClose(event) { }
}
