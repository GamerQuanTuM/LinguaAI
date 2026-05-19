# Graph Report - langauge-learning-ai-assistant  (2026-05-19)

## Corpus Check
- 53 files · ~24,586 words
- Verdict: corpus is large enough that graph structure adds value.

## Summary
- 323 nodes · 539 edges · 38 communities (22 shown, 16 thin omitted)
- Extraction: 95% EXTRACTED · 5% INFERRED · 0% AMBIGUOUS · INFERRED: 25 edges (avg confidence: 0.83)
- Token cost: 0 input · 0 output

## Graph Freshness
- Built from commit: `e0d476f3`
- Run `git rev-parse HEAD` and compare to check if the graph is stale.
- Run `graphify update .` after code changes (no API cost).

## Community Hubs (Navigation)
- [[_COMMUNITY_Community 0|Community 0]]
- [[_COMMUNITY_Community 1|Community 1]]
- [[_COMMUNITY_Community 2|Community 2]]
- [[_COMMUNITY_Community 3|Community 3]]
- [[_COMMUNITY_Community 4|Community 4]]
- [[_COMMUNITY_Community 5|Community 5]]
- [[_COMMUNITY_Community 6|Community 6]]
- [[_COMMUNITY_Community 7|Community 7]]
- [[_COMMUNITY_Community 8|Community 8]]
- [[_COMMUNITY_Community 9|Community 9]]
- [[_COMMUNITY_Community 10|Community 10]]
- [[_COMMUNITY_Community 11|Community 11]]
- [[_COMMUNITY_Community 12|Community 12]]
- [[_COMMUNITY_Community 13|Community 13]]
- [[_COMMUNITY_Community 14|Community 14]]
- [[_COMMUNITY_Community 15|Community 15]]
- [[_COMMUNITY_Community 16|Community 16]]
- [[_COMMUNITY_Community 17|Community 17]]
- [[_COMMUNITY_Community 18|Community 18]]
- [[_COMMUNITY_Community 19|Community 19]]
- [[_COMMUNITY_Community 20|Community 20]]
- [[_COMMUNITY_Community 21|Community 21]]
- [[_COMMUNITY_Community 22|Community 22]]
- [[_COMMUNITY_Community 23|Community 23]]
- [[_COMMUNITY_Community 24|Community 24]]
- [[_COMMUNITY_Community 25|Community 25]]
- [[_COMMUNITY_Community 26|Community 26]]
- [[_COMMUNITY_Community 27|Community 27]]
- [[_COMMUNITY_Community 28|Community 28]]
- [[_COMMUNITY_Community 34|Community 34]]
- [[_COMMUNITY_Community 35|Community 35]]
- [[_COMMUNITY_Community 36|Community 36]]
- [[_COMMUNITY_Community 37|Community 37]]

## God Nodes (most connected - your core abstractions)
1. `AuthenticatedRequest` - 18 edges
2. `withAuth()` - 18 edges
3. `gemini` - 14 edges
4. `Dashboard Home Page` - 10 edges
5. `AI Lesson Workspace Page` - 10 edges
6. `deepseek` - 8 edges
7. `Auth Middleware` - 8 edges
8. `API Axios Client (lib/axios)` - 6 edges
9. `register()` - 5 edges
10. `useTheme()` - 5 edges

## Surprising Connections (you probably didn't know these)
- `ESLint Configuration` --references--> `Next.js Framework`  [EXTRACTED]
  eslint.config.mjs → README.md
- `Next.js Environment Types` --references--> `Next.js Framework`  [EXTRACTED]
  next-env.d.ts → README.md
- `Next.js Configuration` --references--> `Next.js Framework`  [EXTRACTED]
  next.config.ts → README.md
- `proxy (Middleware)` --references--> `Next.js Framework`  [EXTRACTED]
  src/proxy.ts → README.md
- `register()` --calls--> `setupCronJobs()`  [INFERRED]
  instrumentation.ts → lib/cron.ts

