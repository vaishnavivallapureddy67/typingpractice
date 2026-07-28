/**
 * levels.js
 * ---------
 * Level & Curriculum Content Loader for TypingTutor Web.
 * Connects modular curriculum datasets, lesson exercises, concept quizzes,
 * module challenges, difficulty levels, and global topic search.
 */

import { CURRICULUM_DATA, CAREER_TRACKS, searchCurriculumTopics } from './curriculum.js';

export class LevelManager {
    constructor() {
        this.curriculum = CURRICULUM_DATA;
        this.careerTracks = CAREER_TRACKS;
    }

    getCategories() {
        return Object.keys(this.curriculum);
    }

    getLanguageData(category) {
        return this.curriculum[category] || null;
    }

    getModules(category) {
        const lang = this.getLanguageData(category);
        return lang ? lang.modules : [];
    }

    getModule(category, moduleId) {
        const modules = this.getModules(category);
        return modules.find(m => m.id === parseInt(moduleId)) || null;
    }

    getLesson(category, moduleId, lessonId) {
        const module = this.getModule(category, moduleId);
        if (!module) return null;
        return module.lessons.find(l => l.id === lessonId) || module.lessons[0] || null;
    }

    getLessonExercise(category, moduleId, lessonId, difficulty = "medium") {
        const lesson = this.getLesson(category, moduleId, lessonId);
        if (!lesson) return "print('Hello World!')";

        const exercises = lesson.exercises || {};
        return exercises[difficulty] || exercises.medium || exercises.easy || "print('Default Practice')";
    }

    getModuleQuiz(category, moduleId) {
        const module = this.getModule(category, moduleId);
        return module ? (module.quiz || []) : [];
    }

    getModuleChallenge(category, moduleId) {
        const module = this.getModule(category, moduleId);
        return module ? (module.challenge || "print('Module Challenge Complete')") : "print('Module Challenge')";
    }

    searchTopics(query) {
        return searchCurriculumTopics(query);
    }

    getCareerTracks() {
        return this.careerTracks;
    }
}
