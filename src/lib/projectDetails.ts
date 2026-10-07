import type { Project } from './portfolio';

// Story answers are editable technical drafts inferred from repository code.
// Confirm personal motivation and the hardest experience before treating them as final.
export const projectDetails: Record<string, Pick<Project, 'stack' | 'story' | 'media'>> = {
  "wisp": {
    "stack": [
      "Java",
      "Spring Boot",
      "Redis",
      "ClickHouse",
      "MySQL",
      "React",
      "Docker",
      "JUnit",
      "Testcontainers",
      "GitHub Actions"
    ],
    "story": {
      "reason": "Build web analytics that counts visitors without cookies or stored IP addresses, using a daily-rotating salted hash so no one can be followed across days.",
      "challenge": "Count every event exactly once on top of at-least-once Redis Streams delivery. Batch deduplication tokens in ClickHouse, sealed retry batches, and crash-injection integration tests keep the rollups correct.",
      "improvement": "Deploy it publicly, add funnels and custom events, and load-test the ingest path with multiple workers."
    },
    "media": []
  },
  "cosmillion": {
    "stack": [
      "Python",
      "Django",
      "Django REST Framework",
      "PostgreSQL",
      "SvelteKit",
      "TypeScript",
      "Docker",
      "AWS",
      "GitHub Actions",
      "pytest",
      "Playwright"
    ],
    "story": {
      "reason": "Turn Krillion's rare-answers-score-more idea into a space game: 703 prompts built from Wikidata, with fuel based on Wikipedia pageviews, plus party rooms and a daily challenge.",
      "challenge": "Keep timed party rounds synchronized and consistent under concurrent answers, using PostgreSQL constraints and ordered row locks. Load tests also traced a CPU bottleneck to per-request database connections; fixing it gave +69% throughput and 42% lower median latency.",
      "improvement": "Replace party polling with WebSockets, grow the question bank, and add accounts so streaks follow players across devices."
    },
    "media": [
      {
        "kind": "image",
        "src": "/projects/cosmillion-launch.jpg",
        "alt": "Cosmillion launch screen with Begin launch, Play with friends, and Daily challenge buttons",
        "caption": "The Cosmillion launch pad, captured from the live site."
      },
      {
        "kind": "image",
        "src": "/projects/cosmillion-flight.jpg",
        "alt": "Pixel rocket climbing past Venus after an answer",
        "caption": "An answer lands and the rocket climbs past real solar-system distances."
      },
      {
        "kind": "image",
        "src": "/projects/cosmillion-result.jpg",
        "alt": "Cosmillion result card showing a one-in-a-million answer and topic choices",
        "caption": "A Cosmillion-tier answer: rare picks burn more fuel and charge a boost."
      }
    ]
  },
  "cpu-scheduler": {
    "stack": [
      "C",
      "pthreads",
      "Linux",
      "Make",
      "GDB"
    ],
    "story": {
      "reason": "Implement the scheduling policies from my operating systems course inside a multiprocessor OS simulator: FCFS, Round Robin, SRTF, and preemptive priority.",
      "challenge": "Run one thread per simulated CPU while protecting the shared ready queue and per-CPU state with mutexes and condition variables, so idle CPUs block instead of spinning.",
      "improvement": "Add aging to prevent starvation under priority scheduling and compare policies across more workloads."
    },
    "media": []
  },
  "aimockinterviewer": {
    "stack": [
      "React",
      "Python",
      "FastAPI",
      "Gemini",
      "ElevenLabs",
      "Supabase"
    ],
    "story": {
      "reason": "Help candidates practice role-specific interviews through personalized questions, voice conversations, and résumé-based feedback.",
      "challenge": "Keep follow-ups relevant, avoid repeated questions, and ground feedback in the candidate’s résumé and actual answers.",
      "improvement": "Evaluate question relevance and feedback quality across more roles, résumés, and interview styles."
    },
    "media": []
  },
  "breastcancersurvival": {
    "stack": [
      "Python",
      "pandas",
      "scikit-survival",
      "XGBoost",
      "SHAP",
      "Matplotlib"
    ],
    "story": {
      "reason": "Compare survival models using clinical and genomic data, while explaining which features influence predicted risk.",
      "challenge": "Handle censored outcomes and genomic features while comparing survival models fairly and explaining their predictions.",
      "improvement": "Fit preprocessing within training folds, improve calibration, and validate models on an independent dataset."
    },
    "media": [
      {
        "kind": "image",
        "src": "/projects/breast-cancer-models.png",
        "alt": "Breast cancer survival model comparison charts",
        "caption": "Model comparison chart saved in the Breast Cancer Survival repository."
      },
      {
        "kind": "image",
        "src": "/projects/breast-cancer-shap.png",
        "alt": "SHAP feature importance chart for the survival model",
        "caption": "Feature explanation chart saved in the Breast Cancer Survival repository."
      }
    ]
  },
  "claudehackathon": {
    "stack": [
      "Next.js",
      "TypeScript",
      "TensorFlow.js",
      "MobileNet",
      "Prisma",
      "SQLite"
    ],
    "story": {
      "reason": "Turn food already in the fridge into meal ideas, with pantry, grocery, and nutrition tools in one place.",
      "challenge": "Identify multiple ingredients in cluttered photos and connect image labels to useful pantry items and recipes.",
      "improvement": "Use ingredient-focused object detection, test varied fridge photos, and let users correct uncertain predictions."
    },
    "media": []
  },
  "international-football-prediction": {
    "stack": [
      "Python",
      "pandas",
      "NumPy",
      "scikit-learn",
      "Jupyter"
    ],
    "story": {
      "reason": "Explore how match history, FIFA rankings, and recent team form can predict international football outcomes.",
      "challenge": "Align matches with historical rankings and calculate recent form without using information from future games.",
      "improvement": "Add outcome probabilities, strengthen time-based evaluation, and build an interface for choosing teams."
    },
    "media": []
  },
  "matrix-multiplication": {
    "stack": [
      "C++",
      "STL",
      "std::chrono"
    ],
    "story": {
      "reason": "Explore how cache-aware algorithms improve matrix multiplication by comparing standard and blocked C++ implementations.",
      "challenge": "Handle boundary tiles correctly and compare execution times consistently across matrix sizes and block sizes.",
      "improvement": "Add correctness tests, tune block sizes across matrix dimensions, and explore SIMD or multithreading."
    },
    "media": []
  },
  "option-pricer": {
    "stack": [
      "C++",
      "OpenMP",
      "Python",
      "pandas",
      "NumPy",
      "yfinance"
    ],
    "story": {
      "reason": "Compare European option pricing methods and connect C++ simulations with Python market-data validation.",
      "challenge": "Compare four numerical methods consistently while managing precision and thread-safe random sampling.",
      "improvement": "Add confidence intervals, automated numerical tests, and broader validation across strikes and expirations."
    },
    "media": []
  },
  "pairs-trading": {
    "stack": [
      "Python",
      "pandas",
      "NumPy",
      "statsmodels",
      "yfinance",
      "Matplotlib"
    ],
    "story": {
      "reason": "Explore stock-pair relationships and test statistical spread signals through a historical backtesting workflow.",
      "challenge": "Distinguish correlation from spread relationships, then turn statistical signals into consistent trades and calculations.",
      "improvement": "Use out-of-sample validation, include trading costs, and separate data, signals, and backtesting into tested modules."
    },
    "media": [
      {
        "kind": "image",
        "src": "/projects/pairs-spread.png",
        "alt": "NVDA and ORCL spread z-score with entry and exit bands",
        "caption": "Saved spread chart from the Pairs Trading research notebook."
      },
      {
        "kind": "image",
        "src": "/projects/pairs-correlation.png",
        "alt": "Correlation heatmap of twenty technology stocks",
        "caption": "Saved correlation analysis from the Pairs Trading research notebook."
      }
    ]
  },
  "moviesstore": {
    "stack": [
      "Python",
      "Django",
      "SQLite",
      "HTML",
      "CSS",
      "Bootstrap"
    ],
    "story": {
      "reason": "Build a Django storefront combining movie discovery, accounts, reviews, purchases, and community requests.",
      "challenge": "Keep carts, orders, reviews, and votes linked to the correct user while maintaining consistent session and database state.",
      "improvement": "Validate checkout inputs, create orders atomically, and add pagination as the movie catalog grows."
    },
    "media": []
  },
  "wayfinder": {
    "stack": [
      "C++",
      "Arduino",
      "ESP32",
      "FreeRTOS",
      "Wi-Fi",
      "Telegram Bot API"
    ],
    "story": {
      "reason": "Combine obstacle awareness and a help button in a smart-cane prototype with audio and Telegram alerts.",
      "challenge": "Keep obstacle sensing responsive during network alerts while avoiding sensor interference and repeated SOS messages.",
      "improvement": "Add haptics, battery monitoring, and an enclosure, then test obstacle detection and SOS alerts in real walking conditions."
    },
    "media": [
      {
        "kind": "image",
        "src": "/projects/wayfinder.jpg",
        "alt": "Wayfinder prototype with ultrasonic sensors, wiring, and an ESP32 board on its wooden mount",
        "caption": "Wayfinder hardware prototype. Photo provided by Gabriel Cruz."
      },
      {
        "kind": "video",
        "src": "/projects/wayfinder-demo.mp4",
        "poster": "/projects/wayfinder-video-poster.jpg",
        "alt": "Wayfinder obstacle detection demonstration",
        "caption": "Wayfinder in action. Demo video provided by Gabriel Cruz."
      }
    ]
  },
  "personalwebsite": {
    "stack": [
      "SvelteKit",
      "Svelte",
      "TypeScript",
      "CSS",
      "Vite",
      "Web Audio API"
    ],
    "story": {
      "reason": "Create a game-inspired portfolio where visitors explore my background, skills, and projects through an interactive menu, with typed TypeScript models powering each project case study.",
      "challenge": "Keep the visual style responsive while supporting keyboard controls, modal focus restoration, and reduced motion. Menu sounds are synthesized with Web Audio oscillators and gain envelopes, unlocked by a user gesture and throttled.",
      "improvement": "Optimize video and music loading, refine page metadata, and test navigation with assistive technology."
    },
    "media": [
      {
        "kind": "image",
        "src": "/projects/personal-website.png",
        "alt": "Gabriel Cruz's game-inspired portfolio homepage",
        "caption": "Screenshot of this portfolio running in the local preview."
      }
    ]
  }
};
