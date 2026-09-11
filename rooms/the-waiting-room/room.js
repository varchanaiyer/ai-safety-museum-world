/* THE WAITING ROOM · when things took time.
   Six exhibits about latency, and what the gap between asking and getting
   used to be for. Chairs in rows, a ticket machine, a display that counts
   up slower than you would like. See CONTRIBUTING.md. */
ROOM("waiting", {
  name: "The Waiting Room",
  color: "#7ec3e8",
  map: [
    "####A######B####",
    "#..............#",
    "#..............#",
    "#..............#",
    "C..............#",
    "#..............#",
    "#..............#",
    "#..............D",
    "#..............#",
    "#..............#",
    "####E######F####",
  ],
  floors: [
    "################",
    "#llllllllllllll#",
    "#llllllllllllll#",
    "#llllllllllllll#",
    "#llllllllllllll#",
    "#llllllllllllll#",
    "#llllllllllllll#",
    "#llllllllllllll#",
    "#llllllllllllll#",
    "#llllllllllllll#",
    "################",
  ],
  floorKey: { l: "lino" },
  props: [
    [1, 1, "ticketmachine"],
    [13, 1, "plant"],
    [2, 3, "chairrow"],
    [2, 5, "chairrow"],
    [2, 7, "chairrow"],
    [9, 3, "chairrow"],
    [9, 5, "chairrow"],
    [9, 9, "chairrow"],
    [7, 8, "magtable"],
    [13, 9, "bin"],
    [1, 9, "plant"],
  ],
  wall: [
    [7, 0, "nowserving"],
    [2, 10, "clock"],
  ],
  exhibits: {
    A: {
      t: "Take a Ticket",
      obj: "A ticket dispenser. You are number 62. The display says 47.",
      body: [
        "Waiting was a place. You took a paper number, sat in a row of chairs bolted to a rail, and watched a display advance at a rate nobody controlled. The wait was public, shared, and identical for everyone in the room, which is the only fair thing about a queue.",
        "The museum keeps the ticket machine because it is the last honest progress bar. It could not be gamed, it did not lie about how long was left, and it never told you it was almost done.",
      ],
      q: "“Your position in the queue: 62. Estimated wait: unknown.” · Every waiting room",
    },
    B: {
      t: "One Hour Photo",
      obj: "A paper wallet of prints. Twenty-four exposures, one of them a thumb.",
      body: [
        "One hour was the fast option. The normal option was a week, and the week contained something worth noticing: you had forgotten what was on the roll. Pictures arrived as a small surprise about your own recent life, and you kept the bad ones because you had paid for them.",
        "Instant capture removed the gap and generative models removed the need for the event. In this room the point is narrower. The delay was not friction to be eliminated. It was the interval in which anticipation happened, and nothing has been built to replace it.",
      ],
      url: "https://en.wikipedia.org/wiki/Minilab",
      cta: "READ THE HISTORY",
    },
    C: {
      t: "The Handshake",
      obj: "A modem, connecting. Forty-five seconds of noise, every time.",
      body: [
        "To reach the network you dialled it, and the machine screamed at another machine for the better part of a minute while you waited, unable to use the telephone. The sound is the most precisely dated noise of the twentieth century, and most people alive can still reproduce it.",
        "Latency taught a discipline that instant access dissolved: you decided what you wanted before you went to get it. This exhibit is on the museum’s slow side. It is worth asking what a system that answers in eight hundred milliseconds does to the habit of deciding first.",
      ],
      url: "https://en.wikipedia.org/wiki/Dial-up_Internet_access",
      cta: "READ THE HISTORY",
    },
    D: {
      t: "Transmission Report",
      obj: "A thermal slip: 1 PAGE · SENT · 4 MIN 12 SEC · OK.",
      body: [
        "A contract took four minutes to cross the world and arrived slightly crooked, which was accepted as the price of speed. The machine printed a receipt saying the pages had gone. That receipt was, for thirty years, what a legal agreement looked like in transit.",
        "The confirmation slip is the exhibit, not the fax. Nothing that moves a document now prints anything. Provenance, receipts, the ability to say this went from here to there at this time, all of that was thrown away for convenience and is being reinvented at the Verification Desk down the corridor.",
      ],
      url: "https://en.wikipedia.org/wiki/Fax",
      cta: "READ THE HISTORY",
    },
    E: {
      t: "The Second Post",
      obj: "An envelope, second class, franked Tuesday. It is Thursday.",
      body: [
        "A letter took three days and everyone planned around it. Arguments had a cooling period built into the infrastructure: by the time your reply arrived you had reread it, and by the time theirs came back they had calmed down. Whole institutions ran on this delay without ever naming it.",
        "Instant messaging removed the cooling period, and models that answer instantly removed the last of it. The old office next door filed its correspondence. This room asks whether the three days were a cost or a feature, and notes that nobody measured before removing them.",
      ],
      q: "“The post was slow, and so were the quarrels.” · The Curators",
    },
    F: {
      t: "The Progress Bar",
      obj: "A bar, ninety-nine per cent complete. It has been for some time.",
      body: [
        "When waiting moved inside the machine it stopped being honest. The progress bar was invented to make delay tolerable rather than legible, and it has been lying gently ever since. Designers found that a bar which speeds up at the end feels faster, so many of them do.",
        "A model that thinks for eleven seconds shows you a pulsing dot. You cannot tell whether it is working, stuck, or waiting on a queue in another country. The museum’s complaint is small and specific: the old ticket display told you the truth, and the new one is a mood.",
      ],
      q: "“The estimated time remaining was never an estimate.” · The Curators",
    },
  }
});
