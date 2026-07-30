/**
 * app.js
 * ------
 * Application entry point & controller.
 */

import { CURRICULUM_DATA, CAREER_TRACKS, searchCurriculumTopics } from './curriculum.js';
import { StorageManager } from './storage.js';
import { User, LevelManager, TypingEngine, AICoach } from './models.js';
import { API_BASE_URL } from './config.js';

window.GOOGLE_CLIENT_ID = window.GOOGLE_CLIENT_ID || "";

window.switchAuthView = function (viewName) {
    const viewLogin = document.getElementById('view-login');
    const viewSignup = document.getElementById('view-signup');
    const viewForgot = document.getElementById('view-forgot');
    const viewReset = document.getElementById('view-reset');

    if (viewLogin) viewLogin.style.display = viewName === 'login' ? 'block' : 'none';
    if (viewSignup) viewSignup.style.display = viewName === 'signup' ? 'block' : 'none';
    if (viewForgot) viewForgot.style.display = viewName === 'forgot' ? 'block' : 'none';
    if (viewReset) viewReset.style.display = viewName === 'reset' ? 'block' : 'none';

    const banner = document.getElementById('auth-alert-banner');
    if (banner) banner.style.display = 'none';
};

window.togglePasswordVisibility = function (inputId, btnId) {
    const input = document.getElementById(inputId);
    const btn = document.getElementById(btnId);
    if (!input) return;

    if (input.type === 'password') {
        input.type = 'text';
        if (btn) {
            const textSpan = btn.querySelector('.eye-text');
            const iconSpan = btn.querySelector('.eye-icon');
            if (textSpan) textSpan.textContent = 'HIDE';
            if (iconSpan) iconSpan.textContent = '🙈';
        }
    } else {
        input.type = 'password';
        if (btn) {
            const textSpan = btn.querySelector('.eye-text');
            const iconSpan = btn.querySelector('.eye-icon');
            if (textSpan) textSpan.textContent = 'SHOW';
            if (iconSpan) iconSpan.textContent = '👁️';
        }
    }
};

// Fetch Google Client ID from Render Backend API on startup
fetch(`${API_BASE_URL}/api/auth/google/config`)
    .then(res => res.json())
    .then(data => {
        if (data.client_id) {
            window.GOOGLE_CLIENT_ID = data.client_id;
        }
    })
    .catch(() => {});

window.triggerGoogleSignIn = function () {
    const clientId = window.GOOGLE_CLIENT_ID || "";

    if (!clientId) {
        if (window.app) {
            window.app.showAuthAlert("⚠️ Google Client ID is not configured. Please set GOOGLE_CLIENT_ID in your Render environment variables.", "error");
        } else {
            alert("Google Client ID is missing. Please set GOOGLE_CLIENT_ID in your Render backend settings.");
        }
        return;
    }

    if (typeof google === 'undefined' || !google.accounts) {
        if (window.app) {
            window.app.showAuthAlert("Loading Google Sign-In SDK... Please try again in a few seconds.", "error");
        }
        return;
    }

    // Official Google Identity Services OAuth2 Token Client (Opens Official Google Account Chooser Popup)
    if (google.accounts.oauth2 && google.accounts.oauth2.initTokenClient) {
        const client = google.accounts.oauth2.initTokenClient({
            client_id: clientId,
            scope: 'openid email profile',
            callback: async (tokenResponse) => {
                if (tokenResponse && tokenResponse.access_token) {
                    if (window.app) {
                        await window.app.handleGoogleOAuthToken(tokenResponse.access_token);
                    }
                } else if (tokenResponse && tokenResponse.error) {
                    console.warn("Google OAuth Error:", tokenResponse.error);
                    if (window.app) {
                        window.app.showAuthAlert("Google Sign-In was cancelled.", "error");
                    }
                }
            }
        });

        // Opens official Google Popup window directly on click!
        client.requestAccessToken({ prompt: 'select_account' });
    } else if (google.accounts.id) {
        google.accounts.id.initialize({
            client_id: clientId,
            callback: async (response) => {
                if (response && response.credential && window.app) {
                    await window.app.handleGoogleOAuthToken(response.credential);
                }
            }
        });
        google.accounts.id.prompt();
    }
};

class TypingTutorWebApp {
    constructor() {
        this.storageManager = new StorageManager();
        this.levelManager = new LevelManager();
        this.aiCoach = new AICoach();

        this.currentUser = null;
        this.currentEngine = null;
        this.currentCategory = "python";
        this.currentModuleId = 1;
        this.currentLessonId = "py-1-1";
        this.currentDifficulty = "easy";
        this.isModuleChallenge = false;
        this.timerInterval = null;

        this.quizQuestions = [];
        this.quizCurrentIdx = 0;
        this.quizSelectedAnswer = null;
        this.quizScore = 0;

        this.init();
    }

    init() {
        this.bindEvents();
        window.addEventListener('hashchange', () => this.checkResetTokenInUrl());
        const hasResetToken = this.checkResetTokenInUrl();
        if (!hasResetToken) {
            this.checkExistingSession();
        }
    }

    checkResetTokenInUrl() {
        const hash = window.location.hash || "";
        const search = window.location.search || "";
        const fullUrl = window.location.href || "";

        if (!fullUrl.includes("token=")) {
            return false;
        }

        const queryStr = hash.includes("?") ? hash.split("?")[1] : (search.includes("?") ? search.split("?")[1] : search);
        const params = new URLSearchParams(queryStr);
        const token = params.get("token");

        if (token && token.trim().length > 0) {
            const tokenInput = document.getElementById('reset-token-input');
            if (tokenInput) tokenInput.value = token.trim();
            if (window.switchAuthView) window.switchAuthView('reset');
            return true;
        }
        return false;
    }

