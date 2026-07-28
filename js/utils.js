/**
 * utils.js
 * --------
 * Utility and helper functions for mathematical calculations, time formatting,
 * star rating evaluation, string sanitization, and Web Audio sound synthesizer.
 */

import * as config from './config.js';

export function formatTime(seconds) {
    if (seconds < 0) seconds = 0;
    const totalSecs = Math.round(seconds);
    const mins = Math.floor(totalSecs / 60);
    const secs = totalSecs % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
}

export function calculateWPM(correctChars, elapsedSeconds) {
    if (elapsedSeconds <= 0 || correctChars <= 0) return 0.0;
    const elapsedMinutes = elapsedSeconds / 60.0;
    const words = correctChars / 5.0;
    return Math.round((words / elapsedMinutes) * 10) / 10;
}

export function calculateCPM(correctChars, elapsedSeconds) {
    if (elapsedSeconds <= 0 || correctChars <= 0) return 0.0;
    const elapsedMinutes = elapsedSeconds / 60.0;
    return Math.round((correctChars / elapsedMinutes) * 10) / 10;
}

export function calculateAccuracy(correctPresses, totalPresses) {
    if (totalPresses <= 0) return 100.0;
    if (correctPresses < 0) correctPresses = 0;
    const acc = (correctPresses / totalPresses) * 100.0;
    return Math.round(Math.min(100.0, Math.max(0.0, acc)) * 10) / 10;
}

export function calculateStars(wpm, accuracy) {
    if (wpm >= 40.0 && accuracy >= 95.0) return 3;
    if (wpm >= 25.0 && accuracy >= 85.0) return 2;
    return 1;
}

export function sanitizeUsername(username) {
    if (!username) return "";
    return username.trim().substring(0, 20);
}

export function getCharacterGroup(char) {
    if (config.KEYBOARD_HOME_ROW.has(char)) return config.KEY_GROUP_HOME_ROW;
    if (config.KEYBOARD_TOP_ROW.has(char)) return config.KEY_GROUP_TOP_ROW;
    if (config.KEYBOARD_BOTTOM_ROW.has(char)) return config.KEY_GROUP_BOTTOM_ROW;
    if (config.KEYBOARD_NUMBERS.has(char)) return config.KEY_GROUP_NUMBERS;
    if (config.KEYBOARD_SYMBOLS.has(char)) return config.KEY_GROUP_SYMBOLS;
    return config.KEY_GROUP_SPACE_OTHER;
}

/**
 * Web Audio API Sound Effects Synthesizer
 */
export class SoundEffects {
    constructor() {
        this.ctx = null;
        this.enabled = true;
    }

    init() {
        if (!this.ctx && typeof window !== 'undefined') {
            const AudioContext = window.AudioContext || window.webkitAudioContext;
            if (AudioContext) {
                this.ctx = new AudioContext();
            }
        }
    }

    playClick() {
        if (!this.enabled) return;
        this.init();
        if (!this.ctx) return;

        try {
            const osc = this.ctx.createOscillator();
            const gain = this.ctx.createGain();

            osc.type = 'sine';
            osc.frequency.setValueAtTime(600, this.ctx.currentTime);
            osc.frequency.exponentialRampToValueAtTime(150, this.ctx.currentTime + 0.04);

            gain.gain.setValueAtTime(0.15, this.ctx.currentTime);
            gain.gain.exponentialRampToValueAtTime(0.01, this.ctx.currentTime + 0.04);

            osc.connect(gain);
            gain.connect(this.ctx.destination);

            osc.start();
            osc.stop(this.ctx.currentTime + 0.04);
        } catch (e) {
            // Ignore audio context errors
        }
    }

    playMistake() {
        if (!this.enabled) return;
        this.init();
        if (!this.ctx) return;

        try {
            const osc = this.ctx.createOscillator();
            const gain = this.ctx.createGain();

            osc.type = 'sawtooth';
            osc.frequency.setValueAtTime(150, this.ctx.currentTime);
            osc.frequency.linearRampToValueAtTime(80, this.ctx.currentTime + 0.12);

            gain.gain.setValueAtTime(0.2, this.ctx.currentTime);
            gain.gain.exponentialRampToValueAtTime(0.01, this.ctx.currentTime + 0.12);

            osc.connect(gain);
            gain.connect(this.ctx.destination);

            osc.start();
            osc.stop(this.ctx.currentTime + 0.12);
        } catch (e) {
            // Ignore audio context errors
        }
    }
}

export const soundFx = new SoundEffects();
