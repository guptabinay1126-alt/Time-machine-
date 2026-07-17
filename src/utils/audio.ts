// Web Audio API Synthesizer for Timenemy
class SoundSynthesizer {
  private ctx: AudioContext | null = null;
  private humOsc: OscillatorNode | null = null;
  private humGain: GainNode | null = null;
  private isHumming = false;
  private isMuted = false;

  private initCtx() {
    if (!this.ctx) {
      const AudioCtxClass = window.AudioContext || (window as any).webkitAudioContext;
      if (AudioCtxClass) {
        this.ctx = new AudioCtxClass();
      }
    }
    if (this.ctx && this.ctx.state === "suspended") {
      this.ctx.resume();
    }
    return this.ctx;
  }

  setMute(muted: boolean) {
    this.isMuted = muted;
    if (muted) {
      this.stopHum();
    } else if (this.isHumming) {
      this.startHum();
    }
  }

  toggleMute() {
    this.setMute(!this.isMuted);
    return this.isMuted;
  }

  getMute() {
    return this.isMuted;
  }

  // Sci-fi background ambient ship hum
  startHum() {
    this.isHumming = true;
    if (this.isMuted) return;
    const ctx = this.initCtx();
    if (!ctx) return;

    try {
      this.stopHum();

      // Create primary low oscillator
      this.humOsc = ctx.createOscillator();
      this.humGain = ctx.createGain();

      this.humOsc.type = "sawtooth";
      this.humOsc.frequency.setValueAtTime(55, ctx.currentTime); // Low A

      // Low-pass filter to make it warm and rumble-like
      const filter = ctx.createBiquadFilter();
      filter.type = "lowpass";
      filter.frequency.setValueAtTime(90, ctx.currentTime);

      // Create a subtle LFO to modulate volume/pitch for a throbbing portal effect
      const lfo = ctx.createOscillator();
      const lfoGain = ctx.createGain();
      lfo.frequency.setValueAtTime(0.5, ctx.currentTime); // 0.5Hz oscillation
      lfoGain.gain.setValueAtTime(12, ctx.currentTime);

      lfo.connect(lfoGain);
      lfoGain.connect(this.humOsc.frequency);

      this.humGain.gain.setValueAtTime(0.12, ctx.currentTime);

      this.humOsc.connect(filter);
      filter.connect(this.humGain);
      this.humGain.connect(ctx.destination);

      lfo.start();
      this.humOsc.start();
    } catch (e) {
      console.error("Failed to start ambient hum:", e);
    }
  }

  stopHum() {
    try {
      if (this.humOsc) {
        this.humOsc.stop();
        this.humOsc.disconnect();
        this.humOsc = null;
      }
      if (this.humGain) {
        this.humGain.disconnect();
        this.humGain = null;
      }
    } catch (e) {
      // Ignored
    }
  }

  // Futuristic chirping beep for navigation buttons
  playBeep() {
    if (this.isMuted) return;
    const ctx = this.initCtx();
    if (!ctx) return;

    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    osc.type = "sine";
    osc.frequency.setValueAtTime(1200, ctx.currentTime);
    osc.frequency.exponentialRampToValueAtTime(1800, ctx.currentTime + 0.1);

    gain.gain.setValueAtTime(0.08, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.1);

    osc.connect(gain);
    gain.connect(ctx.destination);

    osc.start();
    osc.stop(ctx.currentTime + 0.12);
  }

  // Holographic static digital glitch noise
  playGlitch() {
    if (this.isMuted) return;
    const ctx = this.initCtx();
    if (!ctx) return;

    const duration = 0.2 + Math.random() * 0.15;
    const bufferSize = ctx.sampleRate * duration;
    const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
    const data = buffer.getChannelData(0);

    for (let i = 0; i < bufferSize; i++) {
      data[i] = Math.random() * 2 - 1;
    }

    const noiseNode = ctx.createBufferSource();
    noiseNode.buffer = buffer;

    const filter = ctx.createBiquadFilter();
    filter.type = "bandpass";
    filter.frequency.setValueAtTime(1000 + Math.random() * 2000, ctx.currentTime);
    filter.Q.setValueAtTime(2, ctx.currentTime);

    const gain = ctx.createGain();
    gain.gain.setValueAtTime(0.05, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + duration);

    noiseNode.connect(filter);
    filter.connect(gain);
    gain.connect(ctx.destination);

    noiseNode.start();

    // Add a couple of sharp electronic digital blips
    const blip = ctx.createOscillator();
    const blipGain = ctx.createGain();
    blip.type = "square";
    blip.frequency.setValueAtTime(200 + Math.random() * 1500, ctx.currentTime);
    blipGain.gain.setValueAtTime(0.02, ctx.currentTime);
    blipGain.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + 0.08);

