/**
 * Zero-asset Web Audio API Synthesizer & Binaural Beats Sound Engine
 */

export type BinauralPreset = 'alpha' | 'theta' | 'gamma';

class SoundEngine {
  private ctx: AudioContext | null = null;
  private binauralLeftOsc: OscillatorNode | null = null;
  private binauralRightOsc: OscillatorNode | null = null;
  private binauralGain: GainNode | null = null;
  private isMuted: boolean = false;
  private activeFrequency: 'off' | BinauralPreset = 'off';

  private initContext(): AudioContext {
    if (!this.ctx) {
      const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      this.ctx = new AudioCtx();
    }
    if (this.ctx.state === 'suspended') {
      this.ctx.resume();
    }
    return this.ctx;
  }

  public setMuted(muted: boolean) {
    this.isMuted = muted;
    if (this.isMuted && this.activeFrequency !== 'off') {
      this.stopBinaural();
    }
  }

  public toggleMute(): boolean {
    this.setMuted(!this.isMuted);
    return this.isMuted;
  }

  public getIsMuted(): boolean {
    return this.isMuted;
  }

  // Play micro UI click
  public playClick() {
    if (this.isMuted) return;
    try {
      const ctx = this.initContext();
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      
      osc.type = 'sine';
      osc.frequency.setValueAtTime(800, ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(400, ctx.currentTime + 0.04);
      
      gain.gain.setValueAtTime(0.12, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.04);
      
      osc.connect(gain);
      gain.connect(ctx.destination);
      
      osc.start();
      osc.stop(ctx.currentTime + 0.04);
    } catch {
      // Audio context might fail before user gesture
    }
  }

  // Play toggle switch / rotation click
  public playToggle() {
    if (this.isMuted) return;
    try {
      const ctx = this.initContext();
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      
      osc.type = 'triangle';
      osc.frequency.setValueAtTime(600, ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(900, ctx.currentTime + 0.05);
      
      gain.gain.setValueAtTime(0.1, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.05);
      
      osc.connect(gain);
      gain.connect(ctx.destination);
      
      osc.start();
      osc.stop(ctx.currentTime + 0.05);
    } catch {}
  }

  // Play sparkle / deduction hint tone
  public playSparkle() {
    if (this.isMuted) return;
    try {
      const ctx = this.initContext();
      const now = ctx.currentTime;
      [880, 1174.66, 1318.51].forEach((freq, idx) => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = 'sine';
        osc.frequency.setValueAtTime(freq, now + idx * 0.04);
        gain.gain.setValueAtTime(0.08, now + idx * 0.04);
        gain.gain.exponentialRampToValueAtTime(0.001, now + idx * 0.04 + 0.15);
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start(now + idx * 0.04);
        osc.stop(now + idx * 0.04 + 0.15);
      });
    } catch {}
  }

  // Play liquid bubble / pour sound
  public playBubble() {
    if (this.isMuted) return;
    try {
      const ctx = this.initContext();
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(320, ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(640, ctx.currentTime + 0.08);
      gain.gain.setValueAtTime(0.12, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.08);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start();
      osc.stop(ctx.currentTime + 0.08);
    } catch {}
  }

  // Play success chime
  public playSuccess() {
    if (this.isMuted) return;
    try {
      const ctx = this.initContext();
      const now = ctx.currentTime;
      const notes = [523.25, 659.25, 783.99, 1046.50]; // C5, E5, G5, C6
      
      notes.forEach((freq, idx) => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        
        osc.type = 'sine';
        osc.frequency.setValueAtTime(freq, now + idx * 0.06);
        
        gain.gain.setValueAtTime(0, now + idx * 0.06);
        gain.gain.linearRampToValueAtTime(0.15, now + idx * 0.06 + 0.02);
        gain.gain.exponentialRampToValueAtTime(0.001, now + idx * 0.06 + 0.25);
        
        osc.connect(gain);
        gain.connect(ctx.destination);
        
        osc.start(now + idx * 0.06);
        osc.stop(now + idx * 0.06 + 0.25);
      });
    } catch {}
  }

  // Play error feedback
  public playError() {
    if (this.isMuted) return;
    try {
      const ctx = this.initContext();
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      
      osc.type = 'sawtooth';
      osc.frequency.setValueAtTime(150, ctx.currentTime);
      osc.frequency.linearRampToValueAtTime(100, ctx.currentTime + 0.15);
      
      gain.gain.setValueAtTime(0.12, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.15);
      
      osc.connect(gain);
      gain.connect(ctx.destination);
      
      osc.start();
      osc.stop(ctx.currentTime + 0.15);
    } catch {}
  }

  // Play power up sound
  public playPowerUp() {
    this.playSuccess();
  }

  // Play correct sound
  public playCorrect() {
    this.playSuccess();
  }

  // Play incorrect sound
  public playIncorrect() {
    this.playError();
  }

  // Play Level Up Fanfare
  public playLevelUp() {
    if (this.isMuted) return;
    try {
      const ctx = this.initContext();
      const now = ctx.currentTime;
      const chords = [
        { freq: 440, time: 0 },
        { freq: 554.37, time: 0.1 },
        { freq: 659.25, time: 0.2 },
        { freq: 880, time: 0.35 },
      ];
      
      chords.forEach(({ freq, time }) => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = 'triangle';
        osc.frequency.setValueAtTime(freq, now + time);
        
        gain.gain.setValueAtTime(0.2, now + time);
        gain.gain.exponentialRampToValueAtTime(0.001, now + time + 0.4);
        
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start(now + time);
        osc.stop(now + time + 0.4);
      });
    } catch {}
  }

