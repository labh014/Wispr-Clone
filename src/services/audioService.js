let mediaRecorder = null;
let stream = null;

const getSupportedMimeType = () => {
    const types = ['audio/webm;codecs=opus', 'audio/webm', 'audio/mp4'];
    for (const type of types) {
        if (MediaRecorder.isTypeSupported(type)) return type;
    }
    return '';
};

export const stopAudio = () => {
    if (mediaRecorder && mediaRecorder.state !== "inactive") {
        mediaRecorder.stop();
        mediaRecorder = null;
    }
    if (stream) {
        stream.getTracks().forEach((track) => track.stop());
        stream = null;
    }
};

export const startAudio = async (onAudioChunk, onLog = console.log) => {
    stopAudio();

    try {
        stream = await navigator.mediaDevices.getUserMedia({ audio: true });
        const mimeType = getSupportedMimeType();
        const options = mimeType ? { mimeType } : {};

        mediaRecorder = new MediaRecorder(stream, options);

        mediaRecorder.ondataavailable = (event) => {
            if (event.data.size > 0 && onAudioChunk) {
                onAudioChunk(event.data);
            }
        };

        mediaRecorder.start(250); // Low latency

    } catch (error) {
        throw error;
    }
};
