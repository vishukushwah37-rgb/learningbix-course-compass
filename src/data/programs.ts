import { img } from "@/lib/images";

export type ProgramSlug = "robotics" | "coding" | "preschool" | "stem" | "artificial-intelligence";

export type Program = {
  slug: ProgramSlug;
  name: string;
  short: string;
  tagline: string;
  intro: string;
  image: string;
  color: "primary" | "violet" | "sun" | "mint";
  ageGroups: { label: string; range: string; focus: string }[];
  outcomes: string[];
  curriculum: { level: string; topics: string[] }[];
  activities: string[];
  projects: string[];
  benefits: { title: string; text: string }[];
  faqs: { q: string; a: string }[];
};

export const PROGRAMS: Program[] = [
  {
    slug: "robotics",
    name: "Robotics",
    short: "Learn to build robots, circuits and intelligent machines.",
    tagline: "From first motor to autonomous machines",
    intro:
      "Our robotics program turns curiosity into engineering. Children assemble real kits, wire sensors and motors, and program their robots to move, sense and decide — progressing from simple wheeled bots to automated systems and IoT devices.",
    image: img.programRobotics,
    color: "primary",
    ageGroups: [
      { label: "Junior Builders", range: "6–9 yrs", focus: "Motors, gears and simple machines" },
      { label: "Robot Makers", range: "9–12 yrs", focus: "Sensors, logic and block coding" },
      { label: "Robotics Engineers", range: "12–16 yrs", focus: "Microcontrollers, IoT and automation" },
    ],
    outcomes: ["Assemble and wire a working robot", "Program sensors and motors", "Understand circuits and electronics", "Design solutions to real problems", "Debug hardware and software", "Present and explain their builds"],
    curriculum: [
      { level: "Beginner Robotics", topics: ["Simple machines & gears", "DC motors", "Line follower basics"] },
      { level: "Intermediate Robotics", topics: ["Ultrasonic & IR sensors", "Servo control", "Obstacle avoidance"] },
      { level: "Advanced Robotics", topics: ["Microcontrollers", "PID basics", "Autonomous navigation"] },
      { level: "Electronics", topics: ["Ohm's law", "Breadboards", "LEDs & resistors"] },
      { level: "Sensors and Motors", topics: ["Stepper motors", "Touch & light sensors", "Motor drivers"] },
      { level: "IoT", topics: ["Wi‑Fi modules", "Cloud dashboards", "Smart home model"] },
      { level: "Automation", topics: ["Conveyor systems", "Sorting machines", "Automatic doors"] },
    ],
    activities: ["Weekly build challenges", "Robot races and sumo battles", "Sensor scavenger hunts", "Team engineering sprints"],
    projects: ["Obstacle-avoiding robot", "Line-following car", "Smart dustbin", "Robotic arm", "Automatic plant waterer", "Bluetooth-controlled rover"],
    benefits: [
      { title: "Hands-on engineering", text: "Every class ends with something that moves, beeps or blinks." },
      { title: "Logical thinking", text: "Programming robots teaches cause, effect and sequencing." },
      { title: "Resilience", text: "Debugging builds patience and a growth mindset." },
      { title: "Teamwork", text: "Students collaborate in pairs and pods on bigger builds." },
    ],
    faqs: [
      { q: "Does my child need prior experience?", a: "No. Beginner Robotics starts from zero and uses kid-friendly parts." },
      { q: "Are kits included?", a: "Kits are included for in-centre classes. Online learners can buy a kit from our shop." },
      { q: "How long is each class?", a: "Classes run for 60–90 minutes, once or twice a week depending on the batch." },
      { q: "Will my child get a certificate?", a: "Yes. A verifiable LearningBIX certificate is issued when the course is completed." },
    ],
  },
  {
    slug: "coding",
    name: "Coding",
    short: "Develop programming skills through fun and interactive projects.",
    tagline: "Block code to real code, one project at a time",
    intro:
      "Kids begin with drag-and-drop blocks and grow into Python, C++ and web development. Every concept is anchored in a game, animation or app they can share with family and friends.",
    image: img.programCoding,
    color: "violet",
    ageGroups: [
      { label: "Code Cubs", range: "5–8 yrs", focus: "Sequencing and block puzzles" },
      { label: "Game Creators", range: "8–12 yrs", focus: "Scratch, game logic and animations" },
      { label: "Young Developers", range: "11–16 yrs", focus: "Python, C++ and the web" },
    ],
    outcomes: ["Think in algorithms", "Write clean, working programs", "Build and publish games", "Understand variables, loops and functions", "Create a personal website", "Collaborate on code"],
    curriculum: [
      { level: "Scratch Programming", topics: ["Sprites & events", "Loops & conditions", "Interactive stories"] },
      { level: "Block-Based Coding", topics: ["Sequencing", "Pattern recognition", "Coding puzzles"] },
      { level: "Python", topics: ["Variables & types", "Functions", "Turtle graphics & games"] },
      { level: "C++", topics: ["Syntax & compilation", "Arrays", "Hardware programming"] },
      { level: "Web Development Basics", topics: ["HTML", "CSS", "JavaScript interactivity"] },
      { level: "Game Development", topics: ["Game loops", "Collision & scoring", "Level design"] },
    ],
    activities: ["Code-along sessions", "Bug-hunt challenges", "Hackathon Fridays", "Peer code reviews"],
    projects: ["Maze game", "Quiz app", "Personal portfolio site", "Calculator", "Space shooter", "Timetable app"],
    benefits: [
      { title: "Computational thinking", text: "Break big problems into small, solvable steps." },
      { title: "Creativity", text: "Code is a canvas for stories, art and games." },
      { title: "Future-ready", text: "Programming literacy opens doors in every career." },
      { title: "Confidence", text: "Shipping a working app is a powerful motivator." },
    ],
    faqs: [
      { q: "What device does my child need?", a: "Any laptop or desktop with a modern browser. Tablets work for block coding." },
      { q: "Which language is best to start with?", a: "Under 10, start with Scratch or block coding; 10+ can begin Python." },
      { q: "Are classes live?", a: "Yes, small live batches with a mentor plus recorded lessons for revision." },
      { q: "Is there homework?", a: "Short optional challenges keep practice going between classes." },
    ],
  },
  {
    slug: "preschool",
    name: "Pre-School",
    short: "Early learning through creativity, exploration and activities.",
    tagline: "Play-based foundations for little innovators",
    intro:
      "For ages 3–6, learning happens through play. Colourful building sets, gears, stories and sensory activities develop fine motor skills, early logic and a lifelong love of exploring.",
    image: img.programPreschool,
    color: "sun",
    ageGroups: [
      { label: "Tiny Tots", range: "3–4 yrs", focus: "Colours, shapes and stacking" },
      { label: "Little Builders", range: "4–5 yrs", focus: "Gears, patterns and stories" },
      { label: "Junior Innovators", range: "5–6 yrs", focus: "Simple machines and unplugged coding" },
    ],
    outcomes: ["Fine motor development", "Shape & pattern recognition", "Early sequencing", "Language through storytelling", "Social play", "Curiosity and focus"],
    curriculum: [
      { level: "Explore", topics: ["Colours & shapes", "Sorting", "Stacking"] },
      { level: "Build", topics: ["Gears", "Bridges", "Towers"] },
      { level: "Imagine", topics: ["Story building", "Role play", "Unplugged coding games"] },
    ],
    activities: ["Story-build circles", "Gear gardens", "Sensory bins", "Music & movement"],
    projects: ["Gear windmill", "Block castle", "Colour sorting train", "Story box"],
    benefits: [
      { title: "Joyful learning", text: "Short, playful sessions designed for young attention spans." },
      { title: "Motor skills", text: "Grip, twist and stack activities build dexterity." },
      { title: "Early logic", text: "Patterns and sequences prepare kids for maths and coding." },
      { title: "Social skills", text: "Group play encourages sharing and communication." },
    ],
    faqs: [
      { q: "How long is a pre-school session?", a: "30–45 minutes, designed around young attention spans." },
      { q: "Are the parts safe?", a: "All pre-school kits use large, non-toxic, choke-safe parts." },
      { q: "Can parents join?", a: "Yes, parent-and-child sessions are available for ages 3–4." },
      { q: "Is there any screen time?", a: "No. The pre-school program is completely screen-free." },
    ],
  },
  {
    slug: "stem",
    name: "STEM Education",
    short: "Discover science, technology, engineering and maths through practical experiences.",
    tagline: "Experiment, observe, invent",
    intro:
      "Our STEM program connects classroom concepts to the real world. Kids run experiments, build machines, measure results and present findings — learning physics, chemistry and engineering by doing.",
    image: img.programStem,
    color: "mint",
    ageGroups: [
      { label: "Curious Minds", range: "7–9 yrs", focus: "Observation and simple experiments" },
      { label: "Young Scientists", range: "9–12 yrs", focus: "Hypotheses, data and machines" },
      { label: "Innovators", range: "12–15 yrs", focus: "Design thinking and prototyping" },
    ],
    outcomes: ["Use the scientific method", "Record and analyse data", "Apply maths to real problems", "Design and test prototypes", "Explain scientific concepts", "Work safely in a lab"],
    curriculum: [
      { level: "Physics in Action", topics: ["Forces & motion", "Simple machines", "Energy"] },
      { level: "Chemistry Fun", topics: ["Reactions", "Mixtures", "Crystals"] },
      { level: "Engineering Design", topics: ["Bridges", "Catapults", "Solar cars"] },
      { level: "Maths in the World", topics: ["Measurement", "Patterns", "Graphs"] },
    ],
    activities: ["Science fair prep", "Egg-drop challenge", "Solar car race", "Kitchen chemistry"],
    projects: ["Solar car", "Catapult", "Water filter", "Hydraulic arm", "Weather station"],
    benefits: [
      { title: "Concept clarity", text: "Abstract textbook ideas become tangible experiences." },
      { title: "Inquiry mindset", text: "Kids learn to ask good questions and test answers." },
      { title: "Better grades", text: "Hands-on learning reinforces school science and maths." },
      { title: "Innovation", text: "Design challenges encourage original solutions." },
    ],
    faqs: [
      { q: "Does this follow the school syllabus?", a: "It complements CBSE, ICSE and state boards with hands-on extensions." },
      { q: "Are experiments safe at home?", a: "Home activities use safe, household materials with clear guidance." },
      { q: "What age is best to start?", a: "Seven and above is ideal for structured STEM experiments." },
      { q: "Do kids work in groups?", a: "Yes, most projects are done in small teams." },
    ],
  },
  {
    slug: "artificial-intelligence",
    name: "AI & Machine Learning",
    short: "Teach machines to see, hear and decide — responsibly.",
    tagline: "Understand and build the technology of tomorrow",
    intro:
      "Students learn how AI works under the hood: training data, models and predictions. They build face detection, voice assistants and smart cameras, while discussing fairness and responsible AI.",
    image: img.programAi,
    color: "violet",
    ageGroups: [
      { label: "AI Explorers", range: "10–12 yrs", focus: "What AI is and how it learns" },
      { label: "Model Makers", range: "12–14 yrs", focus: "Training classifiers with no-code tools" },
      { label: "AI Builders", range: "14–16 yrs", focus: "Python, computer vision and projects" },
    ],
    outcomes: ["Explain how AI learns from data", "Train image and sound classifiers", "Build computer vision apps", "Evaluate model accuracy", "Discuss AI ethics", "Present an AI capstone project"],
    curriculum: [
      { level: "AI Fundamentals", topics: ["What is AI?", "Data & patterns", "AI around us"] },
      { level: "Machine Learning Basics", topics: ["Training & testing", "Classification", "Accuracy"] },
      { level: "Computer Vision", topics: ["Face detection", "Colour tracking", "Object recognition"] },
      { level: "AI Projects", topics: ["Voice assistant", "Smart camera", "Chatbot"] },
    ],
    activities: ["Train-a-model labs", "AI ethics debates", "Teachable-machine challenges", "Demo days"],
    projects: ["Face detection", "Emotion recogniser", "Voice assistant", "Rock-paper-scissors AI", "Smart attendance"],
    benefits: [
      { title: "Demystifies AI", text: "Kids become creators, not just consumers, of AI." },
      { title: "Data literacy", text: "Understand how data shapes decisions." },
      { title: "Ethical thinking", text: "Discuss fairness, privacy and responsible use." },
      { title: "Career edge", text: "An early head start in a fast-growing field." },
    ],
    faqs: [
      { q: "Is this too advanced for kids?", a: "We start with visual, no-code tools and introduce Python gradually." },
      { q: "Does my child need maths skills?", a: "Basic arithmetic is enough to begin. Concepts are taught visually." },
      { q: "Which tools are used?", a: "Browser-based ML tools, BixCode AI blocks and Python." },
      { q: "Is a webcam required?", a: "A webcam is helpful for computer vision projects but not mandatory." },
    ],
  },
];

export const programBySlug = (slug: string) => PROGRAMS.find((p) => p.slug === slug);