    checkExistingSession() {
        if (this.checkResetTokenInUrl()) return;

        const userObj = this.storageManager.getCurrentUser();
        if (userObj) {
            this.currentUser = new User(userObj, this.storageManager);
            this.showScreen("dashboard");
        } else {
            this.showScreen("login");
        }
    }

    loginUser(userObj) {
        this.currentUser = new User(userObj, this.storageManager);
        this.showScreen("dashboard");
    }

    async logoutUser() {
        await this.storageManager.logout();
        this.currentUser = null;
        this.showScreen("login");
    }

    async handleGoogleOAuthToken(idTokenStr) {
        try {
            this.showAuthAlert("Authenticating with Google...", "success");
            const res = await this.storageManager.loginWithGoogleToken(idTokenStr);
            this.showAuthAlert("✓ Google Sign-In Successful! Redirecting...", "success");
            setTimeout(() => this.loginUser(res.user), 400);
        } catch (err) {
            this.showAuthAlert(err.message || "Google Sign-In failed.", "error");
        }
    }

    showScreen(screenId, params = {}) {
        this.stopTimer();

        document.querySelectorAll('.screen').forEach(s => s.classList.remove('active'));
        const target = document.getElementById(`screen-${screenId}`);
        if (!target) return;

        target.classList.add('active');

        const navbar = document.getElementById('main-navbar');
        if (screenId === 'login') {
            navbar.style.display = 'none';
            const hasResetToken = (window.location.hash || "").includes("token=") || (window.location.search || "").includes("token=");
            if (!hasResetToken && window.switchAuthView) {
                window.switchAuthView('login');
            }
        } else {
            navbar.style.display = 'flex';
            this.updateNavbarUserBadge();
        }
        if (screenId === 'dashboard') this.renderDashboardScreen();
        else if (screenId === 'tracks') this.renderCareerTracksScreen();
        else if (screenId === 'categories') this.renderCategoryScreen();
        else if (screenId === 'modules') this.renderModulesScreen(params.category || this.currentCategory);
        else if (screenId === 'typing') this.renderTypingScreen(params.category || this.currentCategory, params.moduleId || this.currentModuleId, params.lessonId || this.currentLessonId, params.difficulty || this.currentDifficulty, params.isChallenge || false);
        else if (screenId === 'quiz') this.renderQuizScreen(params.category || this.currentCategory, params.moduleId || this.currentModuleId);
        else if (screenId === 'results') this.renderResultsScreen(params.category, params.moduleId, params.summary, params.isQuiz, params.xpGained, params.nextStage);
        else if (screenId === 'progress') this.renderProgressScreen();
    }

    updateNavbarUserBadge() {
        if (!this.currentUser) return;
        this.currentUser.refreshStats();

        const levelTag = document.getElementById('nav-level-tag');
        const xpText = document.getElementById('nav-xp-text');
        const xpFill = document.getElementById('nav-xp-fill');

        if (levelTag) levelTag.textContent = `Lvl ${this.currentUser.level}`;
        if (xpText) xpText.textContent = `${this.currentUser.xp} XP`;
        const xpInLevel = this.currentUser.xp % 100;
        if (xpFill) xpFill.style.width = `${xpInLevel}%`;
    }

