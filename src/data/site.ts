import { img } from "@/lib/images";

export const CONTACT = {
  phone: "+91 98765 43210",
  email: "hello@learningbix.example",
  address: "Innovation Hub, 2nd Floor, Sector 18, Gurugram, Haryana 122015",
  hours: "Mon–Sat, 9:30 AM – 6:30 PM",
};

export const STATS = [
  { value: 50000, suffix: "+", label: "Kits Delivered" },
  { value: 1000, suffix: "+", label: "Schools" },
  { value: 1000000, suffix: "+", label: "Students" },
  { value: 20000, suffix: "+", label: "Teachers Trained" },
];

export const SKILLS = [
  { title: "Critical Thinking", text: "Question, analyse and evaluate ideas with confidence." },
  { title: "Logical Reasoning", text: "Build step-by-step solutions to tricky problems." },
  { title: "Creativity", text: "Turn imagination into working models and games." },
  { title: "Problem Solving", text: "Debug, iterate and never give up on a challenge." },
  { title: "Analytical Skills", text: "Measure, compare and learn from results." },
  { title: "Innovation", text: "Invent new ways to make everyday life better." },
];

export const EXPERIENCE = [
  { step: "Facilitate", text: "Expert mentors set up a safe, curious learning space." },
  { step: "Logic-ify", text: "Concepts are broken into logical, bite-sized steps." },
  { step: "Create", text: "Kids build real models, circuits and programs." },
  { step: "Gamify", text: "Challenges, badges and leaderboards keep energy high." },
  { step: "Explore", text: "Students experiment beyond the instructions." },
  { step: "Innovate", text: "Capstone projects solve real-world problems." },
];

export const WHY_ROBOTICS = [
  { title: "Hands-on learning", text: "Concepts stick when kids build them with their own hands." },
  { title: "Future-ready skills", text: "Robotics blends coding, electronics and design." },
  { title: "Logical thinking", text: "Programming robots trains structured thinking." },
  { title: "Creativity", text: "Every robot is a canvas for new ideas." },
  { title: "Teamwork", text: "Builds are planned and shipped together." },
  { title: "Confidence", text: "Seeing your robot move is pure magic." },
];

export const WHY_CHOOSE = [
  { title: "Expert Mentors", text: "Trained educators with engineering backgrounds." },
  { title: "Practical Learning", text: "70% building, 30% explaining — every class." },
  { title: "Innovative Curriculum", text: "Mapped to NEP 2020 and global STEM standards." },
  { title: "Real-world Projects", text: "Solve problems kids see around them." },
  { title: "Interactive Learning", text: "Small batches, live feedback, no passive watching." },
  { title: "Future-focused Education", text: "Robotics, AI, IoT and beyond." },
];

export const GALLERY = [
  { title: "Obstacle-avoiding Rover", category: "Robotics", image: img.programRobotics },
  { title: "Face Detection Camera", category: "AI", image: img.programAi },
  { title: "Platformer Game", category: "Coding", image: img.programCoding },
  { title: "Hydraulic Excavator", category: "STEM", image: img.projectExcavator },
  { title: "Smart Racer Circuit", category: "Electronics", image: img.productAccelero },
  { title: "Solar Car Race", category: "STEM", image: img.programStem },
  { title: "Robot Team Build", category: "Robotics", image: img.heroKidsRobotics },
  { title: "Forklift Automation", category: "Electronics", image: img.projectForklift },
];

