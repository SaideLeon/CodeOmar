export type Veo3PromptData = {
  emoji: string;
  nameEn: string;
  namePt: string;
  functionEn: string;
  emotion: string;
  action: string;
  environment: string;
  visualDetails: string;
  particles: string;
  motion: string;
  voiceOver: string;
};

const VEO3_STYLE_LINE =
  'ultra-cute 3D cartoon style, Pixar-style proportions, big expressive eyes, rounded shapes, vibrant colors, smooth animation, cinematic lighting, shallow depth of field, kid-friendly, satisfying motion, vertical 9:16, high detail, soft shadows';

const normalizeKey = (value: string) =>
  value
    .trim()
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/\s+/g, ' ');

const VEO3_PROMPT_LIBRARY: Record<string, Veo3PromptData> = {
  coracao: {
    emoji: '❤️',
    nameEn: 'Heart',
    namePt: 'Coração',
    functionEn: 'BLOOD CIRCULATION',
    emotion: 'warm',
    action: 'gently pumping glowing red waves',
    environment: 'a cozy, glowing bloodstream chamber',
    visualDetails: 'Tiny red cells float by as the heart shows a healthy rhythm meter',
    particles: 'Soft red sparkles and golden pulses radiate outward',
    motion: 'The character beats steadily with a caring, confident expression',
    voiceOver: 'Olá, eu sou Coração. Eu bombeio sangue.',
  },
  heart: {
    emoji: '❤️',
    nameEn: 'Heart',
    namePt: 'Coração',
    functionEn: 'BLOOD CIRCULATION',
    emotion: 'warm',
    action: 'gently pumping glowing red waves',
    environment: 'a cozy, glowing bloodstream chamber',
    visualDetails: 'Tiny red cells float by as the heart shows a healthy rhythm meter',
    particles: 'Soft red sparkles and golden pulses radiate outward',
    motion: 'The character beats steadily with a caring, confident expression',
    voiceOver: 'Olá, eu sou Coração. Eu bombeio sangue.',
  },
  pulmoes: {
    emoji: '🫁',
    nameEn: 'Lungs',
    namePt: 'Pulmões',
    functionEn: 'OXYGEN BREATHING',
    emotion: 'calm',
    action: 'expanding and contracting with fresh air',
    environment: 'a clean breathing chamber filled with soft clouds',
    visualDetails: 'Blue and white oxygen ribbons flow in as gray smoke fades out',
    particles: 'Light blue bubbles and misty glow swirl gently',
    motion: 'They breathe in sync with a peaceful, happy vibe',
    voiceOver: 'Olá, somos os Pulmões. Trazemos ar fresquinho.',
  },
  lungs: {
    emoji: '🫁',
    nameEn: 'Lungs',
    namePt: 'Pulmões',
    functionEn: 'OXYGEN BREATHING',
    emotion: 'calm',
    action: 'expanding and contracting with fresh air',
    environment: 'a clean breathing chamber filled with soft clouds',
    visualDetails: 'Blue and white oxygen ribbons flow in as gray smoke fades out',
    particles: 'Light blue bubbles and misty glow swirl gently',
    motion: 'They breathe in sync with a peaceful, happy vibe',
    voiceOver: 'Olá, somos os Pulmões. Trazemos ar fresquinho.',
  },
  figado: {
    emoji: '🫀',
    nameEn: 'Liver',
    namePt: 'Fígado',
    functionEn: 'DETOXIFICATION',
    emotion: 'proud',
    action: 'filtering dark particles into clean golden drops',
    environment: 'a friendly filtration lab with glowing pipes',
    visualDetails: 'The liver waves a tiny filter wand over cloudy bubbles',
    particles: 'Golden sparkles replace the dark mist',
    motion: 'It works steadily like a helpful hero',
    voiceOver: 'Olá, eu sou Fígado. Eu limpo coisas ruins.',
  },
  liver: {
    emoji: '🫀',
    nameEn: 'Liver',
    namePt: 'Fígado',
    functionEn: 'DETOXIFICATION',
    emotion: 'proud',
    action: 'filtering dark particles into clean golden drops',
    environment: 'a friendly filtration lab with glowing pipes',
    visualDetails: 'The liver waves a tiny filter wand over cloudy bubbles',
    particles: 'Golden sparkles replace the dark mist',
    motion: 'It works steadily like a helpful hero',
    voiceOver: 'Olá, eu sou Fígado. Eu limpo coisas ruins.',
  },
  banana: {
    emoji: '🍌',
    nameEn: 'Banana',
    namePt: 'Banana',
    functionEn: 'ENERGY BOOST',
    emotion: 'energetic',
    action: 'running on a tiny treadmill',
    environment: 'a bright tropical jungle with palm trees',
    visualDetails: 'The banana flexes tiny arms with a playful strength pose',
    particles: 'Yellow lightning bolts and energy sparkles trail behind',
    motion: 'Fast, bouncy movement with a joyful grin',
    voiceOver: 'Olá, eu sou Banana. Eu dou energia.',
  },
  morango: {
    emoji: '🍓',
    nameEn: 'Strawberry',
    namePt: 'Morango',
    functionEn: 'VITAMIN C',
    emotion: 'happy',
    action: 'holding a glowing vitamin shield',
    environment: 'a sunny berry garden with tiny flowers',
    visualDetails: 'The strawberry shows shiny seeds and rosy cheeks',
    particles: 'Golden sparkles and soft pink glow float around',
    motion: 'It bounces lightly, feeling strong and safe',
    voiceOver: 'Olá, eu sou Morango. Eu protejo você.',
  },
  strawberry: {
    emoji: '🍓',
    nameEn: 'Strawberry',
    namePt: 'Morango',
    functionEn: 'VITAMIN C',
    emotion: 'happy',
    action: 'holding a glowing vitamin shield',
    environment: 'a sunny berry garden with tiny flowers',
    visualDetails: 'The strawberry shows shiny seeds and rosy cheeks',
    particles: 'Golden sparkles and soft pink glow float around',
    motion: 'It bounces lightly, feeling strong and safe',
    voiceOver: 'Olá, eu sou Morango. Eu protejo você.',
  },
  agua: {
    emoji: '💧',
    nameEn: 'Water',
    namePt: 'Água',
    functionEn: 'HYDRATION',
    emotion: 'refreshing',
    action: 'sliding down a sparkling water slide',
    environment: 'a blue ocean wave tunnel',
    visualDetails: 'The droplet shines with crystal-clear highlights',
    particles: 'Cool blue bubbles and light reflections dance around',
    motion: 'It splashes playfully, creating ripples of energy',
    voiceOver: 'Olá, eu sou Água. Eu hidrato você.',
  },
  water: {
    emoji: '💧',
    nameEn: 'Water',
    namePt: 'Água',
    functionEn: 'HYDRATION',
    emotion: 'refreshing',
    action: 'sliding down a sparkling water slide',
    environment: 'a blue ocean wave tunnel',
    visualDetails: 'The droplet shines with crystal-clear highlights',
    particles: 'Cool blue bubbles and light reflections dance around',
    motion: 'It splashes playfully, creating ripples of energy',
    voiceOver: 'Olá, eu sou Água. Eu hidrato você.',
  },
};