  // Play Countdown Tick
  public playCountdownTick(isFinal = false) {
    if (this.isMuted) return;
    try {
      const ctx = this.initContext();
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      
      osc.type = 'sine';
      osc.frequency.setValueAtTime(isFinal ? 880 : 440, ctx.currentTime);
      
      gain.gain.setValueAtTime(0.15, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.08);
      
      osc.connect(gain);
      gain.connect(ctx.destination);
      
      osc.start();
      osc.stop(ctx.currentTime + 0.08);
    } catch {}
  }

  // Play Dual N-Back Audio Letter/Tone
  public playNeuroTone(index: number) {
    if (this.isMuted) return;
    try {
      const ctx = this.initContext();
      const frequencies = [261.63, 293.66, 329.63, 349.23, 392.00, 440.00, 493.88, 523.25];
      const freq = frequencies[index % frequencies.length];
      
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      
      osc.type = 'sine';
      osc.frequency.setValueAtTime(freq, ctx.currentTime);
      
      gain.gain.setValueAtTime(0.2, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.3);
      
      osc.connect(gain);
      gain.connect(ctx.destination);
      
      osc.start();
      osc.stop(ctx.currentTime + 0.3);
    } catch {}
  }

  // Play custom frequency
  public playFrequency(freq: number, duration: number = 0.2) {
    if (this.isMuted) return;
    try {
      const ctx = this.initContext();
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(freq, ctx.currentTime);
      gain.gain.setValueAtTime(0.15, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + duration);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start();
      osc.stop(ctx.currentTime + duration);
    } catch {}
  }

  // Play soft chime
  public playChime() {
    this.playSparkle();
  }

  public startBinaural(type: BinauralPreset) {
    if (this.isMuted) return;
    try {
      this.stopBinaural();
      const ctx = this.initContext();
      
      let baseCarrier = 200;
      let beatDelta = 10; // Alpha 10Hz
      
      if (type === 'theta') {
        baseCarrier = 180;
        beatDelta = 6; // Theta 6Hz
      } else if (type === 'gamma') {
        baseCarrier = 240;
        beatDelta = 40; // Gamma 40Hz
      }
      
      const leftFreq = baseCarrier - beatDelta / 2;
      const rightFreq = baseCarrier + beatDelta / 2;
      
      // Left channel panner
      const merger = ctx.createChannelMerger(2);
      
      const leftOsc = ctx.createOscillator();
      leftOsc.type = 'sine';
      leftOsc.frequency.setValueAtTime(leftFreq, ctx.currentTime);
      
      const rightOsc = ctx.createOscillator();
      rightOsc.type = 'sine';
      rightOsc.frequency.setValueAtTime(rightFreq, ctx.currentTime);
      
      const mainGain = ctx.createGain();
      mainGain.gain.setValueAtTime(0.04, ctx.currentTime); // gentle ambient volume
      
      // Connect to merger (Left to ch 0, Right to ch 1)
      leftOsc.connect(merger, 0, 0);
      rightOsc.connect(merger, 0, 1);
      
      merger.connect(mainGain);
      mainGain.connect(ctx.destination);
      
      leftOsc.start();
      rightOsc.start();
      
      this.binauralLeftOsc = leftOsc;
      this.binauralRightOsc = rightOsc;
      this.binauralGain = mainGain;
      this.activeFrequency = type;
    } catch (e) {
      console.warn("Binaural error:", e);
    }
  }

  public startBinauralBeats(type: BinauralPreset) {
    this.startBinaural(type);
  }

  public stopBinaural() {
    try {
      if (this.binauralLeftOsc) {
        this.binauralLeftOsc.stop();
        this.binauralLeftOsc.disconnect();
        this.binauralLeftOsc = null;
      }
      if (this.binauralRightOsc) {
        this.binauralRightOsc.stop();
        this.binauralRightOsc.disconnect();
        this.binauralRightOsc = null;
      }
      if (this.binauralGain) {
        this.binauralGain.disconnect();
        this.binauralGain = null;
      }
    } catch {}
    this.activeFrequency = 'off';
  }

  public stopBinauralBeats() {
    this.stopBinaural();
  }

  public getActiveBinaural(): 'off' | BinauralPreset {
    return this.activeFrequency;
  }
}

export const soundFx = new SoundEngine();
