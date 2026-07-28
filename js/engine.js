/**
 * engine.js
 * ---------
 * Core Typing Engine for TypingTutor Web Application.
 * Handles character-by-character typing verification, cursor progression,
 * strict error locking, timing, live WPM/CPM/Accuracy calculations,
 * and per-key mistake logging.
 */

import { formatTime, calculateWPM, calculateCPM, calculateAccuracy, calculateStars, soundFx } from './utils.js';

export class TypingEngine {
    constructor(targetText, user = null) {
        // Normalize line endings to \n
        this.targetText = targetText.replace(/\r\n/g, "\n").replace(/\r/g, "\n");
        this.user = user;

        this.currentIndex = 0;
        this.correctCharsCount = 0;
        this.correctKeyPresses = 0;
        this.totalKeyPresses = 0;
        this.mistakesCount = 0;

        this.startTime = null;
        this.endTime = null;
        this.isActive = false;
        this.isFinished = false;

        this.sessionKeyCorrect = {};
        this.sessionKeyMistakes = {};
    }

    startSession() {
        this.currentIndex = 0;
        this.correctCharsCount = 0;
        this.correctKeyPresses = 0;
        this.totalKeyPresses = 0;
        this.mistakesCount = 0;
        this.sessionKeyCorrect = {};
        this.sessionKeyMistakes = {};
        this.startTime = null;
        this.endTime = null;
        this.isActive = true;
        this.isFinished = false;
    }

    handleKeyPress(typedChar) {
        if (this.isFinished || !this.targetText) {
            return { status: "finished", correct: false, index: this.currentIndex };
        }

        if (this.startTime === null) {
            this.startTime = performance.now() / 1000.0;
            this.isActive = true;
        }

        const expectedChar = this.targetText[this.currentIndex];
        this.totalKeyPresses += 1;

        const isCorrect = (typedChar === expectedChar);

        if (isCorrect) {
            soundFx.playClick();
            this.correctCharsCount += 1;
            this.correctKeyPresses += 1;
            this.sessionKeyCorrect[expectedChar] = (this.sessionKeyCorrect[expectedChar] || 0) + 1;
            this.currentIndex += 1;

            if (this.user) {
                this.user.recordKeyPress(expectedChar, true);
            }

            if (this.currentIndex >= this.targetText.length) {
                this.endTime = performance.now() / 1000.0;
                this.isFinished = true;
                this.isActive = false;
            }

            return {
                status: this.isFinished ? "completed" : "correct",
                correct: true,
                typedChar,
                expectedChar,
                index: this.currentIndex,
                isFinished: this.isFinished
            };
        } else {
            soundFx.playMistake();
            this.mistakesCount += 1;
            this.sessionKeyMistakes[expectedChar] = (this.sessionKeyMistakes[expectedChar] || 0) + 1;

            if (this.user) {
                this.user.recordKeyPress(expectedChar, false);
            }

            return {
                status: "wrong",
                correct: false,
                typedChar,
                expectedChar,
                index: this.currentIndex,
                isFinished: false
            };
        }
    }

    getElapsedSeconds() {
        if (this.startTime === null) return 0.0;
        if (this.endTime !== null) {
            return Math.max(0.0, this.endTime - this.startTime);
        }
        const now = performance.now() / 1000.0;
        return Math.max(0.0, now - this.startTime);
    }

    getFormattedTime() {
        return formatTime(this.getElapsedSeconds());
    }

    getWPM() {
        return calculateWPM(this.correctCharsCount, this.getElapsedSeconds());
    }

    getCPM() {
        return calculateCPM(this.correctCharsCount, this.getElapsedSeconds());
    }

    getAccuracy() {
        return calculateAccuracy(this.correctKeyPresses, this.totalKeyPresses);
    }

    getStars() {
        return calculateStars(this.getWPM(), this.getAccuracy());
    }

    getSessionSummary() {
        const elapsed = this.getElapsedSeconds();
        const wpm = this.getWPM();
        const cpm = this.getCPM();
        const acc = this.getAccuracy();
        const stars = this.getStars();

        const allKeys = new Set([...Object.keys(this.sessionKeyCorrect), ...Object.keys(this.sessionKeyMistakes)]);
        const keyStats = {};

        allKeys.forEach(k => {
            const corr = this.sessionKeyCorrect[k] || 0;
            const wrg = this.sessionKeyMistakes[k] || 0;
            const tot = corr + wrg;
            const keyAcc = tot > 0 ? Math.round((corr / tot * 100) * 10) / 10 : 100.0;
            keyStats[k] = { correct: corr, wrong: wrg, accuracy: keyAcc };
        });

        return {
            lessonLength: this.targetText.length,
            wpm,
            cpm,
            accuracy: acc,
            stars,
            mistakes: this.mistakesCount,
            correctChars: this.correctCharsCount,
            totalKeyPresses: this.totalKeyPresses,
            elapsedSeconds: elapsed,
            formattedTime: formatTime(elapsed),
            keyStats
        };
    }
}
