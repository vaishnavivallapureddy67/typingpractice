/**
 * user.js
 * -------
 * User Domain Model for TypingTutor Web Application.
 * Enforces sequential lesson unlocks (Lesson N unlocks only when Lesson N-1 completed easy, medium, hard)
 * and stage unlocking (Easy -> Medium -> Hard).
 */

import { CURRICULUM_DATA } from './curriculum.js';

export class User {
    constructor(userData, storageManager) {
        this.userId = userData.id;
        this.username = userData.username;
        this.fullName = userData.fullName || userData.username;
        this.email = userData.email || "";
        this.phone = userData.phone || "";
        this.avatar = userData.avatar || "👤";
        this.created_at = userData.created_at || new Date().toISOString();
        this.xp = userData.xp || 0;
        this.level = userData.level || (Math.floor(this.xp / 100) + 1);
        this.streakCount = userData.streakCount || 0;
        this.badges = userData.badges || [];
        this.certificates = userData.certificates || [];
        this.storageManager = storageManager;

        this.best_wpm = 0.0;
        this.best_cpm = 0.0;
        this.best_accuracy = 0.0;
        this.completed_lessons = 0;
        this.total_stars = 0;

        this.refreshStats();
    }

    refreshStats() {
        const summary = this.storageManager.getUserSummaryStats(this.userId);
        this.best_wpm = summary.best_wpm || 0.0;
        this.best_cpm = summary.best_cpm || 0.0;
        this.best_accuracy = summary.best_accuracy || 0.0;
        this.completed_lessons = summary.completed_lessons || 0;
        this.total_stars = summary.total_stars || 0;

        const curr = this.storageManager.getCurrentUser();
        if (curr) {
            this.xp = curr.xp || this.xp;
            this.level = curr.level || this.level;
            this.badges = curr.badges || this.badges;
        }
    }

    addXP(amount) {
        this.xp = this.storageManager.addXP(this.userId, amount);
        this.level = Math.floor(this.xp / 100) + 1;
    }

    completeLessonStage(category, moduleId, lessonId, difficulty, stars, wpm, accuracy, cpm, charsTyped) {
        this.storageManager.saveLessonStageProgress(this.userId, category, moduleId, lessonId, difficulty, stars, wpm, accuracy, cpm, charsTyped);
        this.refreshStats();
    }

    completeQuiz(category, moduleId, scorePct) {
        this.storageManager.saveQuizResult(this.userId, category, moduleId, scorePct);
        this.refreshStats();
    }

    completeModuleChallenge(category, moduleId, stars, wpm, accuracy, cpm, badgeTitle) {
        this.storageManager.saveModuleChallenge(this.userId, category, moduleId, stars, wpm, accuracy, cpm, badgeTitle);
        this.refreshStats();
    }

    isModuleUnlocked(category, moduleId) {
        if (moduleId <= 1) return true;
        const prevModKey = `mod${moduleId - 1}_challenge`;
        const prog = this.storageManager.getCategoryProgress(this.userId, category);
        return Boolean(prog[prevModKey] && prog[prevModKey].completed);
    }

    isLessonUnlocked(category, moduleId, lessonIdx) {
        if (!this.isModuleUnlocked(category, moduleId)) return false;
        if (lessonIdx <= 0) return true; // Lesson 1 is always unlocked in unlocked module

        const langData = CURRICULUM_DATA[category];
        if (!langData) return false;
        const module = langData.modules.find(m => m.id === moduleId);
        if (!module) return false;

        const prevLesson = module.lessons[lessonIdx - 1];
        if (!prevLesson) return true;

        // Unlock Lesson N ONLY IF Lesson N-1 is fully completed (easy, medium, hard)
        return this.storageManager.isLessonFullyCompleted(this.userId, category, moduleId, prevLesson.id);
    }

    isDifficultyUnlocked(category, moduleId, lessonId, difficulty) {
        if (difficulty === 'easy') return true;
        if (difficulty === 'medium') {
            return this.storageManager.isStageCompleted(this.userId, category, moduleId, lessonId, 'easy');
        }
        if (difficulty === 'hard') {
            return this.storageManager.isStageCompleted(this.userId, category, moduleId, lessonId, 'medium');
        }
        return false;
    }

    getCategoryProgress(category) {
        return this.storageManager.getCategoryProgress(this.userId, category);
    }

    getLanguageCompletionPct(category) {
        const langData = CURRICULUM_DATA[category];
        if (!langData) return 0.0;

        const totalMods = langData.modules.length;
        if (totalMods === 0) return 0.0;

        const prog = this.getCategoryProgress(category);
        let completedMods = 0;

        langData.modules.forEach(mod => {
            if (prog[`mod${mod.id}_challenge`]?.completed) {
                completedMods += 1;
            }
        });

        const pct = (completedMods / totalMods) * 100.0;
        return Math.round(pct * 10) / 10;
    }

    getOverallCompletionPercentage() {
        const cats = Object.keys(CURRICULUM_DATA);
        if (cats.length === 0) return 0.0;

        let totalPct = 0.0;
        cats.forEach(c => {
            totalPct += this.getLanguageCompletionPct(c);
        });

        return Math.round((totalPct / cats.length) * 10) / 10;
    }
}
