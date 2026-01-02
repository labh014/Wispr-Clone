/**
 * Audio Service
 * Handles microphone access, recording stream, and emitting audio chunks.
 * Decoupled from UI and business logic.
 */

let mediaRecorder = null;
let stream = null;

/**
 * Request microphone access and start recording.
 * @param {Function} onAudioChunk - Callback to receive audio blobs
 */
export const startAudio = async (onAudioChunk) => {
    try {
        // Step 2.2: Request microphone permission
        stream = await navigator.mediaDevices.getUserMedia({ audio: true });

        // Step 2.4: Capture audio data
        // Use standard MIME type, let browser decide codec (usually webm/opus)
        mediaRecorder = new MediaRecorder(stream);

        // Step 2.5: Emit audio chunks via callback
        mediaRecorder.ondataavailable = (event) => {
            if (event.data.size > 0 && onAudioChunk) {
                onAudioChunk(event.data);
            }
        };

        mediaRecorder.start(250); // Slice audio every 250ms
        console.log("Audio service: Recording started");

    } catch (error) {
        // Step 2.3: Implement permission handling
        console.error("Audio service error:", error);

        // Categorize errors for the UI
        if (error.name === 'NotAllowedError' || error.name === 'PermissionDeniedError') {
            throw new Error("Microphone permission denied. Please allow access to continue.");
        } else if (error.name === 'NotFoundError' || error.name === 'DevicesNotFoundError') {
            throw new Error("No microphone found. Please check your devices.");
        } else {
            throw new Error("Could not access microphone: " + error.message);
        }
    }
};

/**
 * Stop recording and release microphone resources.
 */
export const stopAudio = () => {
    // Step 2.6: Stop audio cleanly
    if (mediaRecorder && mediaRecorder.state !== "inactive") {
        mediaRecorder.stop();
        mediaRecorder = null;
        console.log("Audio service: Recorder stopped");
    }

    if (stream) {
        stream.getTracks().forEach((track) => track.stop());
        stream = null;
        console.log("Audio service: Stream tracks stopped");
    }
};
