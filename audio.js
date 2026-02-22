// audio.js

export class AudioEngine {
    constructor() {
        this.audioCtx = null;
        this.analyser = null;
        this.dataArray = null;
        this.isRunning = false;
    }

    /**
     * Requests microphone permissions and initializes the Web Audio API.
     * Returns true if successful, false if the user denies access.
     */
    async startMic() {
        if (this.isRunning) return true;

        try {
            const stream = await navigator.mediaDevices.getUserMedia({ audio: true, video: false });
            this.audioCtx = new (window.AudioContext || window.webkitAudioContext)();
            const source = this.audioCtx.createMediaStreamSource(stream);
            
            this.analyser = this.audioCtx.createAnalyser(); 
            // 8192 provides the high frequency resolution we need for accurate pitch detection
            this.analyser.fftSize = 8192; 
            
            source.connect(this.analyser); 
            this.dataArray = new Uint8Array(this.analyser.frequencyBinCount);
            
            this.isRunning = true;
            return true; 
        } catch (err) {
            console.error("Microphone access denied or error occurred:", err);
            return false;
        }
    }

    /**
     * Analyzes the current audio frame and returns the top 5 frequency peaks (in Hz).
     * @param {number} threshold - The minimum amplitude (0-255) to register as a note.
     */
    getPeaks(threshold = 90) {
        if (!this.isRunning) return [];
        
        this.analyser.getByteFrequencyData(this.dataArray);
        let peaks = [];
        
        // Loop through the frequency bins to find local maxima (peaks)
        for (let i = 2; i < this.dataArray.length - 2; i++) {
            if (this.dataArray[i] > threshold && 
                this.dataArray[i] > this.dataArray[i-1] && 
                this.dataArray[i] > this.dataArray[i+1]) {
                
                // Convert the bin index into actual Hertz
                let hz = i * (this.audioCtx.sampleRate / this.analyser.fftSize); 
                peaks.push({ index: i, hz: hz, amp: this.dataArray[i] });
            }
        }
        
        // Sort by amplitude (loudest first) and return the top 5
        peaks.sort((a,b) => b.amp - a.amp); 
        return peaks.slice(0, 5);
    }

    /**
     * Gets the current audio context time for the metronome synchronization.
     */
    getCurrentTime() {
        return this.audioCtx ? this.audioCtx.currentTime : 0;
    }
}