    bindEvents() {
        document.getElementById('nav-btn-home')?.addEventListener('click', () => this.showScreen('dashboard'));
        document.getElementById('nav-btn-tracks')?.addEventListener('click', () => this.showScreen('tracks'));
        document.getElementById('nav-btn-progress')?.addEventListener('click', () => this.showScreen('progress'));
        document.getElementById('nav-btn-logout')?.addEventListener('click', () => this.logoutUser());

        const searchInput = document.getElementById('global-search-input');
        const searchDropdown = document.getElementById('search-results-dropdown');

        searchInput?.addEventListener('input', (e) => {
            const query = e.target.value;
            if (query.trim().length < 2) {
                if (searchDropdown) searchDropdown.style.display = 'none';
                return;
            }

            const results = this.levelManager.searchTopics(query);
            if (results.length === 0) {
                searchDropdown.innerHTML = `<div style="padding: 1rem; color: var(--text-muted); font-size: 0.85rem;">No concepts found for "${query}"</div>`;
            } else {
                searchDropdown.innerHTML = results.map(item => `
                    <div class="search-result-item" data-type="${item.type}" data-cat="${item.category}" data-mod="${item.moduleId || 1}" data-les="${item.lessonId || ''}">
                        <div class="search-result-title">${item.title}</div>
                        <div class="search-result-sub">${item.subtitle}</div>
                    </div>
                `).join('');
            }
            searchDropdown.style.display = 'block';
        });

        searchDropdown?.addEventListener('click', (e) => {
            const item = e.target.closest('.search-result-item');
            if (!item) return;
            searchDropdown.style.display = 'none';
            searchInput.value = '';

            const type = item.dataset.type;
            const cat = item.dataset.cat;
            const mod = item.dataset.mod;
            const les = item.dataset.les;

            if (type === 'language' || type === 'module') this.showScreen('modules', { category: cat });
            else if (type === 'lesson') this.showScreen('typing', { category: cat, moduleId: parseInt(mod), lessonId: les, difficulty: 'easy' });
        });

        // Password Eye Toggles
        document.getElementById('btn-toggle-login-pwd')?.addEventListener('click', (e) => {
            e.preventDefault();
            window.togglePasswordVisibility('login-password', 'btn-toggle-login-pwd');
        });

        document.getElementById('btn-toggle-signup-pwd')?.addEventListener('click', (e) => {
            e.preventDefault();
            window.togglePasswordVisibility('signup-password', 'btn-toggle-signup-pwd');
        });

        document.getElementById('btn-toggle-reset-pwd')?.addEventListener('click', (e) => {
            e.preventDefault();
            window.togglePasswordVisibility('reset-new-password', 'btn-toggle-reset-pwd');
        });

        // Live Password Strength
        const signupPwdInput = document.getElementById('signup-password');
        signupPwdInput?.addEventListener('input', () => {
            const val = signupPwdInput.value;
            const fill = document.getElementById('pwd-strength-fill');
            const label = document.getElementById('pwd-strength-label');
            if (!val) {
                if (fill) { fill.style.width = '0%'; fill.style.backgroundColor = 'var(--error)'; }
                if (label) label.textContent = 'Password Strength: Empty';
            } else if (val.length < 6) {
                if (fill) { fill.style.width = '33%'; fill.style.backgroundColor = '#EF4444'; }
                if (label) label.textContent = 'Password Strength: Weak (min 6 chars)';
            } else if (val.length < 10) {
                if (fill) { fill.style.width = '66%'; fill.style.backgroundColor = '#F59E0B'; }
                if (label) label.textContent = 'Password Strength: Moderate';
            } else {
                if (fill) { fill.style.width = '100%'; fill.style.backgroundColor = '#10B981'; }
                if (label) label.textContent = 'Password Strength: Strong';
            }
        });

        // Live Password Match Validation
        const confirmPwdInput = document.getElementById('signup-confirm-password');
        confirmPwdInput?.addEventListener('input', () => {
            const pwd = document.getElementById('signup-password').value;
            const confirmVal = confirmPwdInput.value;
            const hint = document.getElementById('msg-signup-confirm');
            if (!confirmVal) {
                if (hint) { hint.textContent = 'Must match password.'; hint.className = 'field-validation-hint'; }
            } else if (pwd === confirmVal) {
                if (hint) { hint.textContent = '✓ Passwords match'; hint.className = 'field-validation-hint success'; }
            } else {
                if (hint) { hint.textContent = '❌ Passwords do not match'; hint.className = 'field-validation-hint error'; }
            }
        });

        // Auth Forms Submit Handler
        document.getElementById('form-login')?.addEventListener('submit', async (e) => {
            e.preventDefault();
            this.hideAuthAlert();

            const identifier = (document.getElementById('login-email').value || "user@example.com").trim();
            const password = document.getElementById('login-password').value || "password";
            const rememberMe = document.getElementById('login-remember-me')?.checked ?? true;

            try {
                const res = await this.storageManager.login({ identifier, password, rememberMe });
                this.showAuthAlert("✓ Sign In Successful! Redirecting to Dashboard...", "success");
                setTimeout(() => this.loginUser(res.user), 300);
            } catch (err) {
                this.showAuthAlert(err.message || "Invalid credentials.", "error");
            }
        });

        document.getElementById('form-signup')?.addEventListener('submit', async (e) => {
            e.preventDefault();
            this.hideAuthAlert();

            const fullName = (document.getElementById('signup-fullname').value || "User").trim();
            const username = (document.getElementById('signup-username').value || "user").trim();
            const email = (document.getElementById('signup-email').value || "user@example.com").trim();
            const password = document.getElementById('signup-password').value || "password";
            const confirmPwd = document.getElementById('signup-confirm-password').value || "password";

            if (password !== confirmPwd) {
                this.showAuthAlert("Passwords do not match!", "error");
                return;
            }

            try {
                const res = await this.storageManager.register({ fullName, username, email, password });
                this.showAuthAlert("✓ Account created! Redirecting to Dashboard...", "success");
                setTimeout(() => this.loginUser(res.user), 300);
            } catch (err) {
                this.showAuthAlert(err.message || "Could not create account.", "error");
            }
        });

        // Forgot Password Form Submit
        document.getElementById('form-forgot')?.addEventListener('submit', async (e) => {
            e.preventDefault();
            this.hideAuthAlert();

            const email = document.getElementById('forgot-email').value.trim();
            if (!email) {
                this.showAuthAlert("Please enter a valid email address.", "error");
                return;
            }

            try {
                const msg = await this.storageManager.requestPasswordReset(email);
                this.showAuthAlert(`✓ ${msg}`, "success");
            } catch (err) {
                this.showAuthAlert("Could not request password reset.", "error");
            }
        });

        // Reset Password Form Submit
        document.getElementById('form-reset')?.addEventListener('submit', async (e) => {
            e.preventDefault();
            this.hideAuthAlert();

            const token = document.getElementById('reset-token-input').value.trim();
            const newPassword = document.getElementById('reset-new-password').value;
            const confirmPassword = document.getElementById('reset-confirm-password').value;

            if (!newPassword || newPassword.length < 6) {
                this.showAuthAlert("Password must be at least 6 characters.", "error");
                return;
            }

            if (newPassword !== confirmPassword) {
                this.showAuthAlert("Passwords do not match!", "error");
                return;
            }

            try {
                const msg = await this.storageManager.performPasswordReset(token, newPassword);
                this.showAuthAlert(`✓ ${msg}`, "success");
                if (window.history && window.history.replaceState) {
                    window.history.replaceState(null, "", window.location.pathname);
                } else {
                    window.location.hash = "";
                }
                setTimeout(() => window.switchAuthView('login'), 1200);
            } catch (err) {
                this.showAuthAlert(err.message || "Invalid or expired reset token.", "error");
            }
        });

        document.getElementById('btn-diff-easy')?.addEventListener('click', () => this.setDifficulty('easy'));
        document.getElementById('btn-diff-medium')?.addEventListener('click', () => this.setDifficulty('medium'));
        document.getElementById('btn-diff-hard')?.addEventListener('click', () => this.setDifficulty('hard'));

        document.getElementById('btn-generate-ai-practice')?.addEventListener('click', () => {
            const snippet = this.aiCoach.generateAIPracticeSnippet(this.currentCategory);
            this.currentEngine = new TypingEngine(snippet, this.currentUser);
            this.renderTypingText(snippet);
            alert("✨ Fresh AI Practice Snippet Generated! (+10 XP when complete)");
        });

        document.getElementById('btn-dash-continue')?.addEventListener('click', () => {
            const rec = this.aiCoach.recommendNextLesson(this.currentUser);
            this.showScreen('typing', { category: rec.category, moduleId: rec.module_id, lessonId: rec.lesson_id, difficulty: 'easy' });
        });
        document.getElementById('btn-dash-categories')?.addEventListener('click', () => this.showScreen('categories'));
        document.getElementById('btn-dash-tracks-shortcut')?.addEventListener('click', () => this.showScreen('tracks'));

        document.getElementById('btn-tracks-back')?.addEventListener('click', () => this.showScreen('dashboard'));
        document.getElementById('btn-cat-back')?.addEventListener('click', () => this.showScreen('dashboard'));
        document.getElementById('btn-modules-back')?.addEventListener('click', () => this.showScreen('categories'));
        document.getElementById('btn-typing-exit')?.addEventListener('click', () => this.showScreen('modules', { category: this.currentCategory }));
        document.getElementById('btn-typing-restart')?.addEventListener('click', () => {
            this.renderTypingScreen(this.currentCategory, this.currentModuleId, this.currentLessonId, this.currentDifficulty, this.isModuleChallenge);
        });

        document.getElementById('btn-res-next')?.addEventListener('click', () => {
            const nextStage = document.getElementById('btn-res-next').dataset.nextStage;
            if (nextStage === 'medium' || nextStage === 'hard') {
                this.showScreen('typing', { category: this.currentCategory, moduleId: this.currentModuleId, lessonId: this.currentLessonId, difficulty: nextStage });
            } else {
                this.showScreen('modules', { category: this.currentCategory });
            }
        });

        document.getElementById('btn-res-retry')?.addEventListener('click', () => {
            this.showScreen('typing', { category: this.currentCategory, moduleId: this.currentModuleId, lessonId: this.currentLessonId, difficulty: this.currentDifficulty, isChallenge: this.isModuleChallenge });
        });
        document.getElementById('btn-res-dash')?.addEventListener('click', () => this.showScreen('dashboard'));
        document.getElementById('btn-prog-back')?.addEventListener('click', () => this.showScreen('dashboard'));

        window.addEventListener('keydown', (e) => this.handleWindowKeyDown(e));
    }

