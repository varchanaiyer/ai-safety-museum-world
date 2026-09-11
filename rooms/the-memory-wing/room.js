/* THE MEMORY WING · what we used to know by heart.
   Six exhibits on cognitive offloading, from the phone book to the model
   that composes the thought. Card catalogues, atlases, a globe, and two
   studies the curators find uncomfortable. See CONTRIBUTING.md. */
ROOM("memory", {
  name: "The Memory Wing",
  color: "#b48ce8",
  map: [
    "####A####B####C###",
    "#................#",
    "#................#",
    "#................#",
    "#................#",
    "F................#",
    "#................#",
    "#................#",
    "#................#",
    "#................#",
    "#................#",
    "#####D######E#####",
  ],
  floors: [
    "##################",
    "#qqqqqqqqqqqqqqqq#",
    "#qqqqqqqqqqqqqqqq#",
    "#qqqqqqqqqqqqqqqq#",
    "#qqqqqqqqqqqqqqqq#",
    "#qqqqqqqqqqqqqqqq#",
    "#qqqqqqqqqqqqqqqq#",
    "#qqqqqqqqqqqqqqqq#",
    "#qqqqqqqqqqqqqqqq#",
    "#qqqqqqqqqqqqqqqq#",
    "#qqqqqqqqqqqqqqqq#",
    "##################",
  ],
  floorKey: { q: "parquet" },
  props: [
    [2, 2, "cardcat"],
    [7, 2, "cardcat"],
    [12, 2, "cardcat"],
    [15, 1, "globe"],
    [3, 5, "atlastable"],
    [10, 5, "atlastable"],
    [1, 8, "phoneshelf"],
    [16, 8, "phoneshelf"],
    [6, 8, "bench"],
    [12, 8, "bench"],
    [1, 10, "plant"],
    [16, 10, "plant"],
    [8, 10, "bookshelf"],
  ],
  wall: [
    [8, 0, "bulletin"],
  ],
  exhibits: {
    A: {
      t: "The Telephone Directory",
      obj: "Two volumes, A to K and L to Z, four thousand pages, delivered free.",
      body: [
        "Every household received a book listing every household. You looked people up, and being unlisted was a decision you had to make in advance and pay for. The book was a public index of a whole town, printed annually, thrown away annually, and used as a booster seat in between.",
        "It is worth standing here and noticing what has changed. The directory was complete, public, and nobody could query it at scale. Everything about a person is now available, to whoever can afford the query, and to every model trained on the copy.",
      ],
      url: "https://en.wikipedia.org/wiki/Telephone_directory",
      cta: "READ THE HISTORY",
    },
    B: {
      t: "The Rolodex",
      obj: "A wheel of cards, one per person, worn soft at the letter S.",
      body: [
        "A career was a box of cards. You wrote a person on one, and moving jobs meant deciding, card by card, who came with you. The physical limit was the point: a few hundred people, each one chosen deliberately, in an order your hand knew.",
        "The contacts list has no limit, chooses for you, and is synchronised somewhere you cannot see. The museum notes without comment that the number of people we can actually maintain a relationship with has not changed since the rolodex, or since the cave.",
      ],
      url: "https://en.wikipedia.org/wiki/Rolodex",
      cta: "READ THE HISTORY",
    },
    C: {
      t: "The A to Z",
      obj: "A street atlas, spine broken at the page for home. Grid reference pencilled inside the cover.",
      body: [
        "Finding an address meant a book, an index, a grid square, and a conversation with someone who knew the way. You got lost regularly and built, slowly, a model of the city in your head that you could rotate and walk through.",
        "London taxi drivers who spent years learning the city by heart were found to have measurably larger posterior hippocampi than other drivers. Nobody has yet measured what the opposite process does. It is the only exhibit in this wing where the evidence points in a direction the curators find genuinely uncomfortable.",
      ],
      url: "https://pubmed.ncbi.nlm.nih.gov/10716738/",
      cta: "READ THE STUDY",
    },
    D: {
      t: "Things We Knew By Heart",
      obj: "A list, handwritten: seven telephone numbers, four birthdays, one recipe.",
      body: [
        "People carried twenty or thirty telephone numbers in their heads, along with the route to work, the spellings they had been drilled on, and the capitals of countries that no longer exist. Memory was a shared standard, and forgetting was embarrassing.",
        "Cognitive offloading is not new. Writing was accused of it, and so was the pocket calculator. What is new is the breadth: not a number or a sum but the whole act of composing a thought. This case is left open deliberately, because the curators do not agree about it either.",
      ],
      url: "https://pubmed.ncbi.nlm.nih.gov/21764755/",
      cta: "READ THE STUDY",
    },
    E: {
      t: "The Card Catalogue",
      obj: "One drawer, pulled out. The cards are in an order a person decided.",
      body: [
        "A library was searchable by hand because somebody had classified every item by subject, author, and title, and written it out three times. The catalogue was an opinion about how knowledge fits together, and you could see the opinion, drawer by drawer, and disagree with it.",
        "Search replaced the classification with a ranking, and the ranking is not visible. The Hall of Mirrors next door makes the same point about training data: every dataset is somebody’s view of what mattered enough to write down. This drawer is where that idea was invented.",
      ],
      q: "“Every catalogue is an argument about the world, filed alphabetically.” · The Curators",
    },
    F: {
      t: "The Answering Machine",
      obj: "A cassette, rewound, with three messages on it. Two are hang-ups.",
      body: [
        "Missing a call left a physical trace: a tape, a blinking light, a voice you could play again. The machine was a small archive of people who had wanted you that day, and erasing it was a deliberate act performed with a thumb.",
        "Voicemail became transcription, transcription became summary, and summary is now a model deciding which parts of a person’s message you need. Every step was an improvement and every step removed a little of the voice. The tape is here so the removal is visible.",
      ],
      url: "https://en.wikipedia.org/wiki/Answering_machine",
      cta: "READ THE HISTORY",
    },
  }
});