export const TESTIMONIALS = [
  { name: "Priya Sharma", role: "Parent of Aarav, 9", type: "Parent", rating: 5, text: "Aarav used to spend hours on cartoons. Now he spends them building robots and explaining sensors to us at dinner!" },
  { name: "Ishaan Verma", role: "Student, 13", type: "Student", rating: 5, text: "I built a face-detection camera for my science fair and won first prize. The mentors made AI feel easy." },
  { name: "Dr. Meera Iyer", role: "Principal, Greenfield Public School", type: "School", rating: 5, text: "The innovation lab transformed how our students approach problems. Teacher training was excellent." },
  { name: "Rahul Gupta", role: "Parent of Anaya, 7", type: "Parent", rating: 4, text: "Small batches and patient mentors. Anaya looks forward to every Saturday class." },
  { name: "Sana Khan", role: "Student, 11", type: "Student", rating: 5, text: "Scratch was fun but making my own Python game was the best thing ever." },
];

export const PARTNERS = [
  "Greenfield Public School",
  "Sunrise International",
  "Delhi Valley Academy",
  "St. Mary's Convent",
  "Bluebells School",
  "Modern Heritage School",
  "Riverdale High",
  "Little Scholars",
];

export const TEAM = [
  { name: "Ananya Rao", role: "Founder & CEO", bio: "Robotics engineer turned educator on a mission to make every child an inventor." },
  { name: "Vikram Mehta", role: "Head of Curriculum", bio: "15 years designing STEM programs for schools across India." },
  { name: "Neha Kapoor", role: "Director, School Partnerships", bio: "Helps schools set up world-class innovation labs." },
  { name: "Arjun Nair", role: "Lead, AI Programs", bio: "Machine learning researcher who loves teaching kids to build smart apps." },
];

export const TIMELINE = [
  { year: "2016", title: "The first workshop", text: "A weekend robotics club with 12 kids in a garage." },
  { year: "2018", title: "First school labs", text: "Innovation labs launched in 25 partner schools." },
  { year: "2020", title: "Live online classes", text: "Kits delivered home, classes went live nationwide." },
  { year: "2022", title: "BixCode launched", text: "Our block + text coding platform for robotics and AI." },
  { year: "2024", title: "1,000 schools", text: "Crossed 1,000 partner schools and 20,000 trained teachers." },
  { year: "2026", title: "Franchise network", text: "LearningBIX centres open in cities across India." },
];

export const LEARNING_CENTER_CATEGORIES = ["Robotics", "Electronics", "DIY STEM", "Coding", "Science Experiments", "IoT"] as const;

export type LearningProject = {
  slug: string;
  title: string;
  category: (typeof LEARNING_CENTER_CATEGORIES)[number];
  difficulty: "Easy" | "Medium" | "Hard";
  time: string;
  image: string;
  gallery: string[];
  intro: string;
  objectives: string[];
  materials: string[];
  outcomes: string[];
  steps: { title: string; text: string }[];
  video: string;
};

const sampleVideo = "https://storage.googleapis.com/gtv-videos-bucket/sample/ForBiggerJoyrides.mp4";

