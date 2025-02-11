import BeepFrequency from '@/types/BeepFrequency';

let audioCtx: AudioContext | null = null;

// plays a beep using an existing BeepFrequency for a specified duration
const playBeep = (frequency: BeepFrequency, duration: number): void => {
    // Create the audio context once
    if (!audioCtx) {
        audioCtx = new window.AudioContext();
    }
    
    const oscillator = audioCtx.createOscillator();
    oscillator.type = 'sine';
    oscillator.frequency.setValueAtTime(frequency, audioCtx.currentTime); // set beep frequency
    oscillator.connect(audioCtx.destination);
    oscillator.start();
    oscillator.stop(audioCtx.currentTime + duration); // stop beep after duration
};

export default playBeep;