    setDifficulty(diff) {
        if (this.currentUser && !this.currentUser.isDifficultyUnlocked(this.currentCategory, this.currentModuleId, this.currentLessonId, diff)) {
            alert(`🔒 Please complete the ${diff === 'medium' ? 'Easy' : 'Medium'} stage first!`);
            return;
        }
        this.currentDifficulty = diff;
        this.renderTypingScreen(this.currentCategory, this.currentModuleId, this.currentLessonId, diff, this.isModuleChallenge);
    }

    showAuthAlert(message, type = "error") {
        const banner = document.getElementById('auth-alert-banner');
        if (!banner) return;
        banner.textContent = message;
        banner.className = `auth-alert ${type}`;
        banner.style.display = 'flex';
    }

    hideAuthAlert() {
        const banner = document.getElementById('auth-alert-banner');
        if (banner) banner.style.display = 'none';
    }

    handleWindowKeyDown(e) {
        const typingScreen = document.getElementById('screen-typing');
        if (!typingScreen || !typingScreen.classList.contains('active')) return;
        if (!this.currentEngine || this.currentEngine.isFinished) return;

        let char = e.key;
        if ([" ", "Tab", "/", "'", "Enter"].includes(char)) e.preventDefault();
        if (char === "Enter") char = "\n";
        else if (char === "Tab") char = "\t";

        if (["Shift", "Control", "Alt", "Meta", "CapsLock", "Escape", "Backspace"].includes(e.key) || e.key.startsWith("F")) return;

        const res = this.currentEngine.handleKeyPress(char);
        this.updateTypingDom(res);
        this.updateTypingHeaderStats();

        if (!this.timerInterval && this.currentEngine.isActive) {
            this.timerInterval = setInterval(() => this.updateTypingHeaderStats(), 500);
        }

        if (res.isFinished) {
            this.stopTimer();
            const summary = this.currentEngine.getSessionSummary();
            let xpGained = 20;
            let nextStage = 'modules';

            if (this.currentUser) {
                if (this.isModuleChallenge) {
                    xpGained = 50;
                    const mod = this.levelManager.getModule(this.currentCategory, this.currentModuleId);
                    this.currentUser.completeModuleChallenge(
                        this.currentCategory, this.currentModuleId,
                        summary.stars, summary.wpm, summary.accuracy, summary.cpm,
                        mod ? mod.badge : "Module Badge"
                    );
                } else {
                    this.currentUser.completeLessonStage(
                        this.currentCategory, this.currentModuleId, this.currentLessonId,
                        this.currentDifficulty, summary.stars, summary.wpm, summary.accuracy, summary.cpm,
                        summary.totalKeyPresses
                    );

                    if (this.currentDifficulty === 'easy') nextStage = 'medium';
                    else if (this.currentDifficulty === 'medium') nextStage = 'hard';
                    else nextStage = 'modules';
                }
            }

            setTimeout(() => {
                this.showScreen('results', { category: this.currentCategory, moduleId: this.currentModuleId, summary, isQuiz: false, xpGained, nextStage });
            }, 300);
        }
    }

    stopTimer() {
        if (this.timerInterval) {
            clearInterval(this.timerInterval);
            this.timerInterval = null;
        }
    }

