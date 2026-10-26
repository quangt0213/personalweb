// Project cards for the Projects tab. Edit this list to add or change projects.
// type: "hardware" | "hackathon" | "software"  (controls color + filter)
// live: optional demo URL. Leave it out if there isn't one.
window.PROJECTS = [
  {
    title: "Card Scanner",
    type: "hardware",
    kind: "Embedded / Computer vision",
    blurb:
      "A physical trading-card appraiser. An ESP32-CAM photographs the card and sends it over Wi-Fi to a Raspberry Pi, which straightens the image, matches it by perceptual hash or OCR, and shows the market price on a touchscreen. Confident matches are cached, so repeat scans work offline.",
    stack: ["ESP32-CAM", "Raspberry Pi 4", "C/C++", "Python", "Flask", "OpenCV", "EasyOCR", "SQLite"],
    repo: "https://github.com/quangt0213/cardScanner",
  },
  {
    title: "RPM Gauge",
    type: "hardware",
    kind: "Embedded / Automotive",
    blurb:
      "Tachometer firmware modeled on a car ECU. An interrupt fires on every rising edge from a toothed wheel, and the main loop turns the tooth count into RPM once a second.",
    stack: ["C++", "ESP32", "Interrupts", "Signal conditioning"],
    repo: "https://github.com/quangt0213/RPM-Gauge",
  },
  {
    title: "MFGX AI",
    type: "hackathon",
    kind: "Xrise Hackathon 2026, team project",
    blurb:
      "A copilot for a factory shift supervisor. pandas computes OEE, scrap and downtime for 15 machines, then a local model through Ollama writes the morning briefing and answers questions from the plant's manuals, citing its sources.",
    stack: ["Python", "pandas", "Ollama", "ChromaDB"],
    repo: "https://github.com/hchaloyan/XRiseHackathon",
    live: "https://hchaloyan.github.io/XRiseHackathon/",
  },
  {
    title: "Verity",
    type: "hackathon",
    kind: "Hackathon / Full stack",
    blurb:
      "Community-powered local intelligence. Road closures, outages and events go on a map with the evidence behind each one and a status that describes that evidence, not a made-up confidence score.",
    stack: ["Node.js", "Supabase", "PostgreSQL", "MapLibre", "Railway"],
    repo: "https://github.com/quangt0213/Verity",
  },
  {
    title: "Power-Audit",
    type: "software",
    kind: "Power engineering / Dashboard",
    blurb:
      "A power-quality dashboard: live phasor diagram, waveform and harmonic analysis against the IEEE 519 limit, a capacitor-bank calculator for power-factor correction, and a printable audit report.",
    stack: ["JavaScript", "Chart.js", "Canvas"],
    repo: "https://github.com/quangt0213/Power-Audit",
  },
  {
    title: "Panda Scheduler",
    type: "software",
    kind: "Operations / Forecasting",
    blurb:
      "Scheduling and labor forecasting for the Panda Express I managed. A coverage heat map in 30-minute slots checks staffing against sales, enforces meal-break rules, and turns a sales forecast into hourly staffing.",
    stack: ["JavaScript", "Single-file app", "CSV/XLSX import"],
    repo: "https://github.com/quangt0213/Scheduler",
  },
  {
    title: "GS-Helper",
    type: "software",
    kind: "Game tools / Recommendation engine",
    blurb:
      "A team builder for the mobile game Grand Summoners. Mark the units you own, pick a boss, and get a scored four-unit team with the reasoning for every pick. Game data refreshes daily through GitHub Actions.",
    stack: ["JavaScript", "Node.js", "GitHub Actions"],
    repo: "https://github.com/quangt0213/GS-Helper",
    live: "https://quangt0213.github.io/GS-Helper/",
  },
  {
    title: "Orrery",
    type: "software",
    kind: "Simulation / Visualization",
    blurb:
      "An animated solar system in plain JavaScript. Moons orbit planets to any depth, every body opens a fact panel sourced from NASA, and a second star system, TRAPPIST-1, plugs in as its own module.",
    stack: ["JavaScript", "CSS", "No dependencies"],
    repo: "https://github.com/quangt0213/Orrery",
  },
];