## Hyperedges (group relationships)
- **User-Centric Data Schema** — user_entity, course_entity, learneditem_entity, progress_entity, weekendtest_entity, wordoftheday_entity, dailylesson_entity [EXTRACTED 1.00]
- **Build Toolchain** — nextjs_framework, tailwindcss, postcss, react_compiler_pattern [INFERRED 0.90]
- **AI Content Generation Workflows** — lib_langgraph_courseGeneratorApp, lib_langgraph_levelEvaluatorApp, lib_langgraph_moduleGeneratorApp, lib_langgraph_questionGeneratorApp, lib_langgraph_testGeneratorApp, lib_langgraph_wordGeneratorApp [EXTRACTED 1.00]
- **JWT Authentication Flow** — lib_authMiddleware_withAuth, lib_axios_api, components_Sidebar [INFERRED 0.85]
- **Authentication Flow** — src_app_login_page_tsx, src_app_api_auth_login_route_ts, model_user, lib_axios [EXTRACTED 1.00]
- **Registration Flow** — src_app_signup_page_tsx, src_app_api_auth_register_route_ts, model_user, lib_axios [EXTRACTED 1.00]
- **Onboarding Flow** — src_app_api_auth_onboard_route_ts, model_user, model_course, lib_langgraph_courseGenerator [EXTRACTED 1.00]
- **Daily Module Pipeline** — src_app_api_modules_generate_route_ts, lib_authMiddleware, model_user, model_learnedItem, lib_langgraph_moduleGenerator, model_dailyLesson [EXTRACTED 1.00]
- **Level Evaluation Pipeline** — src_app_api_level_evaluate_route_ts, lib_authMiddleware, model_user, model_learnedItem, model_progress, model_weekendTest, lib_langgraph_levelEvaluator [EXTRACTED 1.00]
- **Weekend Test Pipeline** — src_app_api_test_generate_route_ts, src_app_api_test_submit_route_ts, lib_authMiddleware, model_user, lib_langgraph_testGenerator, model_weekendTest [EXTRACTED 1.00]
- **Progress Tracking Subsystem** — src_app_api_progress_save_route_ts, src_app_api_progress_stats_route_ts, lib_authMiddleware, model_learnedItem, model_progress, model_dailyLesson, model_weekendTest, model_user [EXTRACTED 1.00]
- **LangGraph AI Generation Layer** — lib_langgraph_courseGenerator, lib_langgraph_questionGenerator, lib_langgraph_levelEvaluator, lib_langgraph_moduleGenerator, lib_langgraph_testGenerator, lib_langgraph_wordGenerator [INFERRED 0.85]
- **Dashboard Section** — dashboard_layout, dashboard_home, achievements_page, ask_ai_page, evaluation_page, grammar_page, grammar_history_page, hangul_page, modules_page, module_lesson_page, numbers_page, profile_page, progress_page, settings_page, test_page, vocabulary_page, vocabulary_history_page [EXTRACTED 1.00]
- **Module Learning Flow** — modules_page, api_modules_generate, local_storage_current_lesson, module_lesson_page, api_progress_save [EXTRACTED 1.00]
- **Grammar and Vocabulary Lock Pattern** — grammar_page, vocabulary_page, api_modules_today, modules_page [EXTRACTED 1.00]
- **API Client Consumer Pages** — dashboard_home, grammar_page, grammar_history_page, vocabulary_page, vocabulary_history_page, modules_page, module_lesson_page, evaluation_page, progress_page, test_page [INFERRED 0.90]
- **Public Static UI Icons** — file_icon, globe_icon, window_icon [EXTRACTED 1.00]
- **Next.js and Vercel Branding** — next_logo, vercel_logo [EXTRACTED 1.00]

## Communities (38 total, 16 thin omitted)

### Community 0 - "Community 0"
Cohesion: 0.12
Nodes (24): POST, POST, GET, levelEvaluatorApp, Auth Middleware, AuthenticatedRequest, RouteHandler, withAuth() (+16 more)

### Community 1 - "Community 1"
Cohesion: 0.06
Nodes (25): DashboardHome(), EvaluationPage(), ConjugationForm, ConjugationTable, GrammarPage(), GrammarRule, IrregularItem, LessonPage() (+17 more)

### Community 2 - "Community 2"
Cohesion: 0.09
Nodes (29): evaluateLevelNode(), EvaluationSchema, EvaluatorState, workflow, ConjugationFormSchema, ConjugationTableSchema, generateModuleNode(), GrammarRuleSchema (+21 more)

### Community 3 - "Community 3"
Cohesion: 0.13
Nodes (15): metadata, outfit, RootLayout(), LandingPage(), mainNavItems, NavLink(), Sidebar(), ThemeToggle() (+7 more)

