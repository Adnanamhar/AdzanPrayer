// src/lib/notification-sound.ts
// Script untuk menghasilkan suara Beep menggunakan Web Audio API

class NotificationSound {
  private audioCtx: AudioContext | null = null;

  init() {
    if (typeof window === "undefined") return;
    if (!this.audioCtx) {
      this.audioCtx = new (window.AudioContext || (window as any).webkitAudioContext)();
    }
  }

  unlock() {
    this.init();
    if (this.audioCtx?.state === 'suspended') {
      this.audioCtx.resume();
    }
  }

  playAdzan() {
    this.unlock();

    // Generate adzan alarm beep sound: 3 distinct alarm beeps
    this.beep(520, 200, 400);
    setTimeout(() => this.beep(520, 200, 400), 700);
    setTimeout(() => this.beep(650, 250, 800), 1400);
  }

  beep(frequency: number, volume: number, duration: number) {
    if (!this.audioCtx) this.init();
    if (this.audioCtx?.state === 'suspended') {
      this.audioCtx.resume();
    }
    if (!this.audioCtx) return;

    try {
      const oscillator = this.audioCtx.createOscillator();
      const gainNode = this.audioCtx.createGain();

      oscillator.connect(gainNode);
      gainNode.connect(this.audioCtx.destination);

      oscillator.type = 'sine';
      oscillator.frequency.value = frequency;
      gainNode.gain.value = volume * 0.01;

      oscillator.start(this.audioCtx.currentTime);
      oscillator.stop(this.audioCtx.currentTime + duration * 0.001);
    } catch (e) {
      console.warn("AudioContext error:", e);
    }
  }
}

export const notificationSound = new NotificationSound();
