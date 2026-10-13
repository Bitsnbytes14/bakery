export interface Choice {
  label: string;
  reaction: string;
}

export interface ChoiceQuestion {
  kind: 'choice';
  topic: string;
  prompt: string;
  choices: Choice[];
}

export interface RatingQuestion {
  kind: 'rating';
  topic: string;
  prompt: string;
  /** Messages shown, in order, each time the visitor tries to drag below the floor. */
  protests: string[];
  floor: number;
  accepted: string;
  forced: string;
}

export interface OpenQuestion {
  kind: 'open';
  topic: string;
  prompt: string;
  placeholder: string;
  submitReaction: string;
  skipReaction: string;
}

export type Question = ChoiceQuestion | RatingQuestion | OpenQuestion;

const duck = 'The court is concerned you answered this so quickly.';

export const QUESTIONS: Question[] = [
  {
    kind: 'choice', topic: 'Terrain', prompt: 'Mountains or beaches?',
    choices: [
      { label: 'Mountains', reaction: "Respect. You climb for hours just to say 'nice view' and leave." },
      { label: 'Beaches', reaction: 'Sand will be found in your bag for the next six months. Bold.' },
    ],
  },
  {
    kind: 'choice', topic: 'Hours', prompt: 'Morning person or night owl?',
    choices: [
      { label: 'Morning person', reaction: 'The court finds this deeply suspicious.' },
      { label: 'Night owl', reaction: 'Noted. This website was also built at 2am.' },
    ],
  },
  {
    kind: 'choice', topic: 'Beverage', prompt: 'Chai or coffee?',
    choices: [
      { label: 'Chai', reaction: 'Correct answer. Moving on.' },
      { label: 'Coffee', reaction: 'The court will allow it, reluctantly.' },
    ],
  },
  {
    kind: 'choice', topic: 'Messaging', prompt: 'Voice notes or texts?',
    choices: [
      { label: 'Voice notes', reaction: "A four minute voice note is not a message. It's a podcast." },
      { label: 'Texts', reaction: 'Efficient. The court appreciates your respect for its time.' },
    ],
  },
  {
    kind: 'choice', topic: 'Superpower', prompt: 'Superpower: teleportation or invisibility?',
    choices: [
      { label: 'Teleportation', reaction: "No more traffic, no more 'just 5 minutes away' lies. Strong choice." },
      { label: 'Invisibility', reaction: 'The court will not ask follow up questions.' },
    ],
  },
  {
    kind: 'choice', topic: 'Duck dilemma', prompt: 'Fight one horse sized duck or 100 duck sized horses?',
    choices: [
      { label: 'One horse sized duck', reaction: duck },
      { label: '100 duck sized horses', reaction: duck },
    ],
  },
  {
    kind: 'choice', topic: 'Pizza policy', prompt: 'Pineapple on pizza?',
    choices: [
      { label: 'Yes', reaction: 'Objection noted. Overruled. Also noted.' },
      { label: 'No', reaction: 'Finally, someone with standards.' },
    ],
  },
  {
    kind: 'choice', topic: 'Screen time', prompt: 'Comfort rewatch or something new?',
    choices: [
      { label: 'Comfort rewatch', reaction: 'Watching the same show for the ninth time is self care.' },
      { label: 'Something new', reaction: "Brave. Three episodes in and you'll go back to the rewatch." },
    ],
  },
  {
    kind: 'choice', topic: 'Late night', prompt: 'Maggi at 2am or a proper meal?',
    choices: [
      { label: 'Maggi at 2am', reaction: 'Two minutes they promised. Twelve minutes it took. Every time.' },
      { label: 'A proper meal', reaction: 'Your mother would be proud. The court is too.' },
    ],
  },
  {
    kind: 'choice', topic: 'Seating', prompt: 'Window seat or aisle?',
    choices: [
      { label: 'Window', reaction: 'You will need the washroom exactly once, and you will climb over two strangers to get there.' },
      { label: 'Aisle', reaction: 'Practical. Also the person who gets hit by the trolley.' },
    ],
  },
  {
    kind: 'choice', topic: 'Reply speed', prompt: 'Reply speed: instant or "seen" for 3 hours?',
    choices: [
      { label: 'Instant', reaction: 'The court thanks you for your service.' },
      { label: 'Seen for 3 hours', reaction: 'The court has also been left on seen. The court understands.' },
    ],
  },
  {
    kind: 'choice', topic: 'Palate', prompt: 'Sweet or savoury?',
    choices: [
      { label: 'Sweet', reaction: 'The court recalls a strict dessert splitting policy.' },
      { label: 'Savoury', reaction: 'A person of refined taste. The court is taking notes.' },
    ],
  },
  {
    kind: 'rating', topic: "Defendant's creativity", prompt: "Rate the defendant's creativity, 1 to 10.",
    floor: 7,
    protests: ['Are you sure?', 'Reconsider.', 'The defendant has a family.', 'This will go on his permanent record.'],
    accepted: 'The court accepts this generous assessment.',
    forced: 'Fine. Recorded.',
  },
  {
    kind: 'open', topic: 'For the defendant', prompt: 'Any questions for the defendant?',
    placeholder: 'Optional. Leave blank to skip.',
    submitReaction: 'Entered into the record. The defendant will respond in due course, or never.',
    skipReaction: 'The witness has no further questions.',
  },
];

/** Number of numbered questions before the final card. */
export const NUMBERED = QUESTIONS.length - 1;
