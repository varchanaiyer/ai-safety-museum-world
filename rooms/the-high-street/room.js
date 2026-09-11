/* THE HIGH STREET · the trades that changed, as a street you can walk.
   Eight shopfronts, a road between them, and the awkward fact that
   automation moves work more often than it deletes it. Shops are drawn as
   shopfront kiosks by scripts/tileset.cjs. See CONTRIBUTING.md. */
ROOM("highstreet", {
  name: "The High Street",
  color: "#e8b45a",
  map: [
    "####A#####B#####C#####D#######",
    "#............................#",
    "#............................#",
    "#............................#",
    "#............................#",
    "#............................#",
    "#............................#",
    "#######E#####F#####G#####H####",
  ],
  floors: [
    "##############################",
    "#pppppppppppppppppppppppppppp#",
    "#pppppppppppppppppppppppppppp#",
    "#rrrrrrrrrrrrrrrrrrrrrrrrrrrr#",
    "#rrrrrrrrrrrrrrrrrrrrrrrrrrrr#",
    "#pppppppppppppppppppppppppppp#",
    "#pppppppppppppppppppppppppppp#",
    "##############################",
  ],
  floorKey: { p: "pavement", r: "road" },
  props: [
    [3, 1, "lamppost"],
    [10, 1, "lamppost"],
    [17, 1, "lamppost"],
    [24, 1, "lamppost"],
    [1, 1, "planter"],
    [13, 1, "bin"],
    [27, 1, "phonebox"],
    [23, 1, "bench"],
    [2, 6, "postbox"],
    [7, 6, "tree"],
    [11, 6, "bench"],
    [14, 6, "busstop"],
    [20, 6, "tree"],
    [26, 6, "bin"],
    [5, 3, "car"],
    [18, 4, "car"],
    [9, 6, "lamppost"],
    [21, 6, "lamppost"],
  ],
  exhibits: {
    A: {
      t: "The Video Store",
      obj: "One VHS cassette, rewound. A sticker on the spine reads BE KIND, REWIND.",
      body: [
        "Two thousand films on a wall, and a member of staff who had seen most of them. You browsed. You picked up boxes, read the back, put them down, and came home with something a person had recommended because they liked it, not because forty thousand people with your viewing history had.",
        "Blockbuster had nine thousand shops and turned down the chance to buy the company that replaced it. What replaced it was not a website. It was a recommender: a model that learned what you would finish. The shelf was small and someone stood beside it. The feed is infinite and nobody does.",
      ],
      q: "“The last Blockbuster is in Bend, Oregon. It is a tourist attraction.” · The Curators",
      url: "https://en.wikipedia.org/wiki/Netflix_Prize",
      cta: "THE PRIZE THAT STARTED IT",
    },
    B: {
      t: "The Travel Agent",
      obj: "A window card, hand-lettered: MALAGA · 7 NIGHTS · £189 · DEPARTS TUES.",
      body: [
        "To go somewhere you walked into a shop and described your life to a stranger, who consulted screens you could not see and knew which hotel was near the works. Brochures were free and enormous. The booking took forty minutes and involved carbon paper.",
        "Online booking removed the agent and gave you the screens. The knowledge did not vanish; it became a ranking, and the ranking is paid for. The question this shop leaves behind is not whether the agent was efficient. It is who the recommendation is now working for.",
      ],
      url: "https://en.wikipedia.org/wiki/Travel_agency",
      cta: "READ THE HISTORY",
    },
    C: {
      t: "The Photo Lab",
      obj: "A film canister, exposed. The label says 24 OF 24. Nobody remembers what is on it.",
      body: [
        "A roll held twenty-four pictures and you could not see any of them until a week later. You framed carefully because film cost money. Half the roll would be wrong, and one frame, by accident, would be the photograph of your life.",
        "Kodak invented the digital camera in 1975, shelved it, and filed for bankruptcy in 2012. The lesson the museum draws is not that they failed to see it coming. They saw it coming and could not bring themselves to compete with their own film. Every incumbent facing a capable model is standing in this shop.",
      ],
      url: "https://en.wikipedia.org/wiki/Kodak",
      cta: "READ THE HISTORY",
    },
    D: {
      t: "The Newsagent's",
      obj: "A rack of front pages, all showing the same morning.",
      body: [
        "Everyone in the street read one of six front pages, chosen by an editor who had to defend the choice in public and in person. You saw the headlines you did not buy on the way past. The disagreement was visible on a rack, at eye level, every morning.",
        "The feed gave every reader a private front page assembled by a model optimising for whether you kept scrolling. It is better at holding attention and worse at holding a shared morning. The Gallery of Failures upstairs calls this the thumb on the scale. Here it is just a rack of papers nobody buys.",
      ],
      url: "https://ncase.me/crowds/",
      cta: "PLAY THE MODEL",
    },
    E: {
      t: "The Secretarial Bureau",
      obj: "A carbon-paper sandwich: original, pink copy, yellow copy. Do not smudge.",
      body: [
        "A room of typists produced the organisation’s documents at ninety words a minute, with carbon paper for copies and correction fluid for errors. A mistake on the last line meant retyping the page. The job was skilled, gendered, and almost entirely erased by the word processor.",
        "The typing pool is the clearest case of an occupation dissolved by software rather than by robots: the work did not move elsewhere, it dispersed into everyone’s day. Every manager now types. That is what automation often looks like, not a machine in the corner but a task quietly handed back to you.",
      ],
      url: "https://en.wikipedia.org/wiki/Typing_pool",
      cta: "READ THE HISTORY",
    },
    F: {
      t: "The Telephone Exchange",
      obj: "A plugboard with one cable still connected, to a number that no longer rings.",
      body: [
        "To make a call you asked a person, and the person knew you. Operators connected the town by hand, listened by accident, and in emergencies knew which houses had children in them. At its height the work employed hundreds of thousands, almost all of them young women.",
        "Automatic exchanges took the job in stages across fifty years, slowly enough that few people were sacked and almost nobody was retrained. The switchboard is here as the museum’s reminder that the pace of an automation matters more than its scale. What is humane at fifty years is brutal at five.",
      ],
      url: "https://en.wikipedia.org/wiki/Switchboard_operator",
      cta: "READ THE HISTORY",
    },
    G: {
      t: "The Bank Branch",
      obj: "A paying-in slip, in triplicate, and the pen on its chain.",
      body: [
        "The cash machine was supposed to end the bank teller. It did not. Machines made branches cheaper to run, so banks opened more of them, and teller numbers in the United States rose for three decades after the first machine was installed. The job changed: less counting, more selling.",
        "Economists point at this counter whenever a forecast says a technology will simply remove a job. Then they point at the branch that closed last year. Both are true. The honest version is that automation moves work rather than deleting it, until the day the moving stops.",
      ],
      q: "“The task changed. The job survived. Then the branch closed.” · The Curators",
      url: "https://en.wikipedia.org/wiki/Bank_teller",
      cta: "READ THE HISTORY",
    },
    H: {
      t: "The Printer's",
      obj: "One line of hot metal type, mirror-written, still warm.",
      body: [
        "Words were set in lead, backwards, by compositors who read upside down and could spot a wrong font at arm’s length. The trade took seven years to learn and ended in about ten, when desktop publishing let anyone set a page badly for free.",
        "The printers of the period fought hard and lost. What is worth noticing is what happened to the standard: typesetting got worse, then better, and now a model will set your page for you. The skill did not die. It was compressed into defaults that almost nobody can see well enough to argue with.",
      ],
      url: "https://en.wikipedia.org/wiki/Desktop_publishing",
      cta: "READ THE HISTORY",
    },
  }
});