    renderDashboardScreen() {
        if (!this.currentUser) return;
        document.getElementById('dash-welcome-title').textContent = `Welcome back, ${this.currentUser.username}! 👋`;
        document.getElementById('dash-user-level-text').textContent = `Level ${this.currentUser.level}`;
        document.getElementById('dash-user-xp-text').textContent = `${this.currentUser.xp} Total XP`;

        const daily = this.storageManager.getTodayGoalProgress(this.currentUser.userId);
        document.getElementById('goal-val-mins').textContent = `${daily.mins} / 20 mins`;
        document.getElementById('goal-fill-mins').style.width = `${Math.min(100, (daily.mins / 20) * 100)}%`;
        document.getElementById('goal-val-lessons').textContent = `${daily.lessons} / 3 Sublevels`;
        document.getElementById('goal-fill-lessons').style.width = `${Math.min(100, (daily.lessons / 3) * 100)}%`;
        document.getElementById('goal-val-chars').textContent = `${daily.chars} / 2,000 chars`;
        document.getElementById('goal-fill-chars').style.width = `${Math.min(100, (daily.chars / 2000) * 100)}%`;
        document.getElementById('dash-streak-flame').textContent = `🔥 ${this.currentUser.streakCount || 0} Day Streak`;

        const langContainer = document.getElementById('dash-lang-stats-container');
        langContainer.innerHTML = '';
        const userLangStats = this.storageManager.getUserLanguageStats(this.currentUser.userId);
        const categories = this.levelManager.getCategories();

        categories.forEach(cat => {
            const langData = this.levelManager.getLanguageData(cat);
            if (!langData) return;
            const stat = userLangStats[cat] || { best_wpm: 0, best_accuracy: 0 };
            const pct = this.currentUser.getLanguageCompletionPct(cat);

            const item = document.createElement('div');
            item.className = 'lang-stat-item';
            item.innerHTML = `
                <div class="lang-stat-name">
                    <span>${langData.icon || '📁'} ${langData.title}</span>
                    <span style="color: var(--primary);">${pct.toFixed(1)}%</span>
                </div>
                <div style="font-size: 0.85rem; color: var(--text-muted); margin: 0.3rem 0;">
                    Speed: <strong style="color: var(--text-primary);">${stat.best_wpm.toFixed(1)} WPM</strong> • Acc: ${stat.best_accuracy.toFixed(1)}%
                </div>
                <div class="progress-bar-bg"><div class="progress-bar-fill" style="width: ${pct}%;"></div></div>
            `;
            langContainer.appendChild(item);
        });

        const weeklyReport = this.aiCoach.generateWeeklyReport(this.currentUser);
        if (weeklyReport) {
            document.getElementById('weekly-wpm-trend').textContent = weeklyReport.wpmTrend;
            document.getElementById('weekly-acc-trend').textContent = weeklyReport.accuracyTrend;
            document.getElementById('weekly-lessons-trend').textContent = weeklyReport.lessonsCompleted;
            document.getElementById('weekly-keys-trend').textContent = weeklyReport.weakKeysFocus || 'Clean';
        }

        const insightsContainer = document.getElementById('dash-ai-insights');
        const insights = this.aiCoach.generateInsights(this.currentUser);
        insightsContainer.innerHTML = insights.map(tip => `<p style="margin-bottom: 0.5rem; line-height: 1.5;">${tip}</p>`).join('');
    }

    renderCareerTracksScreen() {
        const grid = document.getElementById('career-tracks-grid');
        grid.innerHTML = '';
        const tracks = this.levelManager.getCareerTracks();

        tracks.forEach(track => {
            const card = document.createElement('div');
            card.className = 'card';
            card.style.borderLeft = '4px solid var(--primary)';
            card.innerHTML = `
                <div style="display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 0.5rem;">
                    <h3>${track.title}</h3>
                    <span class="level-tag" style="background: var(--input-bg); font-weight: 700;">${track.badge}</span>
                </div>
                <p style="color: var(--text-muted); font-size: 0.9rem; margin-bottom: 1.25rem;">${track.description}</p>
                <div class="track-steps-column" style="display: flex; flex-direction: column; gap: 0.4rem; margin-bottom: 1.25rem;">
                    ${track.roadmap.map((step, idx) => `
                        <div style="display: flex; align-items: center; justify-content: space-between; background: var(--input-bg); border: 1px solid var(--input-border); padding: 0.6rem 1rem; border-radius: 8px; font-size: 0.88rem;">
                            <div>
                                <strong style="color: var(--primary);">${step.status}:</strong> ${step.title}
                            </div>
                            ${step.isComingSoon ? '<span style="background: #F59E0B; color: #000; font-size: 0.75rem; font-weight: 800; padding: 0.2rem 0.5rem; border-radius: 4px;">Coming Soon</span>' : '<span style="color: var(--success); font-weight: 700;">Available ▶</span>'}
                        </div>
                        ${idx < track.roadmap.length - 1 ? '<div style="text-align: center; color: var(--text-muted); font-weight: 800; font-size: 0.9rem;">↓</div>' : ''}
                    `).join('')}
                </div>
                <button class="btn btn-primary" style="width: 100%;">Start Suggested Track ▶</button>
            `;
            card.querySelector('button').addEventListener('click', () => {
                const firstAvail = track.roadmap.find(s => !s.isComingSoon) || track.roadmap[0];
                this.showScreen('modules', { category: firstAvail.category });
            });
            grid.appendChild(card);
        });
    }