    blip.connect(blipGain);
    blipGain.connect(ctx.destination);
    blip.start();
    blip.stop(ctx.currentTime + 0.08);
  }

  // Wormhole pitch sweep up
  playWormholeSweep() {
    if (this.isMuted) return;
    const ctx = this.initCtx();
    if (!ctx) return;

    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    osc.type = "sawtooth";
    osc.frequency.setValueAtTime(100, ctx.currentTime);
    osc.frequency.exponentialRampToValueAtTime(3000, ctx.currentTime + 3.0);

    const filter = ctx.createBiquadFilter();
    filter.type = "lowpass";
    filter.frequency.setValueAtTime(1200, ctx.currentTime);
    filter.frequency.exponentialRampToValueAtTime(400, ctx.currentTime + 3.0);

    gain.gain.setValueAtTime(0.01, ctx.currentTime);
    gain.gain.linearRampToValueAtTime(0.18, ctx.currentTime + 1.0);
    gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 3.2);

    osc.connect(filter);
    filter.connect(gain);
    gain.connect(ctx.destination);

    osc.start();
    osc.stop(ctx.currentTime + 3.2);
  }

  // Realistic pulsing sci-fi portal sound
  playPortalOpen() {
    if (this.isMuted) return;
    const ctx = this.initCtx();
    if (!ctx) return;

    const osc1 = ctx.createOscillator();
    const osc2 = ctx.createOscillator();
    const gain = ctx.createGain();

    osc1.type = "triangle";
    osc1.frequency.setValueAtTime(80, ctx.currentTime);
    osc1.frequency.linearRampToValueAtTime(160, ctx.currentTime + 1.5);

    osc2.type = "sine";
    osc2.frequency.setValueAtTime(82, ctx.currentTime);
    osc2.frequency.linearRampToValueAtTime(164, ctx.currentTime + 1.5);

    gain.gain.setValueAtTime(0.2, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.005, ctx.currentTime + 2.0);

    osc1.connect(gain);
    osc2.connect(gain);
    gain.connect(ctx.destination);

    osc1.start();
    osc2.start();
    osc1.stop(ctx.currentTime + 2.0);
    osc2.stop(ctx.currentTime + 2.0);
  }

  // Holographic phone call digital ringtone
  playCallRing() {
    if (this.isMuted) return;
    const ctx = this.initCtx();
    if (!ctx) return;

    const playTone = (delay: number) => {
      const time = ctx.currentTime + delay;
      const osc1 = ctx.createOscillator();
      const osc2 = ctx.createOscillator();
      const gain = ctx.createGain();

      osc1.type = "sine";
      osc1.frequency.setValueAtTime(853, time); // High tech twin frequency
      osc2.type = "sine";
      osc2.frequency.setValueAtTime(960, time);

      gain.gain.setValueAtTime(0, time);
      gain.gain.linearRampToValueAtTime(0.06, time + 0.05);
      gain.gain.linearRampToValueAtTime(0.06, time + 0.5);
      gain.gain.exponentialRampToValueAtTime(0.001, time + 0.6);

      osc1.connect(gain);
      osc2.connect(gain);
      gain.connect(ctx.destination);

      osc1.start(time);
      osc2.start(time);
      osc1.stop(time + 0.6);
      osc2.stop(time + 0.6);
    };

    // Double ring cycle
    playTone(0);
    playTone(0.8);
  }

  // Connected chimes sequence
  playConnectionEstablished() {
    if (this.isMuted) return;
    const ctx = this.initCtx();
    if (!ctx) return;

    const playNote = (freq: number, delay: number, dur: number) => {
      const time = ctx.currentTime + delay;
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = "triangle";
      osc.frequency.setValueAtTime(freq, time);

      gain.gain.setValueAtTime(0.08, time);
      gain.gain.exponentialRampToValueAtTime(0.001, time + dur);

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start(time);
      osc.stop(time + dur);
    };

    // Dynamic futuristic major chord ascent
    playNote(523.25, 0, 0.4);   // C5
    playNote(659.25, 0.1, 0.4); // E5
    playNote(783.99, 0.2, 0.4); // G5
    playNote(1046.50, 0.35, 0.8); // C6
  }
}

export const syn = new SoundSynthesizer();
export default syn;
