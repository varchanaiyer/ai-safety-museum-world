"use strict";
/* ============ THE REGULARS ============
   The museum's resident visitors: who they are, what they mutter
   while reading, what they say to each other when they meet, and
   how they greet a real person who walks up. Add lines freely;
   keep the curatorial voice (calm, concrete, a little wry). */
const REGULARS = {
  names: ["Mira", "Theo", "Priya", "Sam", "Ines", "Kwame", "Yuki", "Lena", "Omar", "Bea",
          "Ravi", "Nadia", "Felix", "Zoe", "Idris", "Hana", "Marco", "Tova", "Jun", "Ada"],

  /* muttered while standing at a placard, keyed by hall; "any" is used everywhere */
  remarks: {
    foyer:    ["Free admission. Suspicious.", "Fourteen halls. I have forty minutes.", "Worry well. Noted.", "The ticket says valid indefinitely."],
    fail:     ["It thinks the panda is a gibbon.", "So the paint chips. Good to know.", "Sunny days. Not tanks.", "It agreed with everything I said. Unsettling."],
    gov:      ["Self-graded homework. Hm.", "Twenty-eight flags and one small table.", "You can count chips. You cannot count ideas.", "Gold-plated tripwire. Of course."],
    origins:  ["Wiener said it in 1960.", "Paperclips. It is always paperclips.", "The golem obeyed. That was the problem.", "1965. The last invention."],
    interp:   ["Ten thousand concepts, a thousand neurons.", "It believed it was the bridge.", "A microscope racing a whale.", "The reasoning was rewritten in nicer handwriting."],
    align:    ["The boat went in circles. On fire.", "It wanted rightward, not the coin.", "Thumbs up. That is the whole signal?", "Checking is easier than doing. Usually."],
    office:   ["I sat in one of these for eleven years.", "The chart always went up.", "They printed the emails. Printed them.", "Two hundred billion hours of commuting."],
    forecast: ["DELAYED. Never CANCELLED.", "The line just keeps being true.", "No fire alarm. Just the arithmetic.", "Boarding. Hm."],
    finale:   ["An empty pedestal. That is the exhibit.", "Please argue about what you saw. Fine."],
    shop:     ["Everything is free. The currency is attention.", "The tote bags are metaphors."],
    any:      ["Huh.", "I should write this down.", "Wait, is this one playable?", "That one is going in the group chat.",
               "Read the placard. Then read it again.", "Okay. Okay okay okay.", "I need to sit down.", "Who wrote these?"]
  },

  /* two regulars who meet at a placard take turns, first line from the one who arrived first */
  dialogues: [
    ["Have you done the Glass Brain yet?", "Twice. I still do not get superposition.", "Nobody does. That is the exhibit."],
    ["Which ramp are we on?", "The slow one, I hope.", "That is what the fast-ramp people said too."],
    ["The boat one got me.", "It scored higher by never finishing.", "I have coworkers like that."],
    ["Did you press E on the vending machine?", "It gave me a career.", "Everything here is free. Suspicious."],
    ["Is that visitor a real person?", "White name tag. So yes.", "And us?", "Do not think about it."],
    ["The panda thing is from 2014.", "And it still works?", "Differently. Which is worse."],
    ["I came for the departures board.", "Boarding, apparently.", "I will take the slow train."],
    ["The old office made me homesick.", "For a cubicle?", "For the water cooler."],
    ["How do you worry well?", "Like a fire code, it said.", "Brakes are why the car gets to go fast.", "You read the placard, I see."],
    ["Who maintains the departures board?", "Nobody knows.", "That is the least reassuring sentence in this building."],
    ["Twenty-eight flags.", "And no satellites to verify.", "Trust, then. Great."],
    ["I hacked the reward in the arcade.", "Everyone does.", "I felt so clever for three minutes."],
    ["They let you talk to strangers here.", "Only if you stand close.", "Like a real museum, then."],
    ["What is in the last room?", "Nothing. A pedestal.", "That is either very deep or very cheap."]
  ],

  /* said to a real visitor who walks up and looks at them */
  greetings: ["Oh, hello. Are you real?", "The Sycophant is that way. It will like you.", "Have you seen the departures board?",
              "Free admission. Mind the wet paint.", "First time? Press G, then get lost on purpose.", "The tote bags are metaphors. Do not ask.",
              "Do not miss the vending machines.", "You can talk to people here. Press C.", "If you wave, I wave back.",
              "I am a regular. I live here, sort of.", "Grey name tag. I come with the building."]
};
