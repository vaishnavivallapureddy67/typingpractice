/**
 * curriculum.js
 * -------------
 * Expanded Curriculum Dataset & Career Tracks for TypingTutor Web Application.
 * Includes 26 Programming Languages & Technologies + 6 Detailed Career Tracks.
 */

export const CAREER_TRACKS = [
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

// New Technologies
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

export const CURRICULUM_DATA = {
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

export function searchCurriculumTopics(query) {
    if (!query || query.trim().length < 2) return [];
    const q = query.trim().toLowerCase();
    const results = [];

    for (const [langKey, langObj] of Object.entries(CURRICULUM_DATA)) {
        if (langObj.title.toLowerCase().includes(q) || langKey.includes(q)) {
            results.push({ type: "language", category: langKey, title: langObj.title, subtitle: `Language • ${langObj.modules.length} Modules` });
        }
        langObj.modules.forEach(mod => {
            if (mod.title.toLowerCase().includes(q) || mod.description.toLowerCase().includes(q)) {
                results.push({ type: "module", category: langKey, moduleId: mod.id, title: `${langObj.title} → ${mod.title}`, subtitle: mod.description });
            }
            mod.lessons.forEach(les => {
                if (les.title.toLowerCase().includes(q) || les.concept.toLowerCase().includes(q)) {
                    results.push({ type: "lesson", category: langKey, moduleId: mod.id, lessonId: les.id, title: `${langObj.title} → ${les.title}`, subtitle: les.concept });
                }
            });
        });
    }
    return results.slice(0, 10);
}