const toTitleCase = (value: string) =>
  value
    .trim()
    .split(' ')
    .filter(Boolean)
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1).toLowerCase())
    .join(' ');

export const generateVeo3Prompt = (rawInput: string) => {
  const normalized = normalizeKey(rawInput);
  const known = VEO3_PROMPT_LIBRARY[normalized];

  const base: Veo3PromptData =
    known || {
      emoji: '✨',
      nameEn: toTitleCase(rawInput) || 'Item',
      namePt: toTitleCase(rawInput) || 'Item',
      functionEn: 'EDUCATIONAL HIGHLIGHT',
      emotion: 'friendly',
      action: 'showing its main purpose with a gentle gesture',
      environment: 'a cheerful learning space that matches the theme',
      visualDetails: 'Colorful details reflect its natural features and role',
      particles: 'Soft glowing particles match its main color palette',
      motion: 'Smooth, inviting motion with a bright, safe vibe',
      voiceOver: `Olá, eu sou ${toTitleCase(rawInput) || 'Item'}. Eu ensino algo legal.`,
    };

  const nameUpper = base.nameEn.toUpperCase();

  return [
    `${base.emoji} ${nameUpper} - ${base.functionEn}`,
    '',
    `A cute anthropomorphic ${base.nameEn.toLowerCase()} character with big expressive eyes and a ${base.emotion} smile, ${base.action} inside ${base.environment}. ${base.visualDetails}. ${base.particles}. ${base.motion}.`,
    '',
    'Voice-over (Portuguese audio):',
    `"${base.voiceOver}"`,
    '',
    VEO3_STYLE_LINE,
  ].join('\n');
};