    renderCategoryScreen() {
        const grid = document.getElementById('category-grid');
        grid.innerHTML = '';
        const categories = this.levelManager.getCategories();

        categories.forEach(catKey => {
            const langData = this.levelManager.getLanguageData(catKey);
            if (!langData) return;
            const pct = this.currentUser ? this.currentUser.getLanguageCompletionPct(catKey) : 0.0;

            const card = document.createElement('div');
            card.className = 'cat-card';
            card.style.background = 'var(--card-dark)';
            card.style.border = '1px solid var(--card-border)';
            card.style.borderRadius = 'var(--radius-md)';
            card.style.padding = '1.25rem';
            card.style.cursor = 'pointer';

            card.innerHTML = `
                <div class="cat-icon" style="font-size: 2.2rem;">${langData.icon || '📁'}</div>
                <div class="cat-title" style="font-weight: 700; font-size: 1.1rem; margin: 0.5rem 0;">${langData.title}</div>
                <div class="cat-meta" style="font-size: 0.85rem; color: var(--text-muted);">${langData.modules.length} Modules • ${pct.toFixed(1)}% Done</div>
                <div class="progress-bar-bg" style="margin: 0.8rem 0;"><div class="progress-bar-fill" style="width: ${pct}%;"></div></div>
                <button class="btn btn-primary" style="width: 100%;">Explore Curriculum →</button>
            `;
            card.addEventListener('click', () => this.showScreen('modules', { category: catKey }));
            grid.appendChild(card);
        });
    }

    renderModulesScreen(category) {
        this.currentCategory = category;
        const langData = this.levelManager.getLanguageData(category);
        if (!langData) return;

        document.getElementById('modules-header-title').textContent = `${langData.icon} ${langData.title}`;
        document.getElementById('modules-header-sub').textContent = langData.description;

        const container = document.getElementById('modules-accordion-container');
        container.innerHTML = '';
        const modules = this.levelManager.getModules(category);
        const userProg = this.currentUser ? this.currentUser.getCategoryProgress(category) : {};

        modules.forEach(mod => {
            const isUnlocked = this.currentUser ? this.currentUser.isModuleUnlocked(category, mod.id) : (mod.id === 1);
            const isChallengePassed = Boolean(userProg[`mod${mod.id}_challenge`]?.completed);

            const card = document.createElement('div');
            card.className = 'module-card-box';
            card.style.opacity = isUnlocked ? '1' : '0.6';

            card.innerHTML = `
                <div class="module-card-header">
                    <div>
                        <h3 style="font-size: 1.15rem;">${mod.title} ${isChallengePassed ? '🏅' : ''}</h3>
                        <p style="color: var(--text-muted); font-size: 0.88rem;">${mod.description}</p>
                    </div>
                    <div>
                        ${isUnlocked ? `
                            <button class="btn btn-secondary btn-quiz-trigger" style="margin-right: 0.5rem;">📝 Concept Quiz (+30 XP)</button>
                            <button class="btn ${isChallengePassed ? 'btn-success' : 'btn-primary'} btn-challenge-trigger">
                                ${isChallengePassed ? '🏅 Challenge Passed' : '🏆 Module Challenge (+50 XP)'}
                            </button>
                        ` : '<span style="color: var(--text-muted); font-weight: 700;">🔒 Complete Prev Module Challenge</span>'}
                    </div>
                </div>
                <div class="lessons-list-grid">
                    ${mod.lessons.map((les, idx) => {
                        const isLesUnlocked = this.currentUser ? this.currentUser.isLessonUnlocked(category, mod.id, idx) : (idx === 0);
                        const easyDone = this.storageManager.isStageCompleted(this.currentUser?.userId, category, mod.id, les.id, 'easy');
                        const medDone = this.storageManager.isStageCompleted(this.currentUser?.userId, category, mod.id, les.id, 'medium');
                        const hardDone = this.storageManager.isStageCompleted(this.currentUser?.userId, category, mod.id, les.id, 'hard');

                        return `
                            <div class="lesson-item-card" data-lesid="${les.id}" data-unlocked="${isLesUnlocked}" style="opacity: ${isLesUnlocked ? '1' : '0.5'}; cursor: ${isLesUnlocked ? 'pointer' : 'not-allowed'};">
                                <div style="font-weight: 700; font-size: 0.92rem; display: flex; justify-content: space-between;">
                                    <span>${les.title}</span>
                                    <span>${isLesUnlocked ? (hardDone ? '✅' : '▶') : '🔒'}</span>
                                </div>
                                <div style="font-size: 0.78rem; color: var(--text-muted); margin-top: 0.2rem;">${les.concept}</div>
                                <div style="font-size: 0.75rem; margin-top: 0.4rem; font-weight: 700;">
                                    ${isLesUnlocked ? `
                                        <span style="color: ${easyDone ? 'var(--success)' : 'var(--text-muted)'}">Easy ${easyDone ? '✓' : ''}</span> • 
                                        <span style="color: ${medDone ? 'var(--success)' : 'var(--text-muted)'}">Med ${medDone ? '✓' : ''}</span> • 
                                        <span style="color: ${hardDone ? 'var(--success)' : 'var(--text-muted)'}">Hard ${hardDone ? '✓' : ''}</span>
                                    ` : `<span style="color: var(--error)">🔒 Finish Sublevel ${idx} (Easy, Med & Hard) first</span>`}
                                </div>
                            </div>
                        `;
                    }).join('')}
                </div>
            `;

            if (isUnlocked) {
                card.querySelector('.btn-quiz-trigger')?.addEventListener('click', () => {
                    this.showScreen('quiz', { category, moduleId: mod.id });
                });
                card.querySelector('.btn-challenge-trigger')?.addEventListener('click', () => {
                    this.showScreen('typing', { category, moduleId: mod.id, lessonId: mod.lessons[0].id, difficulty: 'easy', isChallenge: true });
                });
                card.querySelectorAll('.lesson-item-card').forEach(lesCard => {
                    lesCard.addEventListener('click', () => {
                        if (lesCard.dataset.unlocked !== 'true') {
                            alert("🔒 You must complete all 3 stages (Easy, Medium, Hard) of the previous sublevel first!");
                            return;
                        }
                        this.showScreen('typing', { category, moduleId: mod.id, lessonId: lesCard.dataset.lesid, difficulty: 'easy' });
                    });
                });
            }
            container.appendChild(card);
        });
    }

