/* THE VERIFICATION DESK · proving it is real.
   Six exhibits on provenance, watermarking and the question every scheme
   defers: who says so. A counter, a queue, and cameras that watch the
   people proving they are people. See CONTRIBUTING.md. */
ROOM("verify", {
  name: "The Verification Desk",
  color: "#8fe8ae",
  map: [
    "####A######B####",
    "#..............#",
    "#..............#",
    "C..............#",
    "#..............#",
    "#..............#",
    "#..............#",
    "#..............#",
    "#..............D",
    "#..............#",
    "#..............#",
    "####E######F####",
  ],
  floors: [
    "################",
    "#tttttttttttttt#",
    "#tttttttttttttt#",
    "#tttttttttttttt#",
    "#tttttttttttttt#",
    "#tttttttttttttt#",
    "#tttttttttttttt#",
    "#tttttttttttttt#",
    "#tttttttttttttt#",
    "#tttttttttttttt#",
    "#tttttttttttttt#",
    "################",
  ],
  floorKey: { t: "tile" },
  props: [
    [2, 2, "idbooth"],
    [9, 2, "idbooth"],
    [3, 5, "queuebarrier"],
    [9, 5, "queuebarrier"],
    [1, 8, "scanner"],
    [13, 8, "scanner"],
    [7, 8, "chairrow"],
    [1, 10, "plant"],
    [13, 10, "bin"],
    [6, 10, "magtable"],
  ],
  wall: [
    [7, 0, "cctv"],
    [2, 11, "cctv"],
    [12, 11, "screen"],
  ],
  exhibits: {
    A: {
      t: "Please State That You Are Human",
      obj: "A distorted word behind wire. Two of the letters are arguing.",
      body: [
        "For twenty years the web asked visitors to prove their species by reading warped text, then by naming traffic lights. Every test was a task humans found easy and machines found hard, and each one had a shelf life measured by how fast the machines improved.",
        "The tests are now largely decided by how your mouse moved and what your browser knows about you, which is to say the question changed from what can you do into who are you. The museum keeps the old one because it was at least answerable in public.",
      ],
      q: "“Select all squares containing a bus.” · The internet, 2014 to whenever",
    },
    B: {
      t: "Content Credentials",
      obj: "A photograph with a small pin in the corner, holding a certificate to it.",
      body: [
        "The response to synthetic media was not a detector but a signature. Content Credentials attach a signed record to an image at the moment of capture, saying which camera made it, and every edit after that adds a line. It is provenance, borrowed from the food industry and the art trade.",
        "The weakness is honest and admitted: an absent credential proves nothing, because most real photographs have none. Provenance can only ever say this is what happened to this file. Whether anyone checks is a question about institutions, not cryptography.",
      ],
      url: "https://contentcredentials.org/",
      cta: "INSPECT A CREDENTIAL",
    },
    C: {
      t: "The Watermark",
      obj: "A page that says nothing unusual, tilted to the light.",
      body: [
        "Model makers began marking their output, some visibly, some by biasing word choice in a way a detector can recover and a reader cannot see. It works well enough on text nobody has edited, and degrades quickly on text a person has rewritten, which is most text worth arguing about.",
        "The museum files the watermark under mitigations rather than solutions. It raises the cost of undetected generation at scale, which is genuinely useful, and it will never settle a single dispute about a single document.",
      ],
      url: "https://en.wikipedia.org/wiki/Digital_watermarking",
      cta: "READ THE HISTORY",
    },
    D: {
      t: "The Last Photograph Nobody Doubted",
      obj: "An empty frame, dated. The curators cannot agree on the date.",
      body: [
        "Somewhere in the last decade the default assumption about a striking image flipped from probably real to possibly made. No single picture caused it and no date can be given, which is why this frame is empty. The shift is the exhibit.",
        "Photographs were never proof, as anyone who worked in the darkroom on the High Street will tell you. What changed is the cost: faking an image well used to take a skilled person a day, and now it takes anyone eight seconds. Most institutions built for the old price have not repriced.",
      ],
      url: "https://www.whichfaceisreal.com/",
      cta: "TEST YOURSELF",
    },
    E: {
      t: "Chain of Custody",
      obj: "An evidence bag, signed across the seal by four people in turn.",
      body: [
        "Courts and laboratories solved this problem a century ago, without cryptography, by making every person who touched a thing sign for it. The chain is only as good as its weakest signature, everyone knows this, and it has held up surprisingly well.",
        "The interesting question the desk leaves you with is not technical. It is why the institutions that demand a chain of custody for a blood sample accept a screenshot for almost everything else.",
      ],
      q: "“Signed, in turn, by everyone who could have altered it.” · Standard evidence procedure",
    },
    F: {
      t: "Who Says So",
      obj: "A rubber stamp, worn. It reads CERTIFIED, and nothing about by whom.",
      body: [
        "Every verification scheme eventually rests on somebody you decided to trust: a certificate authority, a camera maker, a standards body, a government. The cryptography is the easy part and it is the only part usually discussed.",
        "This is the same structure as the Rotunda upstairs, where the labs write the tests they then sit. The museum’s position is stated plainly on the wall in both rooms. A verification system without an answer to who says so is a machine for moving trust somewhere less visible.",
      ],
      url: "https://c2pa.org/",
      cta: "READ THE STANDARD",
    },
  }
});
