# Project content and media

Edit stacks, story answers, and galleries in `src/lib/projectDetails.ts`. Names, summaries, and GitHub links are in `src/lib/portfolio.ts`.

The three story answers are technical drafts inferred from the code. Personal motivation and the actual hardest experience have not been confirmed. Replace these with your own experience as you review each project.

## Photos and videos

Put image files and MP4/WebM videos in `static/projects/`, then add a media entry to the relevant project. A browser URL starts with `/projects/` (without `static`). Videos use native playback controls and do not autoplay. Optional `poster` and WebVTT `captions` files are supported.

```ts
{
  kind: 'video',
  src: '/projects/wayfinder-demo.mp4',
  alt: 'Wayfinder obstacle detection demonstration',
  caption: 'Wayfinder hardware demonstration.',
  // poster: '/projects/wayfinder.jpg',
  // captions: '/projects/wayfinder-demo.vtt'
}
```

Wayfinder's original photo is in `static/projects/wayfinder.jpg`. The supplied `6ac...` demo is in `static/projects/wayfinder-demo.mp4`; its source already contained H.264/AAC in an MP4 container, so the copy preserves the original bytes.

The video thumbnail is `static/projects/wayfinder-video-poster.jpg`, extracted from the demo at approximately eight seconds and showing the cane being tested in the hallway.

The Breast Cancer Survival images are saved analysis charts from its repository. Pairs Trading images were extracted from saved notebook output without running the notebook. The Personal Website image is a screenshot of the running homepage. Other repositories did not contain genuine application screenshots or verified public demo URLs.

## Draft answers and evidence

### aimockinterviewer

- Stack: React, Python, FastAPI, Gemini, ElevenLabs, Supabase.
- Reason: Help candidates practice role-specific interviews through personalized questions, voice conversations, and résumé-based feedback.
- Hardest part: Keep follow-ups relevant, avoid repeated questions, and ground feedback in the candidate’s résumé and actual answers.
- Improvement: Evaluate question relevance and feedback quality across more roles, résumés, and interview styles.
- Evidence: package.json; backend/main.py; src/components/InterviewTab.jsx; src/lib/generateQuestions.js; src/lib/generateFeedback.js; src/lib/elevenlabs.js; src/pages/Landing.jsx.

### breastcancersurvival

- Stack: Python, pandas, scikit-survival, XGBoost, SHAP, Matplotlib.
- Reason: Compare survival models using clinical and genomic data, while explaining which features influence predicted risk.
- Hardest part: Handle censored outcomes and genomic features while comparing survival models fairly and explaining their predictions.
- Improvement: Fit preprocessing within training folds, improve calibration, and validate models on an independent dataset.
- Evidence: README.md; breast_cancer_survival.py.

### claudehackathon

- Stack: Next.js, TypeScript, TensorFlow.js, MobileNet, Prisma, SQLite.
- Reason: Turn food already in the fridge into meal ideas, with pantry, grocery, and nutrition tools in one place.
- Hardest part: Identify multiple ingredients in cluttered photos and connect image labels to useful pantry items and recipes.
- Improvement: Use ingredient-focused object detection, test varied fridge photos, and let users correct uncertain predictions.
- Evidence: package.json; prisma/schema.prisma; src/hooks/useIngredientDetector.ts; src/components/home/HomeTab.tsx; src/lib/intelligence.ts; src/app/api/recipes/route.ts; src/app/api/vision/detect-ingredients/route.ts.

### international-football-prediction

- Stack: Python, pandas, NumPy, scikit-learn, Jupyter.
- Reason: Explore how match history, FIFA rankings, and recent team form can predict international football outcomes.
- Hardest part: Align matches with historical rankings and calculate recent form without using information from future games.
- Improvement: Add outcome probabilities, strengthen time-based evaluation, and build an interface for choosing teams.
- Evidence: README.md; matchresults.ipynb:cell 0; matchresults.ipynb:cell 1.

### matrix-multiplication