### Community 4 - "Community 4"
Cohesion: 0.14
Nodes (24): API Axios Client (lib/axios), API: POST /level/evaluate, API: POST /modules/generate, API: GET /modules/history, API: GET /modules/today, API: POST /progress/save, API: GET /progress/stats, API: POST /test/generate (+16 more)

### Community 5 - "Community 5"
Cohesion: 0.27
Nodes (9): courseGeneratorApp, CourseGenState, CourseModuleSchema, CoursePlanSchema, generateCourseNode(), workflow, Course Generator LangGraph, Course Prisma Model (+1 more)

### Community 6 - "Community 6"
Cohesion: 0.27
Nodes (8): ConjugationForm, ConjugationTable, GrammarRule, IrregularItem, PastGrammarPage(), PastLesson, PastVocabularyPage(), VocabWord

### Community 7 - "Community 7"
Cohesion: 0.27
Nodes (8): generateWordNode(), wordGeneratorApp, WordGenState, WordOfTheDaySchema, workflow, Word Generator LangGraph, WordOfTheDay Prisma Model, GET()

### Community 8 - "Community 8"
Cohesion: 0.31
Nodes (7): POST(), generateNode(), GraphState, questionGeneratorApp, QuestionSchema, workflow, Question Generator LangGraph

### Community 9 - "Community 9"
Cohesion: 0.39
Nodes (5): KOREAN_NUMBERS, KoreanNumbersPage(), MainTab, NativeTab, SinoTab

### Community 10 - "Community 10"
Cohesion: 0.43
Nodes (4): HangulPage(), Tab, tabs, HANGUL_DATA

### Community 11 - "Community 11"
Cohesion: 0.25
Nodes (8): ESLint Configuration, Next.js Configuration, Next.js Environment Types, Next.js Framework, Prisma Configuration, Prisma ORM, proxy (Middleware), React Compiler

### Community 13 - "Community 13"
Cohesion: 0.33
Nodes (6): Course, DailyLesson, LearnedItem, Progress, User, WeekendTest

### Community 14 - "Community 14"
Cohesion: 0.6
Nodes (3): AskAIPage(), Message, SavedQuery

### Community 15 - "Community 15"
Cohesion: 0.4
Nodes (5): File Icon, Globe Icon, Next.js Logo, Vercel Logo, Window Icon

### Community 17 - "Community 17"
Cohesion: 0.5
Nodes (4): PostCSS, PostCSS Configuration, Tailwind CSS Configuration, Tailwind CSS

### Community 21 - "Community 21"
Cohesion: 0.67
Nodes (3): Sidebar navigation, Theme toggle button, Theme provider

## Knowledge Gaps
- **44 isolated node(s):** `eslintConfig`, `nextConfig`, `ESLint Configuration`, `Next.js Environment Types`, `Prisma Configuration` (+39 more)
  These have ≤1 connection - possible missing edges or undocumented components.
- **16 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `gemini` connect `Community 2` to `Community 8`, `Community 5`, `Community 7`?**
  _High betweenness centrality (0.052) - this node is a cross-community bridge._
- **Are the 2 inferred relationships involving `Dashboard Home Page` (e.g. with `Dashboard Layout` and `API: GET /progress/stats`) actually correct?**
  _`Dashboard Home Page` has 2 INFERRED edges - model-reasoned connections that need verification._
- **Are the 3 inferred relationships involving `AI Lesson Workspace Page` (e.g. with `Grammar Lab Page` and `Vocabulary Flashcards Page`) actually correct?**
  _`AI Lesson Workspace Page` has 3 INFERRED edges - model-reasoned connections that need verification._
- **What connects `eslintConfig`, `nextConfig`, `ESLint Configuration` to the rest of the system?**
  _44 weakly-connected nodes found - possible documentation gaps or missing edges._
- **Should `Community 0` be split into smaller, more focused modules?**
  _Cohesion score 0.12 - nodes in this community are weakly interconnected._
- **Should `Community 1` be split into smaller, more focused modules?**
  _Cohesion score 0.06 - nodes in this community are weakly interconnected._
- **Should `Community 2` be split into smaller, more focused modules?**
  _Cohesion score 0.09 - nodes in this community are weakly interconnected._