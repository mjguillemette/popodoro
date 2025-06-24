import * as Tone from 'tone';
import { SoundType } from '@/types/audio';

class SoundManager {
  private synth: Tone.Synth | null = null;
  private isInitialized = false;

  constructor() {
    // Only initialize in browser environment
    if (typeof window !== 'undefined') {
      this.synth = new Tone.Synth().toDestination();
    }
  }

  async initialize() {
    if (!this.isInitialized && typeof window !== 'undefined' && this.synth) {
      await Tone.start();
      this.isInitialized = true;
    }
  }

  async playSound(type: SoundType, volume: number = 0.5) {
    if (!this.synth || typeof window === 'undefined') {
      return;
    }

    try {
      await this.initialize();
      
      switch (type) {
        case 'click':
          this.synth.volume.value = Tone.gainToDb(volume * 0.3);
          this.synth.triggerAttackRelease('C5', '0.1');
          break;
          
        case 'tick':
          this.synth.volume.value = Tone.gainToDb(volume * 0.1);
          this.synth.triggerAttackRelease('C4', '0.05');
          break;
          
        case 'success':
          this.synth.volume.value = Tone.gainToDb(volume * 0.4);
          // Play a pleasant chord progression
          this.synth.triggerAttackRelease('C5', '0.2');
          setTimeout(() => this.synth?.triggerAttackRelease('E5', '0.2'), 100);
          setTimeout(() => this.synth?.triggerAttackRelease('G5', '0.3'), 200);
          break;
          
        case 'complete':
          this.synth.volume.value = Tone.gainToDb(volume * 0.5);
          // Triumphant completion sound
          this.synth.triggerAttackRelease('C5', '0.2');
          setTimeout(() => this.synth?.triggerAttackRelease('E5', '0.2'), 150);
          setTimeout(() => this.synth?.triggerAttackRelease('G5', '0.2'), 300);
          setTimeout(() => this.synth?.triggerAttackRelease('C6', '0.4'), 450);
          break;
          
        case 'level-up':
          this.synth.volume.value = Tone.gainToDb(volume * 0.6);
          // Epic level up fanfare
          const notes = ['C5', 'D5', 'E5', 'F5', 'G5', 'A5', 'B5', 'C6'];
          notes.forEach((note, index) => {
            setTimeout(() => this.synth?.triggerAttackRelease(note, '0.15'), index * 80);
          });
          break;
          
        case 'achievement':
          this.synth.volume.value = Tone.gainToDb(volume * 0.5);
          // Achievement notification
          this.synth.triggerAttackRelease('A5', '0.15');
          setTimeout(() => this.synth?.triggerAttackRelease('C6', '0.15'), 100);
          setTimeout(() => this.synth?.triggerAttackRelease('E6', '0.25'), 200);
          break;
      }
    } catch (error) {
      console.warn('Failed to play sound:', error);
    }
  }

  setVolume(volume: number) {
    if (this.synth) {
      this.synth.volume.value = Tone.gainToDb(volume);
    }
  }

  dispose() {
    if (this.synth) {
      this.synth.dispose();
    }
  }
}

export const soundManager = new SoundManager();