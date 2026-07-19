window.portfolioData = Object.freeze({
  supportingProjects: [
    {
      index: "02.1",
      status: "verified",
      statusLabel: "Public source",
      title: "Smart Parking System",
      description: "A Python parking-management system that models slot availability, vehicle allocation, and occupancy records with object-oriented data structures.",
      points: [
        "Implements automated space allocation and release logic",
        "Uses OOP boundaries for parking state and vehicle records",
        "Makes the implementation inspectable in a public repository"
      ],
      stack: ["Python", "OOP", "Data structures", "Algorithms"],
      link: "https://github.com/sibaiali/PMS/blob/main/pms.py",
      linkLabel: "Inspect source",
      external: true
    }
  ],
  researchWriting: [
    {
      status: "evaluation",
      statusLabel: "Course research paper",
      title: "Behavioral NLP Testing Framework",
      description: "Explores capability matrices and minimum-functionality, invariance, and directional tests for structured NLP evaluation. Presented as research methodology, not a deployed validation system.",
      tags: ["NLP", "Evaluation design", "Research methodology"],
      link: "docs/CE472_ResearchPaper_NLP.pdf",
      linkLabel: "Read paper"
    }
  ],
  futureProjects: [
    {
      title: "C++ Behaviour-Tree AI Sandbox",
      status: "planned",
      active: false,
      scopes: [
        "Modern C++",
        "Perception",
        "Patrol, investigate, chase, attack, and retreat states",
        "Behaviour tree",
        "Finite-state-machine comparison",
        "Debugging visualization",
        "Profiling",
        "Tests"
      ]
    },
    {
      title: "Games UI Design System",
      status: "planned",
      active: false,
      scopes: [
        "TypeScript",
        "Reusable game-interface components",
        "Settings",
        "HUD",
        "Loadout",
        "Keyboard/controller navigation",
        "Accessibility",
        "Localization",
        "Testing",
        "Performance"
      ]
    }
  ],
  capabilities: [
    {
      code: "RT",
      title: "Game & real-time systems",
      items: [
        "Game loops",
        "Runtime telemetry",
        "State prediction",
        "Adaptive-system architecture",
        "Object pooling",
        "Performance-aware browser games"
      ]
    },
    {
      code: "PL",
      title: "Programming",
      items: [
        "JavaScript - primary project language",
        "Python - implemented project work",
        "C++ - developing",
        "C - academic foundation",
        "Java - academic foundation"
      ]
    },
    {
      code: "EP",
      title: "Engineering practices",
      items: [
        "Git",
        "Deterministic testing",
        "Runtime instrumentation",
        "Evaluation design",
        "Debugging",
        "PWA development",
        "Technical documentation"
      ]
    }
  ],
  selectedTraining: [
    {
      name: "Elements of AI",
      provider: "University of Helsinki & MinnaLearn",
      detail: "2 ECTS · Completed 2024",
      status: "verified"
    }
  ]
});