    renderTypingScreen(category, moduleId, lessonId, difficulty = 'easy', isChallenge = false) {
        this.currentCategory = category;
        this.currentModuleId = moduleId;
        this.currentLessonId = lessonId;
        this.currentDifficulty = difficulty;
        this.isModuleChallenge = isChallenge;

        const langData = this.levelManager.getLanguageData(category);
        const module = this.levelManager.getModule(category, moduleId);
        const lesson = this.levelManager.getLesson(category, moduleId, lessonId);
        const fileNameExt = { "python": "py", "java": "java", "javascript": "js", "sql": "sql", "html": "html", "css": "css", "c": "c", "cpp": "cpp", "linux": "sh", "git": "sh" }[category] || "txt";

        const btnEasy = document.getElementById('btn-diff-easy');
        const btnMed = document.getElementById('btn-diff-medium');
        const btnHard = document.getElementById('btn-diff-hard');

        document.querySelectorAll('.btn-diff-pill').forEach(b => b.classList.remove('active'));
        if (difficulty === 'easy') btnEasy?.classList.add('active');
        else if (difficulty === 'medium') btnMed?.classList.add('active');
        else if (difficulty === 'hard') btnHard?.classList.add('active');

        const isMedUnlocked = this.currentUser ? this.currentUser.isDifficultyUnlocked(category, moduleId, lessonId, 'medium') : true;
        const isHardUnlocked = this.currentUser ? this.currentUser.isDifficultyUnlocked(category, moduleId, lessonId, 'hard') : true;

        if (btnMed) btnMed.style.opacity = isMedUnlocked ? '1' : '0.4';
        if (btnHard) btnHard.style.opacity = isHardUnlocked ? '1' : '0.4';

        if (isChallenge) {
            document.getElementById('typing-level-title').textContent = `${langData ? langData.title : category} • ${module ? module.title : ''} [MODULE CHALLENGE]`;
            document.getElementById('typing-concept-hint').textContent = "Complete the comprehensive code challenge to unlock the next module!";
            document.getElementById('vscode-file-name').textContent = `challenge_mod${moduleId}.${fileNameExt}`;
        } else {
            document.getElementById('typing-level-title').textContent = `${langData ? langData.title : category} • ${lesson ? lesson.title : ''} [${difficulty.toUpperCase()} STAGE]`;
            document.getElementById('typing-concept-hint').textContent = lesson ? lesson.concept : '';
            document.getElementById('vscode-file-name').textContent = `${lessonId}_${difficulty}.${fileNameExt}`;
        }

        const snippet = isChallenge ?
            this.levelManager.getModuleChallenge(category, moduleId) :
            this.levelManager.getLessonExercise(category, moduleId, lessonId, difficulty);

        this.currentEngine = new TypingEngine(snippet, this.currentUser);
        this.renderTypingText(snippet);
        this.updateTypingHeaderStats();
    }

    renderTypingText(snippet) {
        const typingBox = document.getElementById('typing-box');
        typingBox.innerHTML = '';

        const lineCount = snippet.split('\n').length;
        const lineNumsContainer = document.getElementById('vscode-line-numbers');
        if (lineNumsContainer) {
            lineNumsContainer.innerHTML = Array.from({ length: Math.max(lineCount, 5) }, (_, i) => `<span>${i + 1}</span>`).join('');
        }

        for (let i = 0; i < snippet.length; i++) {
            const span = document.createElement('span');
            span.className = i === 0 ? 'char current' : 'char';
            span.textContent = snippet[i];
            span.dataset.index = i;
            typingBox.appendChild(span);
        }
    }

    updateTypingDom(lastResult = null) {
        if (!this.currentEngine) return;
        const typingBox = document.getElementById('typing-box');
        const spans = typingBox.querySelectorAll('.char');
        const currIdx = this.currentEngine.currentIndex;

        spans.forEach((span, idx) => {
            span.className = 'char';
            if (idx < currIdx) span.classList.add('correct');
            else if (idx === currIdx) {
                if (lastResult && lastResult.status === 'wrong') span.classList.add('wrong');
                else span.classList.add('current');
            }
        });
    }

    updateTypingHeaderStats() {
        if (!this.currentEngine) return;
        document.getElementById('typing-stat-time').textContent = this.currentEngine.getFormattedTime();
        document.getElementById('typing-stat-wpm').textContent = this.currentEngine.getWPM().toFixed(1);
        document.getElementById('typing-stat-cpm').textContent = this.currentEngine.getCPM().toFixed(1);
        document.getElementById('typing-stat-accuracy').textContent = `${this.currentEngine.getAccuracy().toFixed(1)}%`;
        document.getElementById('typing-stat-mistakes').textContent = this.currentEngine.mistakesCount.toString();
    }

    renderQuizScreen(category, moduleId) {
        this.currentCategory = category;
        this.currentModuleId = moduleId;
        const module = this.levelManager.getModule(category, moduleId);
        document.getElementById('quiz-header-title').textContent = `${module ? module.title : ''} Quiz`;
        this.quizQuestions = this.levelManager.getModuleQuiz(category, moduleId);
        this.quizCurrentIdx = 0;
        this.quizScore = 0;
        this.quizSelectedAnswer = null;

        this.displayCurrentQuizQuestion();
    }

