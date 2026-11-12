/**
 * High-tech Watery Radar Sonar Ping Synthesizer
 * Uses native Web Audio API — zero external sound files required!
 */

class SoundEngine {
  private ctx: AudioContext | null = null;
  private isMuted: boolean = false;

  private initContext() {
    if (typeof window === "undefined") return null;
    if (!this.ctx) {
      const AudioContextClass =
        window.AudioContext ||
        (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      if (AudioContextClass) {
        this.ctx = new AudioContextClass();
      }
    }
    if (this.ctx && this.ctx.state === "suspended") {
      this.ctx.resume();
    }
    return this.ctx;
  }

  public setMuted(muted: boolean) {
    this.isMuted = muted;
  }

  public getMuted(): boolean {
    return this.isMuted;
  }

  /**
   * High-priority Radar Sonar Ping (Two harmonic frequencies with watery reverb decay)
   */
  public playRadarPing(volume: number = 0.25) {
    if (this.isMuted) return;
    try {
      const ctx = this.initContext();
      if (!ctx) return;

      const now = ctx.currentTime;

      // Primary crystal high chime
      const osc1 = ctx.createOscillator();
      const gain1 = ctx.createGain();

      // Deep aquatic sub undertone
      const osc2 = ctx.createOscillator();
      const gain2 = ctx.createGain();

      // Filter for watery resonance
      const filter = ctx.createBiquadFilter();
      filter.type = "lowpass";
      filter.frequency.setValueAtTime(1400, now);
      filter.frequency.exponentialRampToValueAtTime(450, now + 0.9);

      // Osc 1 settings (Sonar high crystal)
      osc1.type = "sine";
      osc1.frequency.setValueAtTime(880, now); // A5 note
      osc1.frequency.exponentialRampToValueAtTime(587.33, now + 0.35); // D5 note glide

      gain1.gain.setValueAtTime(0.001, now);
      gain1.gain.linearRampToValueAtTime(volume * 0.7, now + 0.04);
      gain1.gain.exponentialRampToValueAtTime(0.0001, now + 0.85);

      // Osc 2 settings (Warm aquatic harmonic)
      osc2.type = "triangle";
      osc2.frequency.setValueAtTime(440, now);
      osc2.frequency.exponentialRampToValueAtTime(293.66, now + 0.4);

      gain2.gain.setValueAtTime(0.001, now);
      gain2.gain.linearRampToValueAtTime(volume * 0.4, now + 0.03);
      gain2.gain.exponentialRampToValueAtTime(0.0001, now + 0.7);

      // Wire nodes
      osc1.connect(gain1);
      osc2.connect(gain2);

      gain1.connect(filter);
      gain2.connect(filter);

      filter.connect(ctx.destination);

      osc1.start(now);
      osc2.start(now);

      osc1.stop(now + 0.9);
      osc2.stop(now + 0.9);
    } catch {
      // Audio context might be restricted before first gesture; silently ignore
    }
  }

  /**
   * Subtle Glass Tap / Copy Click feedback
   */
  public playGlassClick(volume: number = 0.15) {
    if (this.isMuted) return;
    try {
      const ctx = this.initContext();
      if (!ctx) return;

      const now = ctx.currentTime;
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = "sine";
      osc.frequency.setValueAtTime(1200, now);
      osc.frequency.exponentialRampToValueAtTime(750, now + 0.08);

      gain.gain.setValueAtTime(volume, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.08);

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start(now);
      osc.stop(now + 0.09);
    } catch {
      // Ignore
    }
  }
}

export const soundEngine = new SoundEngine();

