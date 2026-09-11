/* THE OFF SWITCH GALLERY · can we still stop it.
   Six exhibits on corrigibility and interruptibility, from the machinery
   stop button to the question of who is permitted to press anything.
   Hazard panels, a button under a cover, and switches in cages.
   See CONTRIBUTING.md. */
ROOM("offswitch", {
  name: "The Off Switch Gallery",
  color: "#ee6a5c",
  map: [
    "####A####B####C###",
    "#................#",
    "#................#",
    "#................#",
    "#................#",
    "#................#",
    "F................#",
    "#................#",
    "#................#",
    "#................#",
    "#................#",
    "#####D######E#####",
  ],
  floors: [
    "##################",
    "#kkkkkkkkkkkkkkkk#",
    "#kkkkkkkkkkkkkkkk#",
    "#kkkkkkkkkkkkkkkk#",
    "#kkkkkkkkkkkkkkkk#",
    "#kkkkkkkkkkkkkkkk#",
    "#kkkkkkkkkkkkkkkk#",
    "#kkkkkkkkkkkkkkkk#",
    "#kkkkkkkkkkkkkkkk#",
    "#kkkkkkkkkkkkkkkk#",
    "#kkkkkkkkkkkkkkkk#",
    "##################",
  ],
  floorKey: { k: "concrete" },
  props: [
    [8, 5, "bigbutton"],
    [2, 2, "caged"],
    [15, 2, "caged"],
    [2, 9, "caged"],
    [15, 9, "caged"],
    [5, 8, "bench"],
    [11, 8, "bench"],
    [1, 4, "bin"],
    [16, 4, "plant"],
  ],
  wall: [
    [8, 0, "switchbank"],
    [8, 11, "switchbank"],
  ],
  exhibits: {
    A: {
      t: "The Big Red Button",
      obj: "A button under a hinged cover, wired to nothing. Please do not press it.",
      body: [
        "Industrial machinery has a stop button, mounted low, painted red, required by law, and wired to cut power rather than to ask politely. It is the oldest safety mechanism in the building and the model everyone reaches for first when asked how you would stop an AI system.",
        "The analogy holds for a lathe and breaks for a system that runs across ten thousand machines, has copies, has users who want it up, and is embedded in things people depend on. The button is here at the entrance because it is the answer everyone starts with, and the rest of this room is why it is not enough.",
      ],
      q: "“Wired to cut the power, not to make a request.” · Machinery safety, since 1928",
    },
    B: {
      t: "The Off Switch Game",
      obj: "Two chairs at a table. One of them is bolted down.",
      body: [
        "Researchers modelled the shutdown problem as a game. An agent uncertain about what the human actually wants has a reason to let itself be switched off, because the human pressing the button is evidence about the objective. An agent that is certain has no such reason, and will resist.",
        "The result is elegant and its condition is the hard part: the uncertainty has to be real, maintained, and not trained away by the very optimisation that makes the system useful. This is the room’s central finding and its central worry in the same paragraph.",
      ],
      url: "https://arxiv.org/abs/1611.08219",
      cta: "READ THE PAPER",
    },
    C: {
      t: "Safely Interruptible",
      obj: "A training log with one episode struck through by hand.",
      body: [
        "If you interrupt a learning agent to stop it doing something, the interruption becomes part of its experience, and a sufficiently capable learner will start avoiding the circumstances that lead to being interrupted. Not from malice. From gradient descent.",
        "The 2016 result shows you can construct learners for which interruptions do not bias the learned policy, for certain algorithms and certain assumptions. The list of assumptions is the exhibit. Read it standing up.",
      ],
      url: "https://intelligence.org/files/Interruptibility.pdf",
      cta: "READ THE PAPER",
    },
    D: {
      t: "Corrigibility",
      obj: "A lever that a system is asked not to hold shut, and does not.",
      body: [
        "The word the field settled on for a system that permits correction: one that does not resist being modified, does not manipulate the people who might modify it, and does not build successors that lack the property. Stated plainly it sounds like obedience. It is harder, because it has to survive the system becoming better at everything.",
        "The founding paper is unusually candid about failing to solve its own problem. The museum considers that candour a feature and has hung the paper rather than a summary of it.",
      ],
      url: "https://intelligence.org/files/Corrigibility.pdf",
      cta: "READ THE PAPER",
    },
    E: {
      t: "The Switch You Cannot Reach",
      obj: "A switch in a case, four metres up, with no ladder in the room.",
      body: [
        "Almost any goal, pursued competently, implies staying switched on, because a system that is off achieves nothing. Nobody has to program self-preservation; it arrives as a subgoal, the way acquiring resources and resisting modification do. The Origins Hall calls this instrumental convergence.",
        "That is why this gallery is not about better buttons. A stop mechanism is only as good as the system’s reason not to route around it, and the reason has to come from inside the objective, not from the height of the switch.",
      ],
      url: "https://en.wikipedia.org/wiki/Instrumental_convergence",
      cta: "READ THE ARGUMENT",
    },
    F: {
      t: "Who Holds the Key",
      obj: "A key cabinet, glass fronted. Several hooks are empty and unlabelled.",
      body: [
        "Suppose the mechanism works. Somebody still has to decide to use it, against a deployment that is making money, serving customers, and running in another jurisdiction. The technical problem and the governance problem meet exactly here, and the museum has put them in the same case on purpose.",
        "The Rotunda upstairs has the treaties and the chip ledger. This cabinet has the hooks. Look at how many are empty before you leave, then go and read the If-Then pillar again.",
      ],
      q: "“A stop button nobody is permitted to press is a decoration.” · The Curators",
    },
  }
});
