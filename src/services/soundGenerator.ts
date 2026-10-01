// Web Audio API pure synthesizer for ambient study soundscapes

class SoundscapeEngine {
  private ctx: AudioContext | null = null;
  private nodes: { [key: string]: { source?: AudioNode; gain: GainNode } } = {};
  private isInitialized = false;

  private init() {
    if (!this.ctx) {
      const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      this.ctx = new AudioCtx();
    }
    if (this.ctx.state === 'suspended') {
      this.ctx.resume();
    }
    this.isInitialized = true;
  }

  // Generate pink noise buffer
  private createPinkNoiseBuffer(ctx: AudioContext): AudioBuffer {
    const bufferSize = ctx.sampleRate * 4;
    const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
    const data = buffer.getChannelData(0);
    let b0 = 0, b1 = 0, b2 = 0, b3 = 0, b4 = 0, b5 = 0, b6 = 0;

    for (let i = 0; i < bufferSize; i++) {
      const white = Math.random() * 2 - 1;
      b0 = 0.99886 * b0 + white * 0.0555179;
      b1 = 0.99332 * b1 + white * 0.0750759;
      b2 = 0.96900 * b2 + white * 0.1538520;
      b3 = 0.86650 * b3 + white * 0.3104856;
      b4 = 0.55000 * b4 + white * 0.5329522;
      b5 = -0.7616 * b5 - white * 0.0168980;
      data[i] = (b0 + b1 + b2 + b3 + b4 + b5 + b6 + white * 0.5362) * 0.11;
      b6 = white * 0.115926;
    }
    return buffer;
  }

  // Generate brown noise buffer
  private createBrownNoiseBuffer(ctx: AudioContext): AudioBuffer {
    const bufferSize = ctx.sampleRate * 4;
    const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
    const data = buffer.getChannelData(0);
    let lastOut = 0.0;

    for (let i = 0; i < bufferSize; i++) {
      const white = Math.random() * 2 - 1;
      data[i] = (lastOut + 0.02 * white) / 1.02;
      lastOut = data[i];
      data[i] *= 3.5; // Compensate for low amplitude
    }
    return buffer;
  }

  // Generate white noise buffer
  private createWhiteNoiseBuffer(ctx: AudioContext): AudioBuffer {
    const bufferSize = ctx.sampleRate * 4;
    const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
    const data = buffer.getChannelData(0);
    for (let i = 0; i < bufferSize; i++) {
      data[i] = (Math.random() * 2 - 1) * 0.2;
    }
    return buffer;
  }

  // Start or adjust a soundscape track
  public setTrackVolume(trackId: string, volume: number) {
    this.init();
    if (!this.ctx) return;

    if (volume <= 0.01) {
      this.stopTrack(trackId);
      return;
    }

    if (!this.nodes[trackId]) {
      this.startTrack(trackId, volume);
    } else {
      this.nodes[trackId].gain.gain.setTargetAtTime(volume * 0.5, this.ctx.currentTime, 0.1);
    }
  }

  private startTrack(trackId: string, volume: number) {
    if (!this.ctx) return;

    const gainNode = this.ctx.createGain();
    gainNode.gain.setValueAtTime(volume * 0.5, this.ctx.currentTime);
    gainNode.connect(this.ctx.destination);

    if (trackId === 'pink') {
      const buffer = this.createPinkNoiseBuffer(this.ctx);
      const src = this.ctx.createBufferSource();
      src.buffer = buffer;
      src.loop = true;
      src.connect(gainNode);
      src.start();
      this.nodes[trackId] = { source: src, gain: gainNode };
    } else if (trackId === 'brown') {
      const buffer = this.createBrownNoiseBuffer(this.ctx);
      const src = this.ctx.createBufferSource();
      src.buffer = buffer;
      src.loop = true;
      src.connect(gainNode);
      src.start();
      this.nodes[trackId] = { source: src, gain: gainNode };
    } else if (trackId === 'white') {
      const buffer = this.createWhiteNoiseBuffer(this.ctx);
      const src = this.ctx.createBufferSource();
      src.buffer = buffer;
      src.loop = true;
      src.connect(gainNode);
      src.start();
      this.nodes[trackId] = { source: src, gain: gainNode };
    } else if (trackId === 'binaural-alpha') {
      // 10 Hz frequency difference (200 Hz Left, 210 Hz Right)
      const merger = this.ctx.createChannelMerger(2);
      const oscL = this.ctx.createOscillator();
      const oscR = this.ctx.createOscillator();
      oscL.frequency.setValueAtTime(200, this.ctx.currentTime);
      oscR.frequency.setValueAtTime(210, this.ctx.currentTime);
      oscL.connect(merger, 0, 0);
      oscR.connect(merger, 0, 1);
      merger.connect(gainNode);
      oscL.start();
      oscR.start();
      this.nodes[trackId] = { source: merger, gain: gainNode };
    } else if (trackId === 'binaural-theta') {
      // 6 Hz frequency difference (180 Hz Left, 186 Hz Right)
      const merger = this.ctx.createChannelMerger(2);
      const oscL = this.ctx.createOscillator();
      const oscR = this.ctx.createOscillator();
      oscL.frequency.setValueAtTime(180, this.ctx.currentTime);
      oscR.frequency.setValueAtTime(186, this.ctx.currentTime);
      oscL.connect(merger, 0, 0);
      oscR.connect(merger, 0, 1);
      merger.connect(gainNode);
      oscL.start();
      oscR.start();
      this.nodes[trackId] = { source: merger, gain: gainNode };
    } else if (trackId === 'rain') {
      // Filtered pink noise with periodic modulation
      const buffer = this.createPinkNoiseBuffer(this.ctx);
      const src = this.ctx.createBufferSource();
      src.buffer = buffer;
      src.loop = true;
      const filter = this.ctx.createBiquadFilter();
      filter.type = 'lowpass';
      filter.frequency.setValueAtTime(800, this.ctx.currentTime);
      src.connect(filter);
      filter.connect(gainNode);
      src.start();
      this.nodes[trackId] = { source: src, gain: gainNode };
    }
  }

  public stopTrack(trackId: string) {
    if (this.nodes[trackId]) {
      try {
        const { source, gain } = this.nodes[trackId];
        if (this.ctx) {
          gain.gain.setTargetAtTime(0, this.ctx.currentTime, 0.05);
        }
        if (source && 'stop' in source) {
          (source as AudioScheduledSourceNode).stop(this.ctx ? this.ctx.currentTime + 0.1 : 0);
        }
      } catch (e) {
        // Safe catch
      }
      delete this.nodes[trackId];
    }
  }

  public stopAll() {
    Object.keys(this.nodes).forEach((k) => this.stopTrack(k));
  }

  public playChime() {
    this.init();
    if (!this.ctx) return;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();
    osc.type = 'sine';
    osc.frequency.setValueAtTime(528, this.ctx.currentTime); // 528 Hz Solfeggio frequency
    osc.frequency.exponentialRampToValueAtTime(880, this.ctx.currentTime + 0.4);
    gain.gain.setValueAtTime(0.3, this.ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + 1.2);
    osc.connect(gain);
    gain.connect(this.ctx.destination);
    osc.start();
    osc.stop(this.ctx.currentTime + 1.2);
  }
}

export const soundscapeEngine = new SoundscapeEngine();
