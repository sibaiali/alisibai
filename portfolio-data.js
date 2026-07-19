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
    },
    {
      index: "02.2",
      status: "evaluation",
      statusLabel: "Research paper",
      title: "Behavioral NLP Testing Framework",
      description: "A course research paper exploring capability matrices and structured behavioral tests for evaluating NLP systems across multiple task types.",
      points: [
        "Organizes minimum-functionality, invariance, and directional tests",
        "Examines compact test selection as an evaluation-design problem",
        "Presented as research methodology, not a deployed validation system"
      ],
      stack: ["NLP", "Evaluation design", "AI research", "Python"],
      link: "docs/CE472_ResearchPaper_NLP.pdf",
      linkLabel: "Read paper",
      external: false
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
  selectedCredentials: [
    {
      name: "German",
      area: "B1"
    }
  ]
});