export const LEARNING_PROJECTS: LearningProject[] = [
  {
    slug: "excavator",
    title: "Hydraulic Excavator",
    category: "DIY STEM",
    difficulty: "Medium",
    time: "2 hours",
    image: img.projectExcavator,
    gallery: [img.projectExcavator, img.productMachines, img.programStem],
    intro: "Build an excavator arm powered by water-filled syringes and discover how hydraulics multiply force.",
    objectives: ["Understand Pascal's principle", "Build a multi-joint arm", "Control movement with fluid pressure"],
    materials: ["Cardboard or building kit parts", "4 plastic syringes", "Plastic tubing", "Water with food colour", "Glue and tape"],
    outcomes: ["Explain hydraulic systems", "Relate force and area", "Plan a mechanical build"],
    steps: [
      { title: "Build the base", text: "Create a sturdy base and rotating platform for the arm." },
      { title: "Assemble the arm", text: "Join the boom, stick and bucket with hinged joints." },
      { title: "Add hydraulics", text: "Fill syringes with coloured water and connect pairs with tubing." },
      { title: "Test and tune", text: "Push the control syringes and adjust joints until the bucket scoops smoothly." },
    ],
    video: sampleVideo,
  },
  {
    slug: "crane",
    title: "Tower Crane",
    category: "Robotics",
    difficulty: "Medium",
    time: "90 minutes",
    image: img.productMachines,
    gallery: [img.productMachines, img.programRobotics],
    intro: "Construct a tower crane with a pulley and winch to lift small loads.",
    objectives: ["Explore pulleys and counterweights", "Understand stability", "Use a winch mechanism"],
    materials: ["Building kit beams", "String", "Pulley wheel", "Small motor (optional)", "Counterweight"],
    outcomes: ["Explain mechanical advantage", "Balance loads", "Troubleshoot structures"],
    steps: [
      { title: "Tower", text: "Build a braced vertical tower using triangles for strength." },
      { title: "Jib", text: "Attach the horizontal jib and counter-jib." },
      { title: "Pulley & winch", text: "Thread string through the pulley to a hand or motor winch." },
      { title: "Lift test", text: "Lift increasing weights and adjust the counterweight." },
    ],
    video: sampleVideo,
  },
  {
    slug: "ball-shooter",
    title: "Ball Shooter",
    category: "Robotics",
    difficulty: "Hard",
    time: "2.5 hours",
    image: img.productSpaceRover,
    gallery: [img.productSpaceRover, img.programRobotics],
    intro: "A motorised flywheel launcher that shoots soft balls at targets.",
    objectives: ["Understand rotational energy", "Wire a DC motor", "Aim and calibrate"],
    materials: ["2 DC motors", "Wheels", "Battery box", "Switch", "Foam balls", "Chassis parts"],
    outcomes: ["Apply energy transfer", "Build safe circuits", "Measure range vs speed"],
    steps: [
      { title: "Chassis", text: "Build a frame that holds two wheels side by side." },
      { title: "Flywheels", text: "Mount motors so wheels spin in opposite directions." },
      { title: "Circuit", text: "Connect motors to the battery box through a switch." },
      { title: "Launch", text: "Feed balls between the wheels and record distances." },
    ],
    video: sampleVideo,
  },
  {
    slug: "forklift",
    title: "Motorised Forklift",
    category: "Electronics",
    difficulty: "Medium",
    time: "2 hours",
    image: img.projectForklift,
    gallery: [img.projectForklift, img.productMachines],
    intro: "Build a forklift with a motor-driven lifting mast.",
    objectives: ["Convert rotary to linear motion", "Use a gear train", "Control with a switch"],
    materials: ["Building kit parts", "Geared motor", "Chain or string", "Battery box", "Switch"],
    outcomes: ["Explain gear ratios", "Wire a reversing switch", "Design lifting mechanisms"],
    steps: [
      { title: "Body", text: "Assemble the forklift body with four wheels." },
      { title: "Mast", text: "Build vertical rails and a sliding carriage." },
      { title: "Drive", text: "Link the motor to the carriage with chain or string." },
      { title: "Load test", text: "Lift a small pallet and adjust speed." },
    ],
    video: sampleVideo,
  },
  {
    slug: "catapult",
    title: "Popsicle Catapult",
    category: "Science Experiments",
    difficulty: "Easy",
    time: "45 minutes",
    image: img.projectCatapult,
    gallery: [img.projectCatapult, img.programStem],
    intro: "A classic lever experiment: build a catapult and measure how far it launches.",
    objectives: ["Understand levers", "Measure distance", "Change one variable at a time"],
    materials: ["10 popsicle sticks", "Rubber bands", "Bottle cap", "Glue", "Small soft ball", "Measuring tape"],
    outcomes: ["Explain potential and kinetic energy", "Record data in a table", "Draw conclusions"],
    steps: [
      { title: "Stack", text: "Bind a stack of sticks as the fulcrum." },
      { title: "Lever arm", text: "Join two sticks at one end and insert the stack between them." },
      { title: "Cup", text: "Glue a bottle cap to the top of the arm." },
      { title: "Experiment", text: "Launch and measure — then change the fulcrum position and compare." },
    ],
    video: sampleVideo,
  },
  {
    slug: "dumping-truck",
    title: "Dumping Truck",
    category: "DIY STEM",
    difficulty: "Easy",
    time: "1 hour",
    image: img.projectTruck,
    gallery: [img.projectTruck, img.productMachines],
    intro: "A tipping dump truck that teaches hinges and levers.",
    objectives: ["Use hinges", "Explore levers", "Build a vehicle chassis"],
    materials: ["Building kit parts", "Wheels and axles", "Hinge pieces", "Crank handle"],
    outcomes: ["Explain how hinges work", "Build rolling vehicles", "Improve designs after testing"],
    steps: [
      { title: "Chassis", text: "Build the base with axles and wheels." },
      { title: "Cab", text: "Add the driver cab at the front." },
      { title: "Tipper", text: "Attach the bed with a hinge at the back." },
      { title: "Crank", text: "Add a crank lever to tilt the bed." },
    ],
    video: sampleVideo,
  },
  {
    slug: "road-roller",
    title: "Road Roller",
    category: "DIY STEM",
    difficulty: "Easy",
    time: "1 hour",
    image: img.projectTruck,
    gallery: [img.projectTruck],
    intro: "Build a road roller with a big front drum and learn about pressure and weight.",
    objectives: ["Understand pressure", "Build a steering mechanism", "Explore weight distribution"],
    materials: ["Building kit parts", "Cylinder drum", "Wheels", "Steering parts"],
    outcomes: ["Relate weight and pressure", "Build steering linkages", "Test on different surfaces"],
    steps: [
      { title: "Drum", text: "Assemble the front roller drum on an axle." },
      { title: "Frame", text: "Build the frame and rear wheels." },
      { title: "Steering", text: "Attach a pivot so the drum can steer." },
      { title: "Test", text: "Roll over clay and compare impressions with different weights." },
    ],
    video: sampleVideo,
  },
  {
    slug: "smart-light",
    title: "Smart Night Light",
    category: "IoT",
    difficulty: "Medium",
    time: "1.5 hours",
    image: img.programStem,
    gallery: [img.programStem, img.productAccelero],
    intro: "An LED light that switches on automatically when the room gets dark.",
    objectives: ["Use a light sensor (LDR)", "Program a threshold", "Build a safe circuit"],
    materials: ["Microcontroller board", "LDR sensor", "LED", "Resistors", "Breadboard", "Jumper wires"],
    outcomes: ["Read sensor values", "Write if/else logic", "Understand automation"],
    steps: [
      { title: "Wire the sensor", text: "Connect the LDR as a voltage divider." },
      { title: "Add the LED", text: "Connect the LED with a resistor to an output pin." },
      { title: "Code", text: "In BixCode, turn the LED on when light is below a threshold." },
      { title: "Calibrate", text: "Cover the sensor and tune the threshold." },
    ],
    video: sampleVideo,
  },
  {
    slug: "maze-game",
    title: "Maze Escape Game",
    category: "Coding",
    difficulty: "Easy",
    time: "1 hour",
    image: img.programCoding,
    gallery: [img.programCoding],
    intro: "Code a maze game where a character escapes using arrow keys.",
    objectives: ["Handle keyboard events", "Detect collisions", "Track a score"],
    materials: ["Laptop with browser", "BixCode or Scratch"],
    outcomes: ["Use events and conditions", "Design a level", "Debug game logic"],
    steps: [
      { title: "Draw the maze", text: "Create a maze backdrop with one wall colour." },
      { title: "Move the player", text: "Use arrow-key events to move the sprite." },
      { title: "Walls", text: "Bounce back when touching the wall colour." },
      { title: "Win", text: "Show a win message when reaching the exit." },
    ],
    video: sampleVideo,
  },
];

export const projectBySlug = (slug: string) => LEARNING_PROJECTS.find((p) => p.slug === slug);