- Stack: C++, STL, std::chrono.
- Reason: Explore how cache-aware algorithms improve matrix multiplication by comparing standard and blocked C++ implementations.
- Hardest part: Handle boundary tiles correctly and compare execution times consistently across matrix sizes and block sizes.
- Improvement: Add correctness tests, tune block sizes across matrix dimensions, and explore SIMD or multithreading.
- Evidence: src/main.cpp:matrixMultiplicationNaive; src/main.cpp:matrixMultiplicationBlocked; src/main.cpp:main; include/Matrix.h.

### option-pricer

- Stack: C++, OpenMP, Python, pandas, NumPy, yfinance.
- Reason: Compare European option pricing methods and connect C++ simulations with Python market-data validation.
- Hardest part: Compare four numerical methods consistently while managing precision and thread-safe random sampling.
- Improvement: Add confidence intervals, automated numerical tests, and broader validation across strikes and expirations.
- Evidence: README.md; src/main.cpp; src/models/MonteCarloModel.cpp; scripts/market_test.py; option_prices.csv; atm_market_validation_results.csv.

### pairs-trading

- Stack: Python, pandas, NumPy, statsmodels, yfinance, Matplotlib.
- Reason: Explore stock-pair relationships and test statistical spread signals through a historical backtesting workflow.
- Hardest part: Distinguish correlation from spread relationships, then turn statistical signals into consistent trades and calculations.
- Improvement: Use out-of-sample validation, include trading costs, and separate data, signals, and backtesting into tested modules.
- Evidence: notebook/demotradingbot.ipynb:cells 0-4; notebook/demotradingbot.ipynb:cells 11-19; notebook/demotradingbot.ipynb:cell 23.

### moviesstore

- Stack: Python, Django, SQLite, HTML, CSS, Bootstrap.
- Reason: Build a Django storefront combining movie discovery, accounts, reviews, purchases, and community requests.
- Hardest part: Keep carts, orders, reviews, and votes linked to the correct user while maintaining consistent session and database state.
- Improvement: Validate checkout inputs, create orders atomically, and add pagination as the movie catalog grows.
- Evidence: movies/views.py — search, reviews, and petition voting; movies/models.py — Movie, Review, and Petition relational models; cart/views.py — session cart, checkout, Order and Item records; accounts/views.py — account authentication and user order history; moviesstore/templates/base.html — Bootstrap 5 and custom CSS; db.sqlite3 — SQLite database file.

### wayfinder

- Stack: C++, Arduino, ESP32, FreeRTOS, Wi-Fi, Telegram Bot API.
- Reason: Combine obstacle awareness and a help button in a smart-cane prototype with audio and Telegram alerts.
- Hardest part: Keep obstacle sensing responsive during network alerts while avoiding sensor interference and repeated SOS messages.
- Improvement: Add haptics, battery monitoring, and an enclosure, then test obstacle detection and SOS alerts in real walking conditions.
- Evidence: wayfinder.ino — Arduino Nano ESP32 hardware pins and libraries; wayfinder.ino:updateObstacleAlert — alternating ultrasonic sensors and distance-based beeps; wayfinder.ino:sosWorker — FreeRTOS task keeps Telegram sending separate from sensing; wayfinder.ino:updateButton — debounced five-second press and one SOS per hold; wayfinder.ino:updateWiFi — persistent connection and retry handling.

### personalwebsite

- Stack: SvelteKit, Svelte, TypeScript, CSS, Vite, Web Audio API.
- Reason: Create a game-inspired portfolio where visitors explore my background, skills, and projects through an interactive menu.
- Hardest part: Keep the visual style responsive while supporting keyboard navigation, reduced motion, and consistent audio controls.
- Improvement: Optimize video and music loading, refine page metadata, and test navigation with assistive technology.
- Evidence: /private/tmp/portfolio-effects-validation/package.json — SvelteKit, Svelte, TypeScript, and Vite dependencies; src/routes/+page.svelte — Persona-inspired menu, keyboard navigation, and modal sections; src/routes/projects/+page.svelte — responsive project inventory and repository links; src/lib/portfolioExperience.ts — shared audio and motion preferences across routes; /private/tmp/portfolio-effects-validation/src/lib/menuAudio.ts — generated Web Audio oscillator cues; /private/tmp/portfolio-effects-validation/src/lib/VideoBackground.svelte — background video playback, visibility, and reduced-motion handling; REFERENCE.md — reference visual direction and asset provenance.
