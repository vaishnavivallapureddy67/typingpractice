/**
 * ai_coach.js
 * -----------
 * AI Coach & Dynamic Exercise Generator for TypingTutor Web Application.
 * Generates dynamic practice exercises, weekly analytics reports, and personalized tips.
 */

import { CURRICULUM_DATA } from './curriculum.js';

export class AICoach {
    getWeakKeys(user, topN = 5) {
        if (!user || !user.storageManager) return [];
        const stats = user.storageManager.getUserKeyStats(user.userId);
        const perKey = stats.per_key || {};
        const weakList = [];

        for (const key in perKey) {
            const data = perKey[key];
            if (data.wrong > 0) {
                weakList.push({ key, correct: data.correct, wrong: data.wrong, accuracy: data.accuracy });
            }
        }
        weakList.sort((a, b) => b.wrong - a.wrong || a.accuracy - b.accuracy);
        return weakList.slice(0, topN);
    }

    generateAIPracticeSnippet(category, concept = "general") {
        const langData = CURRICULUM_DATA[category] || CURRICULUM_DATA["python"];
        const modules = langData.modules || [];
        const randomMod = modules[Math.floor(Math.random() * modules.length)];
        const randomLes = randomMod.lessons[Math.floor(Math.random() * randomMod.lessons.length)];

        const exercises = randomLes.exercises || {};
        return exercises.hard || exercises.medium || exercises.easy || "print('AI Practice Exercise')";
    }

    generateWeeklyReport(user) {
        if (!user) return null;

        const summary = user.storageManager.getUserSummaryStats(user.userId);
        const weakKeys = this.getWeakKeys(user, 3);
        const weakStr = weakKeys.length > 0 ? weakKeys.map(k => `'${k.key}'`).join(", ") : "None";

        return {
            wpmTrend: summary.best_wpm > 0 ? `↑ ${summary.best_wpm.toFixed(1)} WPM` : "0.0 WPM",
            accuracyTrend: summary.best_accuracy > 0 ? `↑ ${summary.best_accuracy.toFixed(1)}%` : "0.0%",
            lessonsCompleted: `↑ ${summary.completed_levels} Lessons`,
            weakKeysFocus: weakStr
        };
    }

    generateInsights(user) {
        if (!user || user.completed_lessons === 0) {
            return ["🚀 Welcome! Start your first module in Python or HTML to generate personalized AI Coaching insights."];
        }

        const insights = [];
        const weakKeys = this.getWeakKeys(user, 3);

        if (weakKeys.length > 0) {
            const keyNames = weakKeys.map(item => `'${item.key}' (${item.accuracy}%)`).join(", ");
            insights.push(`🎯 Focus Area: You mistype ${keyNames}. Re-run standalone practice on these keys.`);
        } else {
            insights.push("🌟 Clean Typing! Your key accuracy is looking sharp across all rows.");
        }

        if (user.best_wpm >= 40.0) {
            insights.push("⚡ High Speed: Speed is over 40 WPM! Focus on 98%+ accuracy on hard code snippets.");
        } else if (user.best_wpm > 0) {
            insights.push("📈 Speed Building: Keep practicing regularly to push your WPM above 40 WPM.");
        }

        return insights;
    }

    recommendNextLesson(user) {
        if (!user) return { category: "python", category_display: "Python Programming", module_id: 1, lesson_id: "py-1-1" };

        for (const [cat, langObj] of Object.entries(CURRICULUM_DATA)) {
            const prog = user.getCategoryProgress(cat);
            for (const mod of langObj.modules) {
                if (!prog[`mod${mod.id}_challenge`]?.completed) {
                    return {
                        category: cat,
                        category_display: langObj.title,
                        module_id: mod.id,
                        lesson_id: mod.lessons[0]?.id || "les-1"
                    };
                }
            }
        }

        return { category: "python", category_display: "Python Programming", module_id: 10, lesson_id: "py-10-1" };
    }
}
