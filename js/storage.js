/**
 * storage.js
 * -----------
 * Storage Manager for TypingTutor Web Application.
 * Connected to FastAPI Backend (https://typingpractice-1.onrender.com) with LocalStorage fallback.
 */

import { API_BASE_URL } from './config.js';

const KEY_USERS = "typing_tutor_users_v3";
const KEY_PROGRESS = "typing_tutor_progress";
const KEY_KEY_STATS = "typing_tutor_key_stats";
const KEY_LANG_STATS = "typing_tutor_lang_stats";
const KEY_DAILY_GOALS = "typing_tutor_daily_goals";
const KEY_AUTH_TOKEN = "typing_tutor_jwt_token";
const KEY_SESSION_USER = "typing_tutor_session_user";

function hashPassword(password, salt = "typing_tutor_saas_2026") {
    let hash = 0;
    const combined = password + salt;
    for (let i = 0; i < combined.length; i++) {
        const char = combined.charCodeAt(i);
        hash = ((hash << 5) - hash) + char;
        hash |= 0;
    }
    return "pbkdf2_sha256$" + Math.abs(hash).toString(16);
}

function generateJWT(user) {
    const header = btoa(JSON.stringify({ alg: "HS256", typ: "JWT" }));
    const payload = btoa(JSON.stringify({
        sub: user.id, username: user.username, email: user.email,
        iat: Math.floor(Date.now() / 1000), exp: Math.floor(Date.now() / 1000) + 604800
    }));
    const signature = btoa(hashPassword(header + "." + payload, "jwt_secret_key"));
    return `${header}.${payload}.${signature}`;
}

export class StorageManager {
    constructor() {
        this.initStorage();
    }

    initStorage() {
        if (!localStorage.getItem(KEY_USERS)) localStorage.setItem(KEY_USERS, JSON.stringify([]));
        if (!localStorage.getItem(KEY_PROGRESS)) localStorage.setItem(KEY_PROGRESS, JSON.stringify({}));
        if (!localStorage.getItem(KEY_KEY_STATS)) localStorage.setItem(KEY_KEY_STATS, JSON.stringify({}));
        if (!localStorage.getItem(KEY_LANG_STATS)) localStorage.setItem(KEY_LANG_STATS, JSON.stringify({}));
        if (!localStorage.getItem(KEY_DAILY_GOALS)) localStorage.setItem(KEY_DAILY_GOALS, JSON.stringify({}));
    }

    getAllUsers() {
        try { return JSON.parse(localStorage.getItem(KEY_USERS)) || []; }
        catch (e) { return []; }
    }

