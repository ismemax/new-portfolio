/*
  PORTFOLIO CONTENT FILE
  Edit only the values in this file to personalize the website.
  Keep IDs unique and use one of these art values: game, backend, iot, full.
*/
const portfolioContent = {
  profile: {
    name: "Von Andrew M. Castillo",
    shortName: "VAC",
    role: "Developer",
    availability: "Available for opportunities",
    intro:
      "I'm Von Andrew Castillo, a developer who moves comfortably between immersive game mechanics, reliable backend systems, connected hardware, and purposeful web experiences.",
    about:
      "I enjoy translating an idea into an experience people can actually use - whether that means a suspenseful game sequence, a responsive interface, an efficient data model, or an Arduino-powered feeder.",
    email: "voncastillovon@gmail.com",
    startYear: "2022",
    copyrightYear: "2026",
    socials: {
      github: "https://github.com/ismemax",
      linkedin: "https://www.linkedin.com/in/voncastillo",
    },
    resume: "../../../work/pdf/VON ANDREW CASTILLO.pdf", // 👈 Replace '#' with your actual CV link (e.g. Google Drive link or local 'cv.pdf')
  },
  // Add any kind of project link here. Examples: GitHub, Live demo, Google Drive, Figma, Itch.io, or YouTube.
  // Use { label: 'What visitors should see', url: 'https://...' }. Keep links: [] when there are none.
  projectLinks: {
    scamester: {
      links: [
        {
          label: "Google Drive",
          url: "https://drive.google.com/file/d/128Ry-G0TAgJzcKAtBiVj0NKD8mZTEe4v/view?usp=drive_link",
        },
      ],
    },
    booklat: {
      links: [
        {
          label: "GitHub",
          url: "https://github.com/FredluisLeCoderist/LibraryManagementSystem",
        },
      ],
    },
    deception: { links: [] },
    "pet-feeder": {
      links: [
        { label: "GitHub", url: "https://github.com/NardHodo/PetFeeder-Main" },
      ],
    },
    library: {
      links: [
        {
          label: "GitHub",
          url: "https://github.com/ismemax/LibraryManagement",
        },
      ],
    },
    kopi: {
      links: [
        {
          label: "GitHub",
          url: "https://github.com/NotoriousGeeks/NotoriousGeeksPOS",
        },
      ],
    },
    cybercafe: {
      links: [
        { label: "GitHub", url: "https://github.com/NotoriousGeeks/gudjavuh" },
      ],
    },
    kinalyah: {
      links: [
        { label: "GitHub", url: "https://github.com/ismemax/kinaiyah-ka-feh" },
      ],
    },
  },
  projects: [
    {
      id: "scamester",
      title: "Scamester",
      role: "Game Developer",
      category: "Game Dev",
      date: "Aug 2025 - Present",
      art: "game",
      desc: "An adaptive Unity game that connects real-time player states with Firebase and model inference APIs.",
      features: [
        "Connected the Unity client to Firebase for real-time data sync",
        "Built responsive in-game UI and state transitions",
        "Created REST endpoints for game-to-model communication",
      ],
      stack: ["Unity", "C#", "Firebase", "REST API"],
      arch: ["Unity Client", "Firebase", "Inference API"],
    },
    {
      id: "booklat",
      title: "Booklat",
      role: "Back End Developer",
      category: "Backend & APIs",
      date: "Feb 2025 - Jun 2025",
      art: "backend",
      desc: "A digital book repository backend with cloud media storage and real-time data.",
      features: [
        "Engineered core application logic in C#",
        "Established real-time Firebase datastore integration",
        "Automated image compression and cover hosting with Cloudinary",
      ],
      stack: ["C#", "SQL", "Firebase", "Cloudinary"],
      arch: ["C# Service", "Firebase", "Cloudinary"],
    },
    {
      id: "deception",
      title: "Deception",
      role: "Game Developer",
      category: "Game Dev",
      date: "Aug 2024 - Jan 2025",
      art: "game",
      desc: "A psychological horror game where precise sequences, atmosphere, and player tension are the system.",
      features: [
        "Implemented event sequences against game design documentation",
        "Integrated animation, particles, music and sound effects",
        "Built complete game-loop and state-management logic",
      ],
      stack: ["Unity", "C#", "UI/UX"],
      arch: ["Player Input", "Unity Logic", "Audio + FX"],
    },
    {
      id: "pet-feeder",
      title: "Mobile Pet Feeder",
      role: "Full Stack Developer",
      category: "IoT / Hardware",
      date: "Feb 2024 - Jun 2024",
      art: "iot",
      desc: "An automated feeder pairing physical microcontrollers with a remote Java mobile client.",
      features: [
        "Constructed a NodeMCU and Arduino hardware prototype",
        "Connected the mobile client to the board wirelessly",
        "Implemented trigger logic across hardware and application layers",
      ],
      stack: ["NodeMCU", "Arduino", "Java", "IoT"],
      arch: ["Java App", "NodeMCU", "Arduino"],
    },
    {
      id: "library",
      title: "Library Management System",
      role: "Back End Developer",
      category: "Backend & APIs",
      date: "Aug 2023 - Jan 2024",
      art: "backend",
      desc: "A high-efficiency desktop library application backed by a normalized relational SQL database.",
      features: [
        "Designed normalized database schemas and SQL queries",
        "Built core system execution logic in C#",
        "Optimized queries for stronger retrieval performance",
      ],
      stack: ["C#", "SQL"],
      arch: ["Desktop App", "C# Logic", "SQL Database"],
    },
    {
      id: "kopi",
      title: "Kopi Cold Brew POS",
      role: "Full Stack Developer",
      category: "Full Stack",
      date: "Feb 2023 - Jun 2023",
      art: "full",
      desc: "A web POS system for transactions, dynamic totals, and session-based client orders.",
      features: [
        "Created the interface using HTML, CSS and JavaScript",
        "Implemented transaction calculations and session order logic",
        "Partnered with design to refine user flow",
      ],
      stack: ["JavaScript", "HTML", "CSS"],
      arch: ["POS UI", "JS Session", "Order Total"],
    },
    {
      id: "cybercafe",
      title: "Cybercafe Management",
      role: "Back End Developer",
      category: "Backend & APIs",
      date: "Feb 2023 - Jun 2023",
      art: "backend",
      desc: "A Java peer-to-peer utility for creating safer device-to-device node connections.",
      features: [
        "Designed the peer-to-peer connection protocol",
        "Implemented socket communication and message listeners",
        "Contributed to the network security design",
      ],
      stack: ["Java", "P2P", "Networking"],
      arch: ["Node A", "P2P Protocol", "Node B"],
    },
    {
      id: "kinalyah",
      title: "Kinalyah Ka-feh",
      role: "Full Stack Developer",
      category: "Full Stack",
      date: "Aug 2022 - Jan 2023",
      art: "full",
      desc: "An interactive storefront with custom motion and a client-side light/dark theme engine.",
      features: [
        "Designed computer and mobile interfaces from scratch",
        "Built a responsive HTML, CSS and JavaScript frontend",
        "Added custom animation and a dynamic theme toggle",
      ],
      stack: ["JavaScript", "HTML", "CSS", "UI/UX"],
      arch: ["Storefront UI", "Theme Engine", "Client State"],
    },
  ],
};
