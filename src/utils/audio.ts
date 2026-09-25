// Web Audio API generator for soft celebratory melody without external audio dependencies

class CelebrationAudioService {
  private ctx: AudioContext | null = null;
  private isPlaying: boolean = false;
  private timer: number | null = null;

  private initContext() {
    if (!this.ctx) {
      const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      this.ctx = new AudioCtx();
    }
    if (this.ctx.state === 'suspended') {
      this.ctx.resume();
    }
  }

  // Play a soft sweet chime
  public playChime() {
    try {
      this.initContext();
      if (!this.ctx) return;

      const notes = [523.25, 659.25, 783.99, 1046.5]; // C5, E5, G5, C6
      notes.forEach((freq, idx) => {
        if (!this.ctx) return;
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();

        osc.type = 'sine';
        osc.frequency.setValueAtTime(freq, this.ctx.currentTime + idx * 0.12);

        gain.gain.setValueAtTime(0, this.ctx.currentTime + idx * 0.12);
        gain.gain.linearRampToValueAtTime(0.18, this.ctx.currentTime + idx * 0.12 + 0.04);
        gain.gain.exponentialRampToValueAtTime(0.0001, this.ctx.currentTime + idx * 0.12 + 1.2);

        osc.connect(gain);
        gain.connect(this.ctx.destination);

        osc.start(this.ctx.currentTime + idx * 0.12);
        osc.stop(this.ctx.currentTime + idx * 0.12 + 1.3);
      });
    } catch {
      // Audio not permitted or unsupported, fails silently
    }
  }

  // Play gentle celebratory "Parabéns pra você" melody
  public playBirthdayMelody(onEnd?: () => void): () => void {
    try {
      this.initContext();
      if (!this.ctx) return () => {};

      this.stop();
      this.isPlaying = true;

      // Note frequencies (Parabéns pra você)
      // Pa-ra-béns pra vo-cê, nes-ta da-ta que-ri-da...
      const notes = [
        { note: 261.63, dur: 0.35, pause: 0.1 }, // C4
        { note: 261.63, dur: 0.25, pause: 0.05 }, // C4
        { note: 293.66, dur: 0.6, pause: 0.1 }, // D4
        { note: 261.63, dur: 0.6, pause: 0.1 }, // C4
        { note: 349.23, dur: 0.6, pause: 0.1 }, // F4
        { note: 329.63, dur: 1.1, pause: 0.25 }, // E4

        { note: 261.63, dur: 0.35, pause: 0.1 }, // C4
        { note: 261.63, dur: 0.25, pause: 0.05 }, // C4
        { note: 293.66, dur: 0.6, pause: 0.1 }, // D4
        { note: 261.63, dur: 0.6, pause: 0.1 }, // C4
        { note: 392.00, dur: 0.6, pause: 0.1 }, // G4
        { note: 349.23, dur: 1.1, pause: 0.25 }, // F4

        { note: 261.63, dur: 0.35, pause: 0.1 }, // C4
        { note: 261.63, dur: 0.25, pause: 0.05 }, // C4
        { note: 523.25, dur: 0.6, pause: 0.1 }, // C5
        { note: 440.00, dur: 0.6, pause: 0.1 }, // A4
        { note: 349.23, dur: 0.6, pause: 0.1 }, // F4
        { note: 329.63, dur: 0.6, pause: 0.1 }, // E4
        { note: 293.66, dur: 0.9, pause: 0.2 }, // D4

        { note: 466.16, dur: 0.35, pause: 0.1 }, // Bb4
        { note: 466.16, dur: 0.25, pause: 0.05 }, // Bb4
        { note: 440.00, dur: 0.6, pause: 0.1 }, // A4
        { note: 349.23, dur: 0.6, pause: 0.1 }, // F4
        { note: 392.00, dur: 0.6, pause: 0.1 }, // G4
        { note: 349.23, dur: 1.3, pause: 0.4 }, // F4
      ];

      let startTime = this.ctx.currentTime + 0.1;

      notes.forEach((item) => {
        if (!this.ctx) return;
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();

        // Warm electric piano/celesta tone
        osc.type = 'triangle';
        osc.frequency.setValueAtTime(item.note, startTime);

        gain.gain.setValueAtTime(0, startTime);
        gain.gain.linearRampToValueAtTime(0.12, startTime + 0.03);
        gain.gain.exponentialRampToValueAtTime(0.0001, startTime + item.dur);

        osc.connect(gain);
        gain.connect(this.ctx.destination);

        osc.start(startTime);
        osc.stop(startTime + item.dur + 0.05);

        startTime += item.dur + item.pause;
      });

      const totalDuration = (startTime - this.ctx.currentTime) * 1000;
      this.timer = window.setTimeout(() => {
        this.isPlaying = false;
        if (onEnd) onEnd();
      }, totalDuration);

      return () => this.stop();
    } catch {
      return () => {};
    }
  }

  public stop() {
    this.isPlaying = false;
    if (this.timer) {
      clearTimeout(this.timer);
      this.timer = null;
    }
  }

  public getIsPlaying() {
    return this.isPlaying;
  }
}

export const celebrationAudio = new CelebrationAudioService();