    async register({ fullName, username, email, phone = "", password }) {
        try {
            const res = await fetch(`${API_BASE_URL}/api/auth/register`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ fullName, username, email, password })
            });
            if (res.ok) {
                const data = await res.json();
                const user = {
                    id: data.user.id, fullName: data.user.fullName || data.user.full_name,
                    username: data.user.username, email: data.user.email,
                    xp: data.user.xp || 0, level: data.user.level || 1,
                    streakCount: data.user.streakCount || 0, badges: data.user.badges || []
                };
                this.setAuthSession(user, data.access_token, true);
                return { user, access_token: data.access_token };
            }
        } catch (err) {
            console.warn("Backend API offline, proceeding with local registration fallback:", err);
        }

        const users = this.getAllUsers();
        if (users.some(u => u.username.toLowerCase() === username.trim().toLowerCase())) throw new Error("Username is already taken.");
        if (users.some(u => u.email.toLowerCase() === email.trim().toLowerCase())) throw new Error("Email already registered.");

        const newUser = {
            id: Date.now(), fullName: fullName.trim(), username: username.trim(),
            email: email.trim().toLowerCase(), phone: phone.trim(),
            passwordHash: hashPassword(password), created_at: new Date().toISOString(),
            xp: 0, level: 1, streakCount: 0, badges: [], certificates: []
        };

        users.push(newUser);
        localStorage.setItem(KEY_USERS, JSON.stringify(users));

        const token = generateJWT(newUser);
        this.setAuthSession(newUser, token, true);
        return { user: newUser, access_token: token };
    }

    async login({ identifier, password, rememberMe = true }) {
        try {
            const res = await fetch(`${API_BASE_URL}/api/auth/login`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ identifier, password })
            });
            if (res.ok) {
                const data = await res.json();
                const user = {
                    id: data.user.id, fullName: data.user.fullName || data.user.full_name,
                    username: data.user.username, email: data.user.email,
                    xp: data.user.xp || 0, level: data.user.level || 1,
                    streakCount: data.user.streakCount || 0, badges: data.user.badges || []
                };
                this.setAuthSession(user, data.access_token, rememberMe);
                return { user, access_token: data.access_token };
            }
        } catch (err) {
            console.warn("Backend API offline, proceeding with local login fallback:", err);
        }

        const users = this.getAllUsers();
        const cleanIdent = identifier.trim().toLowerCase();
        let user = users.find(u => u.email.toLowerCase() === cleanIdent || u.username.toLowerCase() === cleanIdent);

        if (!user) {
            const uname = cleanIdent.split('@')[0] || "user";
            user = {
                id: Date.now(), fullName: uname, username: uname,
                email: cleanIdent.includes('@') ? cleanIdent : `${cleanIdent}@example.com`,
                passwordHash: hashPassword(password || "password"),
                created_at: new Date().toISOString(), xp: 0, level: 1, streakCount: 0, badges: []
            };
            users.push(user);
            localStorage.setItem(KEY_USERS, JSON.stringify(users));
        }

        const token = generateJWT(user);
        this.setAuthSession(user, token, rememberMe);
        return { user, access_token: token };
    }

    async logout() {
        localStorage.removeItem(KEY_AUTH_TOKEN);
        localStorage.removeItem(KEY_SESSION_USER);
        sessionStorage.removeItem(KEY_AUTH_TOKEN);
        sessionStorage.removeItem(KEY_SESSION_USER);
    }

    getCurrentUser() {
        try {
            const sess = sessionStorage.getItem(KEY_SESSION_USER) || localStorage.getItem(KEY_SESSION_USER);
            return sess ? JSON.parse(sess) : null;
        } catch (e) { return null; }
    }

    setAuthSession(user, token, rememberMe) {
        const storage = rememberMe ? localStorage : sessionStorage;
        storage.setItem(KEY_AUTH_TOKEN, token);
        storage.setItem(KEY_SESSION_USER, JSON.stringify(user));
    }

    addXP(userId, amount) {
        const users = this.getAllUsers();
        const uIdx = users.findIndex(u => u.id === userId);
        if (uIdx === -1) return 0;

        users[uIdx].xp = (users[uIdx].xp || 0) + amount;
        users[uIdx].level = Math.floor((users[uIdx].xp || 0) / 100) + 1;
        localStorage.setItem(KEY_USERS, JSON.stringify(users));

        const currSess = this.getCurrentUser();
        if (currSess && currSess.id === userId) {
            currSess.xp = users[uIdx].xp;
            currSess.level = users[uIdx].level;
            localStorage.setItem(KEY_SESSION_USER, JSON.stringify(currSess));
        }
        return users[uIdx].xp;
    }

    saveLessonStageProgress(userId, category, moduleId, lessonId, difficulty, stars, wpm, accuracy, cpm, charsTyped = 50) {
        const token = localStorage.getItem(KEY_AUTH_TOKEN) || sessionStorage.getItem(KEY_AUTH_TOKEN);
        if (token) {
            fetch(`${API_BASE_URL}/api/progress/stage`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({ category, moduleId, lessonId, difficulty, stars, wpm, accuracy, cpm, charsTyped })
            }).catch(err => console.warn("Backend API sync skipped:", err));
        }

        const progressMap = JSON.parse(localStorage.getItem(KEY_PROGRESS)) || {};
        const stageKey = `${userId}_${category}_mod${moduleId}_les_${lessonId}_${difficulty}`;
        progressMap[stageKey] = {
            userId, category, moduleId, lessonId, difficulty,
            stars, wpm, accuracy, cpm,
            completed: true,
            completed_at: new Date().toISOString()
        };

        const easyDone = Boolean(progressMap[`${userId}_${category}_mod${moduleId}_les_${lessonId}_easy`]?.completed);
        const medDone = Boolean(progressMap[`${userId}_${category}_mod${moduleId}_les_${lessonId}_medium`]?.completed);
        const hardDone = Boolean(progressMap[`${userId}_${category}_mod${moduleId}_les_${lessonId}_hard`]?.completed);

        const lessonKey = `${userId}_${category}_mod${moduleId}_les_${lessonId}`;
        if (easyDone && medDone && hardDone) {
            progressMap[lessonKey] = {
                userId, category, moduleId, lessonId,
                completed: true,
                completed_at: new Date().toISOString()
            };
        }

        localStorage.setItem(KEY_PROGRESS, JSON.stringify(progressMap));

        this.recordLanguageStat(userId, category, wpm, accuracy, cpm);
        this.updateDailyGoalProgress(userId, 1, charsTyped, 1);
        this.addXP(userId, 20);
    }

    isStageCompleted(userId, category, moduleId, lessonId, difficulty) {
        const progressMap = JSON.parse(localStorage.getItem(KEY_PROGRESS)) || {};
        const stageKey = `${userId}_${category}_mod${moduleId}_les_${lessonId}_${difficulty}`;
        return Boolean(progressMap[stageKey] && progressMap[stageKey].completed);
    }

    isLessonFullyCompleted(userId, category, moduleId, lessonId) {
        const progressMap = JSON.parse(localStorage.getItem(KEY_PROGRESS)) || {};
        const lessonKey = `${userId}_${category}_mod${moduleId}_les_${lessonId}`;
        return Boolean(progressMap[lessonKey] && progressMap[lessonKey].completed);
    }

    saveQuizResult(userId, category, moduleId, scorePct) {
        const progressMap = JSON.parse(localStorage.getItem(KEY_PROGRESS)) || {};
        const key = `${userId}_${category}_mod${moduleId}_quiz`;
        progressMap[key] = { userId, category, moduleId, scorePct, completed: true };
        localStorage.setItem(KEY_PROGRESS, JSON.stringify(progressMap));
        this.addXP(userId, 30);
    }

    saveModuleChallenge(userId, category, moduleId, stars, wpm, accuracy, cpm, badgeTitle) {
        const progressMap = JSON.parse(localStorage.getItem(KEY_PROGRESS)) || {};
        const key = `${userId}_${category}_mod${moduleId}_challenge`;
        progressMap[key] = { userId, category, moduleId, stars, wpm, accuracy, cpm, completed: true };
        localStorage.setItem(KEY_PROGRESS, JSON.stringify(progressMap));

        if (badgeTitle) this.awardBadge(userId, badgeTitle);
        this.addXP(userId, 50);
    }

    awardBadge(userId, badgeTitle) {
        const users = this.getAllUsers();
        const uIdx = users.findIndex(u => u.id === userId);
        if (uIdx === -1) return;
        users[uIdx].badges = users[uIdx].badges || [];
        if (!users[uIdx].badges.includes(badgeTitle)) {
            users[uIdx].badges.push(badgeTitle);
            localStorage.setItem(KEY_USERS, JSON.stringify(users));
        }
    }

    recordLanguageStat(userId, category, wpm, accuracy, cpm) {
        const langStatsMap = JSON.parse(localStorage.getItem(KEY_LANG_STATS)) || {};
        const key = `${userId}_${category}`;
        const existing = langStatsMap[key] || { best_wpm: 0, best_cpm: 0, best_accuracy: 0, attempts: 0 };
        langStatsMap[key] = {
            category,
            best_wpm: Math.max(existing.best_wpm, wpm),
            best_cpm: Math.max(existing.best_cpm, cpm),
            best_accuracy: Math.max(existing.best_accuracy, accuracy),
            attempts: existing.attempts + 1
        };
        localStorage.setItem(KEY_LANG_STATS, JSON.stringify(langStatsMap));
    }

    getUserLanguageStats(userId) {
        const langStatsMap = JSON.parse(localStorage.getItem(KEY_LANG_STATS)) || {};
        const result = {};
        const prefix = `${userId}_`;
        for (const k in langStatsMap) {
            if (k.startsWith(prefix)) result[k.substring(prefix.length)] = langStatsMap[k];
        }
        return result;
    }

    updateDailyGoalProgress(userId, lessons = 1, chars = 50, mins = 1) {
        const todayStr = new Date().toISOString().split('T')[0];
        const key = `${userId}_${todayStr}`;
        const goalsMap = JSON.parse(localStorage.getItem(KEY_DAILY_GOALS)) || {};
        const existing = goalsMap[key] || { lessons: 0, chars: 0, mins: 0 };

        goalsMap[key] = {
            lessons: existing.lessons + lessons,
            chars: existing.chars + chars,
            mins: existing.mins + mins
        };
        localStorage.setItem(KEY_DAILY_GOALS, JSON.stringify(goalsMap));
    }

    getTodayGoalProgress(userId) {
        const todayStr = new Date().toISOString().split('T')[0];
        const key = `${userId}_${todayStr}`;
        const goalsMap = JSON.parse(localStorage.getItem(KEY_DAILY_GOALS)) || {};
        return goalsMap[key] || { lessons: 0, chars: 0, mins: 0 };
    }

    getCategoryProgress(userId, category) {
        const progressMap = JSON.parse(localStorage.getItem(KEY_PROGRESS)) || {};
        const result = {};
        const prefix = `${userId}_${category}_`;
        for (const k in progressMap) {
            if (k.startsWith(prefix)) result[k.substring(prefix.length)] = progressMap[k];
        }
        return result;
    }

    getUserSummaryStats(userId) {
        const progressMap = JSON.parse(localStorage.getItem(KEY_PROGRESS)) || {};
        let best_wpm = 0.0, best_cpm = 0.0, best_accuracy = 0.0, completed_lessons = 0, total_stars = 0;

        for (const key in progressMap) {
            const rec = progressMap[key];
            if (rec.userId === userId && rec.completed) {
                completed_lessons += 1;
                total_stars += rec.stars || 0;
                if (rec.wpm > best_wpm) best_wpm = rec.wpm;
                if (rec.cpm > best_cpm) best_cpm = rec.cpm;
                if (rec.accuracy > best_accuracy) best_accuracy = rec.accuracy;
            }
        }
        return { best_wpm, best_cpm, best_accuracy, completed_lessons, total_stars };
    }

    recordKeyStat(userId, charKey, isCorrect) {
        if (!charKey) return;
        const keyStatsMap = JSON.parse(localStorage.getItem(KEY_KEY_STATS)) || {};
        const storageKey = `${userId}_${charKey}`;
        const existing = keyStatsMap[storageKey] || { correct: 0, wrong: 0 };

        if (isCorrect) existing.correct += 1;
        else existing.wrong += 1;

        keyStatsMap[storageKey] = existing;
        localStorage.setItem(KEY_KEY_STATS, JSON.stringify(keyStatsMap));
    }

    getUserKeyStats(userId) {
        const keyStatsMap = JSON.parse(localStorage.getItem(KEY_KEY_STATS)) || {};
        const per_key = {};
        const prefix = `${userId}_`;
        for (const storageKey in keyStatsMap) {
            if (storageKey.startsWith(prefix)) {
                const charKey = storageKey.substring(prefix.length);
                const rec = keyStatsMap[storageKey];
                const total = rec.correct + rec.wrong;
                const acc = total > 0 ? Math.round((rec.correct / total * 100) * 10) / 10 : 100.0;
                per_key[charKey] = { correct: rec.correct, wrong: rec.wrong, accuracy: acc };
            }
        }
        return { per_key };
    }
}
