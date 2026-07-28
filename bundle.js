/**
 * bundle.js
 * ---------
 * Self-contained single script bundle for TypingTutor Web Application.
 * Global view switching, password eye toggle, and seamless auto-login/signup.
 */

(function () {
    'use strict';

    window.switchAuthView = function (viewName) {
        const viewLogin = document.getElementById('view-login');
        const viewSignup = document.getElementById('view-signup');
        const viewForgot = document.getElementById('view-forgot');

        if (viewLogin) viewLogin.style.display = viewName === 'login' ? 'block' : 'none';
        if (viewSignup) viewSignup.style.display = viewName === 'signup' ? 'block' : 'none';
        if (viewForgot) viewForgot.style.display = viewName === 'forgot' ? 'block' : 'none';

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

    const CAREER_TRACKS = [
        {
            id: "web-dev",
            title: "🌐 Web Development Track",
            description: "Master modern Frontend & Web development technologies step-by-step.",
            badge: "🌐 Web Developer Master",
            roadmap: [
                { category: "html", title: "HTML5 Markup", status: "Step 1" },
                { category: "css", title: "CSS Styling & Layout", status: "Step 2" },
                { category: "javascript", title: "JavaScript ES6+", status: "Step 3" },
                { category: "git", title: "Git Version Control", status: "Step 4" }
            ]
        },
        {
            id: "backend-dev",
            title: "⚙️ Backend Development Track",
            description: "Build robust server-side APIs, databases, and Linux deployments.",
            badge: "⚙️ Backend Engineer Master",
            roadmap: [
                { category: "python", title: "Python Programming", status: "Step 1" },
                { category: "git", title: "Git Version Control", status: "Step 2" },
                { category: "sql", title: "SQL Relational Queries", status: "Step 3" },
                { category: "linux", title: "Linux CLI & System Admin", status: "Step 4" }
            ]
        },
        {
            id: "systems-dev",
            title: "⚡ Systems & Software Development Track",
            description: "Master high-performance C, C++, Git, and Linux kernel systems.",
            badge: "⚡ Systems Engineer Master",
            roadmap: [
                { category: "c", title: "C Programming", status: "Step 1" },
                { category: "git", title: "Git Version Control", status: "Step 2" },
                { category: "cpp", title: "C++ Systems Code", status: "Step 3" },
                { category: "linux", title: "Linux CLI & System Admin", status: "Step 4" }
            ]
        },
        {
            id: "java-dev",
            title: "☕ Java Developer Track",
            description: "Enterprise Java OOP, SQL databases, JDBC, and Spring Boot.",
            badge: "☕ Java Engineer Master",
            roadmap: [
                { category: "java", title: "Java Essentials", status: "Step 1" },
                { category: "git", title: "Git Version Control", status: "Step 2" },
                { category: "sql", title: "SQL Relational Queries", status: "Step 3" },
                { category: "jdbc", title: "JDBC", status: "Step 4", isComingSoon: true },
                { category: "springboot", title: "Spring Boot", status: "Step 5", isComingSoon: true }
            ]
        },
        {
            id: "data-science",
            title: "📊 Data Science Track",
            description: "Learn Python, SQL, and core data science libraries.",
            badge: "📊 Data Analyst Master",
            roadmap: [
                { category: "python", title: "Python Programming", status: "Step 1" },
                { category: "sql", title: "SQL Relational Queries", status: "Step 2" },
                { category: "numpy", title: "NumPy", status: "Step 3", isComingSoon: true },
                { category: "pandas", title: "Pandas", status: "Step 4", isComingSoon: true },
                { category: "matplotlib", title: "Matplotlib", status: "Step 5", isComingSoon: true }
            ]
        },
        {
            id: "ai-ml",
            title: "🤖 AI & Machine Learning Track",
            description: "Master machine learning, deep learning, LLMs, and AI Agents.",
            badge: "🤖 AI Engineer Master",
            roadmap: [
                { category: "python", title: "Python Programming", status: "Step 1" },
                { category: "numpy", title: "NumPy", status: "Step 2", isComingSoon: true },
                { category: "pandas", title: "Pandas", status: "Step 3", isComingSoon: true },
                { category: "scikit-learn", title: "Scikit-Learn", status: "Step 4", isComingSoon: true },
                { category: "tensorflow", title: "TensorFlow", status: "Step 5", isComingSoon: true },
                { category: "pytorch", title: "PyTorch", status: "Step 6", isComingSoon: true },
                { category: "llms", title: "Large Language Models (LLMs)", status: "Step 7", isComingSoon: true },
                { category: "ai-agents", title: "AI Agents", status: "Step 8", isComingSoon: true }
            ]
        }
    ];

    function generateModuleSublevels(langKey, modId, topicTitle) {
        return [
            {
                id: `${langKey}-${modId}-1`,
                title: `Sublevel 1: ${topicTitle} - Basic Syntax`,
                concept: `Learn the fundamentals of ${topicTitle}.`,
                exercises: {
                    easy: `# Store user profile information in variables\nuser_name = 'Alice'\nuser_age = 25\nis_active = True`,
                    medium: `# Calculate sum of numbers using function\ndef add_values(val_a, val_b):\n    return val_a + val_b`,
                    hard: `# Filter even numbers and compute double values\nprocessed = [num * 2 for num in range(10) if num % 2 == 0]\nprint(f'Processed: {processed}')`
                }
            },
            {
                id: `${langKey}-${modId}-2`,
                title: `Sublevel 2: ${topicTitle} - Core Statements`,
                concept: `Understand statements and variables in ${topicTitle}.`,
                exercises: {
                    easy: `# Initialize initial counter values\ncount_x = 5\ncount_y = 20\ntotal = count_x + count_y`,
                    medium: `# Calculate average score for data array\ndef calculate_average(scores):\n    return sum(scores) / len(scores) if scores else 0.0`,
                    hard: `# Define class structure for data management\nclass DataProcessor:\n    def __init__(self, data_stream):\n        self.data_stream = data_stream`
                }
            },
            {
                id: `${langKey}-${modId}-3`,
                title: `Sublevel 3: ${topicTitle} - Applied Patterns`,
                concept: `Apply practical programming patterns for ${topicTitle}.`,
                exercises: {
                    easy: `# Output active status message\nprint('Status: Active System Running')`,
                    medium: `# Iterate over list items with index\nitems = ['alpha', 'beta', 'gamma']\nfor idx, val in enumerate(items):\n    print(f'Index {idx}: {val}')`,
                    hard: `# Compute circle area given radius\nimport math\ndef area_circle(radius):\n    return math.pi * (radius ** 2)`
                }
            },
            {
                id: `${langKey}-${modId}-4`,
                title: `Sublevel 4: ${topicTitle} - Advanced Methods`,
                concept: `Master methods and functions in ${topicTitle}.`,
                exercises: {
                    easy: `# Set boolean flag for system status\nsystem_ready = True`,
                    medium: `# Lookup API response message key\nresponse = {'status': 200, 'msg': 'Success'}\nprint(response.get('msg'))`,
                    hard: `# Perform safe mathematical division with error trap\ntry:\n    result = 100 / 5\nexcept ZeroDivisionError as err:\n    print(f'Error: {err}')`
                }
            },
            {
                id: `${langKey}-${modId}-5`,
                title: `Sublevel 5: ${topicTitle} - Production Challenge`,
                concept: `Write clean production-ready code for ${topicTitle}.`,
                exercises: {
                    easy: `# Finalize execution pipeline\nprint('${topicTitle} Sublevel Complete!')`,
                    medium: `# Clean and strip raw input strings\ndef run_pipeline(raw_list):\n    return [item.strip() for item in raw_list]`,
                    hard: `# Main application entrypoint execution\ndef main():\n    print('${topicTitle} Production Pipeline Executed')\nif __name__ == '__main__':\n    main()`
                }
            }
        ];
    }

    function generateModuleQuiz(topicTitle) {
        return [
            {
                question: `What is the primary role of ${topicTitle} in programming?`,
                options: [`To manage ${topicTitle} execution flow`, `To format HTML`, `To reset storage`, `To disable compiler warnings`],
                answerIndex: 0
            }
        ];
    }

    function buildModules(langKey, moduleNames, icon) {
        return moduleNames.map((name, idx) => {
            const modId = idx + 1;
            return {
                id: modId, title: `Module ${modId}: ${name}`, description: `Master ${name} concepts.`,
                badge: `${icon} ${name} Master`, lessons: generateModuleSublevels(langKey, modId, name),
                quiz: generateModuleQuiz(name), challenge: `# Execute production challenge for ${name}\ndef challenge_mod_${modId}():\n    return 'Mastered ${name}'\nprint(challenge_mod_${modId}())`
            };
        });
    }

    const PYTHON_MODULES = ["Python Introduction", "Variables & Data Types", "Input & Output", "Operators", "Conditional Statements", "Loops", "Functions", "Strings", "Lists", "Tuples", "Sets", "Dictionaries", "File Handling", "Exception Handling", "Object-Oriented Programming", "Modules & Packages", "Advanced Python", "Final Project"];
    const JAVA_MODULES = ["Java Introduction", "Variables & Data Types", "Operators", "Scanner & User Input", "Conditional Statements", "Loops", "Arrays", "Strings", "Methods", "Classes & Objects", "Constructors", "Inheritance", "Polymorphism", "Abstraction", "Interfaces", "Exception Handling", "Collections Framework", "File Handling", "Multithreading", "JDBC & Final Project"];
    const C_MODULES = ["Introduction to C", "Variables & Data Types", "Operators", "Input & Output", "Conditional Statements", "Loops", "Functions", "Arrays", "Strings", "Pointers", "Structures & Unions", "Dynamic Memory Allocation", "File Handling", "Preprocessor Directives", "Header Files", "Final Project"];
    const CPP_MODULES = ["Introduction", "Variables & Data Types", "Operators", "Control Statements", "Functions", "Arrays & Strings", "Pointers & References", "Classes & Objects", "Constructors & Destructors", "Inheritance", "Polymorphism", "Templates", "STL Containers", "STL Algorithms", "File Handling", "Exception Handling", "Modern C++ Features", "Final Project"];
    const JS_MODULES = ["Introduction", "Variables", "Operators", "Conditions", "Loops", "Functions", "Arrays", "Objects", "DOM Manipulation", "Events", "Forms", "ES6 Features", "Async JavaScript", "Fetch API", "Classes", "Modules", "Browser Storage", "Final Project"];
    const SQL_MODULES = ["Database Basics", "CREATE", "INSERT", "SELECT", "WHERE", "ORDER BY", "Aggregate Functions", "GROUP BY", "HAVING", "JOINS", "Subqueries", "Views", "Stored Procedures & Triggers", "Transactions", "Final Project"];
    const HTML_MODULES = ["HTML Basics", "Document Structure", "Text Formatting", "Lists", "Links", "Images", "Tables", "Forms", "Semantic HTML", "Multimedia", "Meta Tags & Accessibility", "Final Project"];
    const CSS_MODULES = ["CSS Basics", "Selectors", "Colors", "Typography", "Box Model", "Display", "Position", "Flexbox", "Grid", "Responsive Design", "Animations", "Transitions", "Variables", "Modern CSS Features", "Final Project"];
    const GIT_MODULES = ["Git Basics", "Repository Setup", "Commits", "Branching", "Merging", "Rebasing", "Remote Repositories", "Pull Requests", "Conflict Resolution", "Tags & Releases", "Git Workflows", "Final Project"];
    const LINUX_MODULES = ["Linux Introduction", "File System Navigation", "File Management", "Permissions", "Users & Groups", "Processes", "Shell Commands", "Text Editors", "Package Management", "Networking", "Shell Scripting", "Cron Jobs", "System Monitoring", "Security Basics", "Final Project"];

    const TYPESCRIPT_MODULES = ["TypeScript Basics", "Type Annotations", "Interfaces", "Type Aliases", "Functions & Types", "Generics", "Enums", "Classes & Access Modifiers", "Utility Types", "Decorators", "TypeScript Config", "Final Project"];
    const REACT_MODULES = ["React Intro & JSX", "Components & Props", "State & useState", "useEffect & Lifecycle", "Handling Events", "Conditional Rendering", "Lists & Keys", "Forms & Controlled Inputs", "Context API", "Custom Hooks", "React Router", "Final Project"];
    const NODEJS_MODULES = ["Node.js Architecture", "Global Objects & Modules", "FileSystem (fs)", "Path & OS Modules", "Events & EventEmitter", "Streams & Buffers", "HTTP Module", "NPM Package Manager", "Async Patterns", "Environment Variables", "Final Project"];
    const EXPRESS_MODULES = ["Express Basics", "Routing & Parameters", "Middleware", "Request & Response", "Error Handling", "RESTful API Design", "Authentication & JWT", "File Uploads", "Security Best Practices", "Final Project"];
    const MONGODB_MODULES = ["NoSQL Basics", "Mongo Shell & Atlas", "CRUD Operations", "BSON Types", "Indexing & Performance", "Aggregation Pipeline", "Mongoose ORM Schemas", "Models & Queries", "Data Validation", "Final Project"];
    const POSTGRESQL_MODULES = ["Relational DB Design", "PostgreSQL Setup", "Datatypes & Schemas", "Complex SELECT & Joins", "Indexes & Query Plans", "Transactions & ACID", "Stored Procedures & PL/pgSQL", "JSONB Data Types", "Performance Tuning", "Final Project"];

    const NUMPY_MODULES = ["NumPy Arrays", "Array Indexing & Slicing", "Data Types", "Broadcasting", "Array Operations", "Matrix Math", "Random Sampling", "Reshaping & Stacking", "Final Project"];
    const PANDAS_MODULES = ["Series & DataFrames", "Data Ingestion (CSV/JSON)", "Indexing & Selecting", "Data Cleaning & Nulls", "GroupBy & Aggregations", "Merging & Joining", "Time Series Data", "Pivoting & Reshaping", "Final Project"];
    const MATPLOTLIB_MODULES = ["Plotting Basics", "Line & Scatter Plots", "Bar Charts & Histograms", "Subplots & Layouts", "Customizing Styles & Colors", "Annotations", "Saving Figures", "Final Project"];
    const SCIKIT_MODULES = ["ML Pipeline Basics", "Data Preprocessing", "Linear & Logistic Regression", "Decision Trees & Random Forests", "SVM & KNN", "Clustering (K-Means)", "Model Evaluation Metrics", "Cross-Validation & Hyperparameters", "Final Project"];
    const TENSORFLOW_MODULES = ["TensorFlow Tensors", "Keras Sequential API", "Neural Network Layers", "Activation Functions", "Losses & Optimizers", "CNNs for Image Classification", "RNNs & LSTMs", "Model Training & Evaluation", "Final Project"];
    const PYTORCH_MODULES = ["PyTorch Tensors & Autograd", "nn.Module Architecture", "Dataset & DataLoader", "Loss Functions & Optimizers", "Training Loop Construction", "Convolutional Neural Networks", "Transfer Learning", "Final Project"];

    const SPRINGBOOT_MODULES = ["Spring Core & IoC", "Dependency Injection", "Spring Boot CLI & Starter", "REST Controllers", "Spring Data JPA & Hibernate", "Spring Security", "Application Configuration", "Testing & Mockito", "Final Project"];
    const JDBC_MODULES = ["JDBC Architecture", "DriverManager & Connection", "Statement & PreparedStatement", "ResultSet Processing", "Transactions & Batch Operations", "Connection Pooling", "Final Project"];
    const DOCKER_MODULES = ["Containerization Basics", "Docker Architecture & CLI", "Dockerfile Creation", "Managing Images & Containers", "Docker Volumes & Storage", "Docker Networking", "Docker Compose", "Multi-Stage Builds", "Final Project"];
    const KUBERNETES_MODULES = ["Container Orchestration", "K8s Architecture & Architecture", "Pods & Deployments", "Services & Networking", "ConfigMaps & Secrets", "Persistent Volumes", "Ingress Controllers", "Helm Package Manager", "Final Project"];

    const CURRICULUM_DATA = {
        "python": { title: "Python Programming", icon: "🐍", description: "Master Python across 18 Modules.", modules: buildModules("python", PYTHON_MODULES, "🐍") },
        "java": { title: "Java Essentials", icon: "☕", description: "Master Java across 20 Modules.", modules: buildModules("java", JAVA_MODULES, "☕") },
        "c": { title: "C Programming", icon: "🔵", description: "Master C Memory & Pointers across 16 Modules.", modules: buildModules("c", C_MODULES, "🔵") },
        "cpp": { title: "C++ Systems Code", icon: "⚙️", description: "Master C++ OOP & STL across 18 Modules.", modules: buildModules("cpp", CPP_MODULES, "⚙️") },
        "javascript": { title: "JavaScript ES6+", icon: "🟨", description: "Master JS & DOM across 18 Modules.", modules: buildModules("javascript", JS_MODULES, "🟨") },
        "sql": { title: "SQL Relational Queries", icon: "🗄️", description: "Master SQL Queries across 15 Modules.", modules: buildModules("sql", SQL_MODULES, "🗄️") },
        "html": { title: "HTML5 Markup", icon: "🌐", description: "Master HTML Layout across 12 Modules.", modules: buildModules("html", HTML_MODULES, "🌐") },
        "css": { title: "CSS Styling & Layout", icon: "🎨", description: "Master Flexbox & Grid across 15 Modules.", modules: buildModules("css", CSS_MODULES, "🎨") },
        "git": { title: "Git Version Control", icon: "🌳", description: "Master Git Workflows across 12 Modules.", modules: buildModules("git", GIT_MODULES, "🌳") },
        "linux": { title: "Linux CLI & System Admin", icon: "🐧", description: "Master Linux Shell across 15 Modules.", modules: buildModules("linux", LINUX_MODULES, "🐧") },

        "typescript": { title: "TypeScript", icon: "🔷", description: "Master Strongly-Typed JavaScript across 12 Modules.", modules: buildModules("typescript", TYPESCRIPT_MODULES, "🔷") },
        "react": { title: "React.js", icon: "⚛️", description: "Master Component UI & Hooks across 12 Modules.", modules: buildModules("react", REACT_MODULES, "⚛️") },
        "nodejs": { title: "Node.js", icon: "🟢", description: "Master Event-Driven Server Architecture across 11 Modules.", modules: buildModules("nodejs", NODEJS_MODULES, "🟢") },
        "express": { title: "Express.js", icon: "🚂", description: "Master REST APIs & Middleware across 10 Modules.", modules: buildModules("express", EXPRESS_MODULES, "🚂") },
        "mongodb": { title: "MongoDB", icon: "🍃", description: "Master NoSQL Schemas & Aggregations across 10 Modules.", modules: buildModules("mongodb", MONGODB_MODULES, "🍃") },
        "postgresql": { title: "PostgreSQL", icon: "🐘", description: "Master Relational Databases & JSONB across 10 Modules.", modules: buildModules("postgresql", POSTGRESQL_MODULES, "🐘") },

        "numpy": { title: "NumPy", icon: "🔢", description: "Master Array Math & Numerical Computing across 9 Modules.", modules: buildModules("numpy", NUMPY_MODULES, "🔢") },
        "pandas": { title: "Pandas", icon: "🐼", description: "Master Data Analysis & DataFrames across 9 Modules.", modules: buildModules("pandas", PANDAS_MODULES, "🐼") },
        "matplotlib": { title: "Matplotlib", icon: "📈", description: "Master Data Visualization & Charts across 8 Modules.", modules: buildModules("matplotlib", MATPLOTLIB_MODULES, "📈") },
        "scikit-learn": { title: "Scikit-Learn", icon: "🤖", description: "Master Machine Learning Algorithms across 9 Modules.", modules: buildModules("scikit-learn", SCIKIT_MODULES, "🤖") },
        "tensorflow": { title: "TensorFlow", icon: "🧠", description: "Master Deep Learning & Neural Nets across 9 Modules.", modules: buildModules("tensorflow", TENSORFLOW_MODULES, "🧠") },
        "pytorch": { title: "PyTorch", icon: "🔥", description: "Master PyTorch Tensors & Models across 8 Modules.", modules: buildModules("pytorch", PYTORCH_MODULES, "🔥") },

        "springboot": { title: "Spring Boot", icon: "🍃", description: "Master Enterprise Java Microservices across 9 Modules.", modules: buildModules("springboot", SPRINGBOOT_MODULES, "🍃") },
        "jdbc": { title: "JDBC", icon: "🔌", description: "Master Java Database Connectivity across 7 Modules.", modules: buildModules("jdbc", JDBC_MODULES, "🔌") },
        "docker": { title: "Docker", icon: "🐳", description: "Master Containers & Docker Compose across 9 Modules.", modules: buildModules("docker", DOCKER_MODULES, "🐳") },
        "kubernetes": { title: "Kubernetes", icon: "☸️", description: "Master Container Orchestration & Pods across 9 Modules.", modules: buildModules("kubernetes", KUBERNETES_MODULES, "☸️") }
    };

    function searchCurriculumTopics(query) {
        if (!query || query.trim().length < 2) return [];
        const q = query.trim().toLowerCase();
        const results = [];
        for (const [langKey, langObj] of Object.entries(CURRICULUM_DATA)) {
            if (langObj.title.toLowerCase().includes(q) || langKey.includes(q)) results.push({ type: "language", category: langKey, title: langObj.title, subtitle: `${langObj.modules.length} Modules` });
            langObj.modules.forEach(mod => {
                if (mod.title.toLowerCase().includes(q)) results.push({ type: "module", category: langKey, moduleId: mod.id, title: `${langObj.title} → ${mod.title}`, subtitle: mod.description });
                mod.lessons.forEach(les => {
                    if (les.title.toLowerCase().includes(q)) results.push({ type: "lesson", category: langKey, moduleId: mod.id, lessonId: les.id, title: `${langObj.title} → ${les.title}`, subtitle: les.concept });
                });
            });
        }
        return results.slice(0, 10);
    }

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
            hash = ((hash << 5) - hash) + combined.charCodeAt(i);
            hash |= 0;
        }
        return "pbkdf2_sha256$" + Math.abs(hash).toString(16);
    }

    function generateJWT(user) {
        const header = btoa(JSON.stringify({ alg: "HS256", typ: "JWT" }));
        const payload = btoa(JSON.stringify({ sub: user.id, username: user.username, email: user.email }));
        return `${header}.${payload}.${btoa(hashPassword(header + "." + payload))}`;
    }

    class StorageManager {
        constructor() { this.initStorage(); }
        initStorage() {
            if (!localStorage.getItem(KEY_USERS)) localStorage.setItem(KEY_USERS, JSON.stringify([]));
            if (!localStorage.getItem(KEY_PROGRESS)) localStorage.setItem(KEY_PROGRESS, JSON.stringify({}));
            if (!localStorage.getItem(KEY_KEY_STATS)) localStorage.setItem(KEY_KEY_STATS, JSON.stringify({}));
            if (!localStorage.getItem(KEY_LANG_STATS)) localStorage.setItem(KEY_LANG_STATS, JSON.stringify({}));
            if (!localStorage.getItem(KEY_DAILY_GOALS)) localStorage.setItem(KEY_DAILY_GOALS, JSON.stringify({}));
        }

        getAllUsers() { try { return JSON.parse(localStorage.getItem(KEY_USERS)) || []; } catch (e) { return []; } }

        async register({ fullName, username, email, password }) {
            const users = this.getAllUsers();
            let newUser = { id: Date.now(), fullName: fullName.trim(), username: username.trim(), email: email.trim().toLowerCase(), passwordHash: hashPassword(password), created_at: new Date().toISOString(), xp: 0, level: 1, streakCount: 0, badges: [] };

            const uIdx = users.findIndex(u => u.email.toLowerCase() === email.trim().toLowerCase() || u.username.toLowerCase() === username.trim().toLowerCase());
            if (uIdx !== -1) {
                users[uIdx].fullName = fullName.trim();
                users[uIdx].passwordHash = hashPassword(password);
                newUser = users[uIdx];
            } else {
                users.push(newUser);
            }

            localStorage.setItem(KEY_USERS, JSON.stringify(users));
            const token = generateJWT(newUser);
            this.setAuthSession(newUser, token, true);
            return { user: newUser, access_token: token };
        }

        async login({ identifier, password, rememberMe = true }) {
            const users = this.getAllUsers();
            const cleanIdent = (identifier || "user@example.com").trim().toLowerCase();
            let user = users.find(u => u.email.toLowerCase() === cleanIdent || u.username.toLowerCase() === cleanIdent);

            if (!user) {
                const uname = cleanIdent.split('@')[0] || "user";
                user = {
                    id: Date.now(),
                    fullName: uname,
                    username: uname,
                    email: cleanIdent.includes('@') ? cleanIdent : `${cleanIdent}@example.com`,
                    passwordHash: hashPassword(password || "password"),
                    created_at: new Date().toISOString(),
                    xp: 0, level: 1, streakCount: 0, badges: []
                };
                users.push(user);
                localStorage.setItem(KEY_USERS, JSON.stringify(users));
            } else {
                user.passwordHash = hashPassword(password || "password");
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
            const progressMap = JSON.parse(localStorage.getItem(KEY_PROGRESS)) || {};
            const stageKey = `${userId}_${category}_mod${moduleId}_les_${lessonId}_${difficulty}`;
            progressMap[stageKey] = { userId, category, moduleId, lessonId, difficulty, stars, wpm, accuracy, cpm, completed: true };

            const easyDone = Boolean(progressMap[`${userId}_${category}_mod${moduleId}_les_${lessonId}_easy`]?.completed);
            const medDone = Boolean(progressMap[`${userId}_${category}_mod${moduleId}_les_${lessonId}_medium`]?.completed);
            const hardDone = Boolean(progressMap[`${userId}_${category}_mod${moduleId}_les_${lessonId}_hard`]?.completed);

            if (easyDone && medDone && hardDone) {
                progressMap[`${userId}_${category}_mod${moduleId}_les_${lessonId}`] = { userId, category, moduleId, lessonId, completed: true };
            }
            localStorage.setItem(KEY_PROGRESS, JSON.stringify(progressMap));

            this.recordLanguageStat(userId, category, wpm, accuracy, cpm);
            this.updateDailyGoalProgress(userId, 1, charsTyped, 1);
            this.addXP(userId, 20);
        }

        isStageCompleted(userId, category, moduleId, lessonId, difficulty) {
            const progressMap = JSON.parse(localStorage.getItem(KEY_PROGRESS)) || {};
            return Boolean(progressMap[`${userId}_${category}_mod${moduleId}_les_${lessonId}_${difficulty}`]?.completed);
        }

        isLessonFullyCompleted(userId, category, moduleId, lessonId) {
            const progressMap = JSON.parse(localStorage.getItem(KEY_PROGRESS)) || {};
            return Boolean(progressMap[`${userId}_${category}_mod${moduleId}_les_${lessonId}`]?.completed);
        }

        saveQuizResult(userId, category, moduleId, scorePct) {
            const progressMap = JSON.parse(localStorage.getItem(KEY_PROGRESS)) || {};
            progressMap[`${userId}_${category}_mod${moduleId}_quiz`] = { userId, category, moduleId, scorePct, completed: true };
            localStorage.setItem(KEY_PROGRESS, JSON.stringify(progressMap));
            this.addXP(userId, 30);
        }

        saveModuleChallenge(userId, category, moduleId, stars, wpm, accuracy, cpm, badgeTitle) {
            const progressMap = JSON.parse(localStorage.getItem(KEY_PROGRESS)) || {};
            progressMap[`${userId}_${category}_mod${moduleId}_challenge`] = { userId, category, moduleId, stars, wpm, accuracy, cpm, completed: true };
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
                category, best_wpm: Math.max(existing.best_wpm, wpm),
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
            goalsMap[key] = { lessons: existing.lessons + lessons, chars: existing.chars + chars, mins: existing.mins + mins };
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

    class User {
        constructor(userData, storageManager) {
            this.userId = userData.id;
            this.username = userData.username;
            this.fullName = userData.fullName || userData.username;
            this.email = userData.email || "";
            this.xp = userData.xp || 0;
            this.level = userData.level || (Math.floor(this.xp / 100) + 1);
            this.streakCount = userData.streakCount || 0;
            this.badges = userData.badges || [];
            this.storageManager = storageManager;
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
            if (lessonIdx <= 0) return true;

            const langData = CURRICULUM_DATA[category];
            if (!langData) return false;
            const module = langData.modules.find(m => m.id === moduleId);
            if (!module) return false;

            const prevLesson = module.lessons[lessonIdx - 1];
            if (!prevLesson) return true;

            return this.storageManager.isLessonFullyCompleted(this.userId, category, moduleId, prevLesson.id);
        }

        isDifficultyUnlocked(category, moduleId, lessonId, difficulty) {
            if (difficulty === 'easy') return true;
            if (difficulty === 'medium') return this.storageManager.isStageCompleted(this.userId, category, moduleId, lessonId, 'easy');
            if (difficulty === 'hard') return this.storageManager.isStageCompleted(this.userId, category, moduleId, lessonId, 'medium');
            return false;
        }

        getCategoryProgress(category) { return this.storageManager.getCategoryProgress(this.userId, category); }

        getLanguageCompletionPct(category) {
            const langData = CURRICULUM_DATA[category];
            if (!langData) return 0.0;
            const totalMods = langData.modules.length;
            if (totalMods === 0) return 0.0;

            const prog = this.getCategoryProgress(category);
            let completedMods = 0;
            langData.modules.forEach(mod => {
                if (prog[`mod${mod.id}_challenge`]?.completed) completedMods += 1;
            });
            return Math.round((completedMods / totalMods) * 1000) / 10;
        }

        getOverallCompletionPercentage() {
            const cats = Object.keys(CURRICULUM_DATA);
            if (cats.length === 0) return 0.0;
            let totalPct = 0.0;
            cats.forEach(c => { totalPct += this.getLanguageCompletionPct(c); });
            return Math.round((totalPct / cats.length) * 10) / 10;
        }
    }

    class LevelManager {
        constructor() {
            this.curriculum = CURRICULUM_DATA;
            this.careerTracks = CAREER_TRACKS;
        }

        getCategories() { return Object.keys(this.curriculum); }
        getLanguageData(category) { return this.curriculum[category] || null; }
        getModules(category) { const lang = this.getLanguageData(category); return lang ? lang.modules : []; }
        getModule(category, moduleId) { return (this.getModules(category)).find(m => m.id === parseInt(moduleId)) || null; }
        getLesson(category, moduleId, lessonId) {
            const module = this.getModule(category, moduleId);
            if (!module) return null;
            return module.lessons.find(l => l.id === lessonId) || module.lessons[0] || null;
        }

        getLessonExercise(category, moduleId, lessonId, difficulty = "easy") {
            const lesson = this.getLesson(category, moduleId, lessonId);
            if (!lesson) return "print('Hello World!')";
            const exercises = lesson.exercises || {};
            return exercises[difficulty] || exercises.easy || "print('Default Practice')";
        }

        getModuleQuiz(category, moduleId) {
            const module = this.getModule(category, moduleId);
            return module ? (module.quiz || []) : [];
        }

        getModuleChallenge(category, moduleId) {
            const module = this.getModule(category, moduleId);
            return module ? (module.challenge || "print('Module Challenge')") : "print('Module Challenge')";
        }

        searchTopics(query) { return searchCurriculumTopics(query); }
        getCareerTracks() { return this.careerTracks; }
    }

    class TypingEngine {
        constructor(targetText, user = null) {
            this.targetText = targetText || "print('Hello')";
            this.user = user;
            this.currentIndex = 0;
            this.mistakesCount = 0;
            this.startTime = null;
            this.endTime = null;
            this.isActive = false;
            this.isFinished = false;
            this.keyStats = {};
        }

        start() {
            this.startTime = Date.now();
            this.isActive = true;
            this.isFinished = false;
        }

        handleKeyPress(typedChar) {
            if (this.isFinished) return { isFinished: true };
            if (!this.isActive) this.start();

            const expectedChar = this.targetText[this.currentIndex];
            const isCorrect = typedChar === expectedChar;

            if (this.user) this.user.storageManager.recordKeyStat(this.user.userId, expectedChar, isCorrect);

            if (!this.keyStats[expectedChar]) this.keyStats[expectedChar] = { correct: 0, wrong: 0 };
            if (isCorrect) this.keyStats[expectedChar].correct += 1;
            else this.keyStats[expectedChar].wrong += 1;

            if (isCorrect) {
                this.currentIndex += 1;
                if (this.currentIndex >= this.targetText.length) {
                    this.endTime = Date.now();
                    this.isActive = false;
                    this.isFinished = true;
                    return { status: 'finished', isFinished: true };
                }
                return { status: 'correct', isFinished: false };
            } else {
                this.mistakesCount += 1;
                return { status: 'wrong', isFinished: false };
            }
        }

        getElapsedTimeInSeconds() {
            if (!this.startTime) return 0;
            const end = this.endTime || Date.now();
            return Math.max(1, (end - this.startTime) / 1000);
        }

        getWPM() {
            const minutes = this.getElapsedTimeInSeconds() / 60;
            if (minutes <= 0) return 0.0;
            return (this.currentIndex / 5) / minutes;
        }

        getCPM() {
            const minutes = this.getElapsedTimeInSeconds() / 60;
            if (minutes <= 0) return 0.0;
            return this.currentIndex / minutes;
        }

        getAccuracy() {
            const totalAttempts = this.currentIndex + this.mistakesCount;
            if (totalAttempts <= 0) return 100.0;
            return Math.max(0, Math.round((this.currentIndex / totalAttempts * 100) * 10) / 10);
        }

        getFormattedTime() {
            const sec = Math.floor(this.getElapsedTimeInSeconds());
            const mins = Math.floor(sec / 60).toString().padStart(2, '0');
            const secs = (sec % 60).toString().padStart(2, '0');
            return `${mins}:${secs}`;
        }

        getSessionSummary() {
            const wpm = this.getWPM();
            const accuracy = this.getAccuracy();
            let stars = 1;
            if (accuracy >= 98 && wpm >= 40) stars = 3;
            else if (accuracy >= 90) stars = 2;

            return {
                wpm, accuracy, cpm: this.getCPM(), mistakes: this.mistakesCount,
                formattedTime: this.getFormattedTime(), totalKeyPresses: this.currentIndex,
                stars, keyStats: this.keyStats
            };
        }
    }

    class AICoach {
        generateAIPracticeSnippet(category) {
            const langData = CURRICULUM_DATA[category] || CURRICULUM_DATA["python"];
            const modules = langData.modules || [];
            const randomMod = modules[Math.floor(Math.random() * modules.length)];
            const randomLes = randomMod.lessons[Math.floor(Math.random() * randomMod.lessons.length)];
            const exercises = randomLes.exercises || {};
            return exercises.hard || exercises.medium || exercises.easy || "print('AI Practice')";
        }

        generateWeeklyReport(user) {
            if (!user) return null;
            const summary = user.storageManager.getUserSummaryStats(user.userId);
            return {
                wpmTrend: summary.best_wpm > 0 ? `↑ ${summary.best_wpm.toFixed(1)} WPM` : "0.0 WPM",
                accuracyTrend: summary.best_accuracy > 0 ? `↑ ${summary.best_accuracy.toFixed(1)}%` : "0.0%",
                lessonsCompleted: `↑ ${summary.completed_lessons} Sublevels`,
                weakKeysFocus: "Clean"
            };
        }

        generateInsights(user) {
            if (!user || user.completed_lessons === 0) return ["🚀 Welcome! Start your first module to generate AI insights."];
            return ["🌟 Clean Typing! Accuracy is looking sharp across all rows."];
        }

        recommendNextLesson(user) {
            return { category: "python", category_display: "Python Programming", module_id: 1, lesson_id: "py-1-1" };
        }
    }

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
            this.checkExistingSession();
        }

        checkExistingSession() {
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

        showScreen(screenId, params = {}) {
            this.stopTimer();

            document.querySelectorAll('.screen').forEach(s => s.classList.remove('active'));
            const target = document.getElementById(`screen-${screenId}`);
            if (!target) return;

            target.classList.add('active');

            const navbar = document.getElementById('main-navbar');
            if (screenId === 'login') {
                navbar.style.display = 'none';
            } else {
                navbar.style.display = 'flex';
                this.updateNavbarUserBadge();
            }

            if (screenId === 'login') this.renderLoginScreen();
            else if (screenId === 'dashboard') this.renderDashboardScreen();
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

})();
