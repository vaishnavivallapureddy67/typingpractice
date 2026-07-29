/**
 * config.js
 * ---------
 * Central configuration module for TypingTutor Web Application.
 * Stores global constants, keyboard row classifications, theme palettes, and category definitions.
 */
export const APP_NAME = "TypingTutor Web";
export const VERSION = "1.0.0";

export const API_BASE_URL = "https://typingpractice-1.onrender.com";

export const LEVELS_PER_CATEGORY = 10;

export const CATEGORIES = [
    "beginner",
    "intermediate",
    "python",
    "java",
    "c",
    "cpp",
    "sql",
    "html",
    "css",
    "javascript",
    "git",
    "linux",
    "stories",
    "quotes",
    "emails",
    "urls"
];

export const CATEGORY_DISPLAY_NAMES = {
    "beginner": "Beginner Basics",
    "intermediate": "Intermediate Practice",
    "python": "Python Programming",
    "java": "Java Essentials",
    "c": "C Language",
    "cpp": "C++ Fundamentals",
    "sql": "SQL Queries",
    "html": "HTML Markup",
    "css": "CSS Styling",
    "javascript": "JavaScript Code",
    "git": "Git Commands",
    "linux": "Linux Terminal Commands",
    "stories": "Short Stories",
    "quotes": "Famous Quotes",
    "emails": "Professional Emails",
    "urls": "Web URLs & Syntax"
};

export const CATEGORY_ICONS = {
    "beginner": "🌱",
    "intermediate": "🚀",
    "python": "🐍",
    "java": "☕",
    "c": "⚙️",
    "cpp": "⚡",
    "sql": "🗄️",
    "html": "🌐",
    "css": "🎨",
    "javascript": "📜",
    "git": "🔀",
    "linux": "🐧",
    "stories": "📖",
    "quotes": "💬",
    "emails": "✉️",
    "urls": "🔗"
};

// Keyboard Group Constants (for AI Coach Analytics)
export const KEY_GROUP_HOME_ROW = "home_row";
export const KEY_GROUP_TOP_ROW = "top_row";
export const KEY_GROUP_BOTTOM_ROW = "bottom_row";
export const KEY_GROUP_NUMBERS = "numbers";
export const KEY_GROUP_SYMBOLS = "symbols";
export const KEY_GROUP_SPACE_OTHER = "space_other";

export const KEYBOARD_HOME_ROW = new Set("asdfjkl;ASDFJKL:");
export const KEYBOARD_TOP_ROW = new Set("qwertyuiopQWERTYUIOP");
export const KEYBOARD_BOTTOM_ROW = new Set("zxcvbnmZXCVBNM");
export const KEYBOARD_NUMBERS = new Set("1234567890");
export const KEYBOARD_SYMBOLS = new Set("!@#$%^&*()_+-=[]{};:'\",.<>/?\\|`~");
