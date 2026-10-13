import { TREATS as T } from './treats';
import type { Treat } from './treats';

export type { Treat };

export interface Choice {
  label: string;
  emoji: string;
  reaction: string;
  treat: Treat;
}

/** A question with 2 to 4 options. */
export interface ChoiceItem {
  kind: 'choice';
  topic: string;
  icon: string;
  prompt: string;
  choices: Choice[];
}

export interface RatingItem {
  kind: 'rating';
  topic: string;
  icon: string;
  prompt: string;
  floor: number;
  /** Shown in order each time she tries to go below the floor. */
  protests: string[];
  accepted: string;
  perfect: string;
  forced: string;
  acceptedTreat: Treat;
  perfectTreat: Treat;
  forcedTreat: Treat;
}

export interface ChefItem {
  kind: 'chef';
  topic: string;
  icon: string;
  prompt: string;
  placeholder: string;
  submitReaction: string;
  skipReaction: string;
}

export type Item = ChoiceItem | RatingItem | ChefItem;

const choice = (topic: string, icon: string, prompt: string, choices: Choice[]): ChoiceItem => ({
  kind: 'choice', topic, icon, prompt, choices,
});

export const ITEMS: Item[] = [
  choice('Beverage', '🫖', 'Chai or coffee?', [
    { label: 'Chai', emoji: '☕', reaction: 'Correct answer. Moving on ✅', treat: T.chai },
    { label: 'Coffee', emoji: '☕', reaction: 'Allowed. Reluctantly. 😤', treat: T.coffee },
  ]),
  choice('Terrain', '🗻', 'Mountains or beaches?', [
    { label: 'Mountains', emoji: '🏔️', reaction: "You climb for hours just to say 'nice view' and leave. Respect.", treat: T.cookie },
    { label: 'Beaches', emoji: '🏖️', reaction: 'Sand will be found in your bag for six months. Bold 😌', treat: T.cupcake },
  ]),
  choice('Messaging', '📱', 'Voice notes or texts?', [
    { label: 'Voice notes', emoji: '🎙️', reaction: "A four minute voice note is not a message. It's a podcast 🎧", treat: T.donut },
    { label: 'Texts', emoji: '💬', reaction: 'Efficient. The kitchen appreciates it.', treat: T.kaju },
  ]),
  choice('Late night', '🌙', 'Maggi at 2am or a proper meal?', [
    { label: 'Maggi', emoji: '🍜', reaction: 'Two minutes they promised. Twelve minutes it took. Every time.', treat: T.croissant },
    { label: 'Proper meal', emoji: '🍛', reaction: 'Your mother would be proud. So would the chef 🥹', treat: T.cake },
  ]),
  choice('Toxic trait', '🧪', "What's your toxic trait?", [
    { label: "Saying 'I'm 5 min away' while still in bed", emoji: '🛏️', reaction: 'The chef has also been 5 minutes away since 2019.', treat: T.brownie },
    { label: 'Overthinking a text for 40 minutes', emoji: '📱', reaction: "And then sending 'ok'. Classic.", treat: T.cookie },
    { label: "Teasing people who can't fight back", emoji: '😈', reaction: 'Noted. Evidence is being collected.', treat: T.donut },
    { label: "I don't have one", emoji: '😇', reaction: 'Recorded as your toxic trait.', treat: T.sparkle },
  ]),
  choice('Villain origin', '🦹', 'Your villain origin story starts with:', [
    { label: 'Someone ate my last dessert', emoji: '🍰', reaction: 'Understandable. The kitchen is on your side.', treat: T.cake },
    { label: 'Slow walkers in front of me', emoji: '🚶', reaction: 'Justified. No jury would convict.', treat: T.croissant },
    { label: "Getting 'k' as a reply", emoji: '😐', reaction: 'The chef felt that one personally.', treat: T.choc },
    { label: 'WiFi dying at the best part', emoji: '📶', reaction: 'A tragedy in three acts.', treat: T.bell },
  ]),
  choice('Life movie', '🎬', 'If your life was a movie, it would be:', [
    { label: 'Bollywood drama with slow motion hair flips', emoji: '💃', reaction: 'Wind machine included, obviously.', treat: T.ribbon },
    { label: 'Horror: me opening my bank app', emoji: '💸', reaction: 'The scariest genre. Relatable.', treat: T.donut },
    { label: "Comedy where I'm the only one laughing", emoji: '😂', reaction: 'Honestly the best kind.', treat: T.cupcake },
    { label: 'A documentary nobody asked for', emoji: '🎥', reaction: 'Ten episodes. Narrated by you. Greenlit.', treat: T.kaju },
  ]),
  choice('Zombie plan', '🧟', 'Zombie apocalypse: how long do you survive?', [
    { label: 'Day 1, I go back for my charger', emoji: '🔌', reaction: 'Priorities. Respect.', treat: T.cookie },
    { label: "Till the end, I'm built different", emoji: '💪', reaction: 'Believable. Slightly concerning.', treat: T.brownie },
    { label: "I'm the one who says 'I'll be fine'", emoji: '🧟', reaction: 'You will not be fine. It will be iconic.', treat: T.sparkle },
  ]),
  choice('Useless skill', '🎪', 'Most useless skill you have?', [
    { label: 'Remembering lyrics but not exam answers', emoji: '🎵', reaction: 'The education system failed us both.', treat: T.kaju },
    { label: 'Falling asleep literally anywhere', emoji: '😴', reaction: "That's not useless. That's a superpower.", treat: T.coffee },
    { label: 'Winning arguments I started', emoji: '🗣️', reaction: "That's not useless. That's dangerous.", treat: T.choc },
    { label: 'Remembering what everyone ordered last time', emoji: '🍽️', reaction: 'Suspiciously chef like. Hired.', treat: T.brownie },
  ]),
  choice('Rage trigger', '😤', 'What makes you irrationally angry?', [
    { label: "People saying 'calm down'", emoji: '😡', reaction: 'The chef will never say it. The chef values his life.', treat: T.donut },
    { label: 'Food served cold that should be hot', emoji: '🥶', reaction: 'A crime. Apologies on behalf of all kitchens.', treat: T.croissant },
    { label: "'We need to talk' and then nothing", emoji: '😶', reaction: 'Psychological warfare. Agreed.', treat: T.kaju },
    { label: 'Bad nicknames', emoji: '🙄', reaction: 'Not taking this personally. (Has built an entire website about it.)', treat: T.cupcake },
  ]),
  choice('Emoji verdict', '🤳', "Your friends get one emoji to describe you. Which one are you scared they'd pick?", [
    { label: 'The skull', emoji: '💀', reaction: 'You laugh at everything, including your own problems.', treat: T.cookie },
    { label: 'The polite smile', emoji: '🙂', reaction: 'The polite smile that means you\'re furious. Terrifying.', treat: T.cake },
    { label: 'The melting face', emoji: '🫠', reaction: 'Holding it together. Technically.', treat: T.coffee },
    { label: 'The devil', emoji: '😈', reaction: 'The kitchen had suspicions. Now they\'re confirmed.', treat: T.choc },
  ]),
  choice('Signature item', '🏪', 'If you opened your own bakery, the signature item would be:', [
    { label: 'Brownies so good people forgive my attitude', emoji: '🍫', reaction: 'Business plan approved 📈', treat: T.brownie },
    { label: 'A dessert nobody has heard of', emoji: '🧪', reaction: 'Innovation. The chef respects it.', treat: T.sparkle },
    { label: 'Something baked at 3am and named after myself', emoji: '🧁', reaction: 'Limited edition. Suspicious hours of operation.', treat: T.cupcake },
    { label: 'Free desserts, but only for people I like', emoji: '😌', reaction: 'The chef will be submitting an application 📝', treat: T.ribbon },
  ]),
  choice('Wedding move', '🪩', 'Your go to dance move at a wedding:', [
    { label: 'Full choreography, I practiced', emoji: '💃', reaction: 'The chef will stand at the back pretending he also practiced.', treat: T.ribbon },
    { label: 'Naagin dance, zero shame', emoji: '🐍', reaction: 'A classic. The aunties approve.', treat: T.kaju },
    { label: 'The side to side shuffle, maximum confidence', emoji: '🕺', reaction: 'Low effort, high commitment. Respect.', treat: T.donut },
    { label: 'Only when the DJ plays my song', emoji: '🎶', reaction: 'The DJ has been warned.', treat: T.bell },
  ]),
  choice('Teasing record', '⚖️', 'How guilty are you of teasing your friends?', [
    { label: 'Completely innocent', emoji: '😇', reaction: 'The chef has reviewed the evidence. The chef disagrees.', treat: T.cookie },
    { label: 'I only speak facts', emoji: '📜', reaction: 'A very convenient excuse.', treat: T.cake },
    { label: 'They deserve it', emoji: '😌', reaction: 'The chef recommends legal representation ⚖️', treat: T.brownie },
    { label: 'I plead the fifth', emoji: '🤐', reaction: 'Silence has been entered into the record.', treat: T.croissant },
  ]),
  {
    kind: 'rating', topic: 'Creativity rating', icon: '⭐', prompt: "Rate the chef's creativity, 1 to 10.",
    floor: 7,
    protests: ['are you sure? 🥲', 'reconsider 🙏', 'the chef has a family 😭'],
    accepted: 'The chef accepts this generous review 🧁',
    perfect: 'Framing this. Hanging it in the kitchen 🖼️',
    forced: 'Fine. Recorded 😔',
    acceptedTreat: T.cupcake,
    perfectTreat: T.brownie,
    forcedTreat: T.cookie,
  },
  {
    kind: 'chef', topic: 'Question for the chef', icon: '🧑‍🍳', prompt: 'Any questions for the chef?',
    placeholder: 'Optional. Leave blank to skip.',
    submitReaction: 'Noted. The chef will pretend to be busy.',
    skipReaction: 'No questions. The chef is relieved.',
  },
];

export const TOTAL = ITEMS.length;
/** Numbered "Item n of N" questions; the optional chef question comes last and is not counted. */
export const NUMBERED = TOTAL - 1;

export const CUSTOMER = 'Miss Bully';