    displayCurrentQuizQuestion() {
        if (this.quizCurrentIdx >= this.quizQuestions.length) {
            const scorePct = Math.round((this.quizScore / Math.max(1, this.quizQuestions.length)) * 100);
            if (this.currentUser) this.currentUser.completeQuiz(this.currentCategory, this.currentModuleId, scorePct);

            this.showScreen('results', {
                category: this.currentCategory, moduleId: this.currentModuleId,
                summary: { wpm: 0, accuracy: scorePct, stars: scorePct >= 80 ? 3 : 1 },
                isQuiz: true, xpGained: 30, nextStage: 'modules'
            });
            return;
        }

        const q = this.quizQuestions[this.quizCurrentIdx];
        document.getElementById('quiz-q-text').textContent = `Q${this.quizCurrentIdx + 1}: ${q.question}`;
        document.getElementById('quiz-progress-text').textContent = `Question ${this.quizCurrentIdx + 1} of ${this.quizQuestions.length}`;

        const optionsContainer = document.getElementById('quiz-options-container');
        optionsContainer.innerHTML = '';
        this.quizSelectedAnswer = null;

        q.options.forEach((optText, optIdx) => {
            const btn = document.createElement('button');
            btn.className = 'btn-quiz-option';
            btn.textContent = `${String.fromCharCode(65 + optIdx)}. ${optText}`;
            btn.addEventListener('click', () => {
                optionsContainer.querySelectorAll('.btn-quiz-option').forEach(b => b.classList.remove('selected'));
                btn.classList.add('selected');
                this.quizSelectedAnswer = optIdx;
            });
            optionsContainer.appendChild(btn);
        });

        const nextBtn = document.getElementById('btn-quiz-next');
        nextBtn.onclick = () => {
            if (this.quizSelectedAnswer === null) {
                alert("Please select an answer option.");
                return;
            }
            if (this.quizSelectedAnswer === q.answerIndex) this.quizScore += 1;
            this.quizCurrentIdx += 1;
            this.displayCurrentQuizQuestion();
        };
    }

    renderResultsScreen(category, moduleId, summary, isQuiz = false, xpGained = 20, nextStage = 'modules') {
        document.getElementById('results-level-sub').textContent = `${category.toUpperCase()} • Module ${moduleId} [${this.currentDifficulty.toUpperCase()} STAGE]`;
        document.getElementById('results-xp-gained').textContent = `+${xpGained} XP Gained! ⭐`;

        const stars = summary.stars || 1;
        document.getElementById('results-stars-display').textContent = '⭐ '.repeat(stars) + '☆ '.repeat(3 - stars);
        document.getElementById('res-wpm').textContent = (summary.wpm || 0).toFixed(1);
        document.getElementById('res-acc').textContent = `${(summary.accuracy || 0).toFixed(1)}%`;
        document.getElementById('res-cpm').textContent = (summary.cpm || 0).toFixed(1);
        document.getElementById('res-mistakes').textContent = summary.mistakes || 0;
        document.getElementById('res-time').textContent = summary.formattedTime || '00:00';

        const nextBtn = document.getElementById('btn-res-next');
        nextBtn.dataset.nextStage = nextStage;

        if (nextStage === 'medium') {
            nextBtn.textContent = '▶ Proceed to Medium Stage (+20 XP)';
        } else if (nextStage === 'hard') {
            nextBtn.textContent = '▶ Proceed to Hard Stage (+20 XP)';
        } else {
            nextBtn.textContent = '▶ Sublevels List';
        }

        const bdList = document.getElementById('res-key-breakdown');
        bdList.innerHTML = '';
        const keyStats = summary.keyStats || {};
        const sortedKeys = Object.entries(keyStats).sort((a, b) => a[1].accuracy - b[1].accuracy);

        if (sortedKeys.length > 0) {
            sortedKeys.slice(0, 5).forEach(([key, data]) => {
                const li = document.createElement('li');
                li.className = 'weak-key-item';
                li.innerHTML = `<span>Character '${key}'</span><span>${data.accuracy}% accuracy (${data.wrong} mistakes)</span>`;
                bdList.appendChild(li);
            });
        } else {
            bdList.innerHTML = `<li style="color: var(--success);">Perfect execution! Zero mistakes recorded.</li>`;
        }

        const rec = this.aiCoach.recommendNextLesson(this.currentUser);
        document.getElementById('res-ai-recommendation').textContent =
            nextStage !== 'modules' ?
            `Great job! Complete the ${nextStage.toUpperCase()} stage to finish this sublevel!` :
            `Sublevel Fully Completed! Proceed to the next unlocked sublevel.`;
    }

    renderProgressScreen() {
        if (!this.currentUser) return;
        document.getElementById('prog-username-title').textContent = `👤 User Profile: ${this.currentUser.username}`;
        document.getElementById('prog-user-meta').textContent =
            `Level ${this.currentUser.level} • Total XP: ${this.currentUser.xp} • Completed Sublevels: ${this.currentUser.completed_lessons} • Overall Progress: ${this.currentUser.getOverallCompletionPercentage().toFixed(1)}%`;

        const badgesContainer = document.getElementById('prog-badges-container');
        badgesContainer.innerHTML = '';
        const badges = this.currentUser.badges || [];
        if (badges.length > 0) {
            badges.forEach(b => {
                const badgeBox = document.createElement('div');
                badgeBox.style.background = 'var(--input-bg)';
                badgeBox.style.border = '1px solid var(--input-border)';
                badgeBox.style.padding = '0.6rem 1rem';
                badgeBox.style.borderRadius = '20px';
                badgeBox.style.fontSize = '0.9rem';
                badgeBox.style.fontWeight = '700';
                badgeBox.textContent = b;
                badgesContainer.appendChild(badgeBox);
            });
        } else {
            badgesContainer.innerHTML = `<p style="color: var(--text-muted);">Complete Module Challenges to earn Module Badges!</p>`;
        }
    }
}

window.addEventListener('DOMContentLoaded', () => {
    window.app = new TypingTutorWebApp();
});
