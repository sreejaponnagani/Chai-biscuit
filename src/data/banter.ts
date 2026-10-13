export interface BanterQuote {
  text: string;
  speaker: string;
  mood: 'angry' | 'funny' | 'proud' | 'warn';
}

export const MISSED_BISCUIT_ROASTS: BanterQuote[] = [
  {
    text: "Baigan me miladiya! Seedha haath me biscuit nahi pakadte kya miyan?!",
    speaker: "Ustaad Nimrah",
    mood: "angry",
  },
  {
    text: "Arey miyan, dhyan kidhar hai? Osmania biscuit seedha zameen pe chala gaya!",
    speaker: "Chotu Chaiwala",
    mood: "funny",
  },
  {
    text: "Kaiku re itna jaldi biscuit gira diya? Charminar ke kabootar bhi hasre tere pe!",
    speaker: "Saleem Pheku",
    mood: "funny",
  },
  {
    text: "Light le lo ustaad! Doosra biscuit aara, abki baar zameen pe mat giraao!",
    speaker: "Irani Ustaad Abdul",
    mood: "warn",
  },
  {
    text: "Ustaad, biscuit chai me doobne se pehle hi fanaah hogaya! Tauba tauba!",
    speaker: "Aunty from Banjara Hills",
    mood: "funny",
  },
  {
    text: "Miyan haath me butter laga hai kya? Biscuit slip karke nikal gaya!",
    speaker: "Software Anna",
    mood: "funny",
  },
  {
    text: "Pottey itne nakhre kare to Nimrah Cafe se nikaal dete dekh lo!",
    speaker: "Old City Chacha",
    mood: "angry",
  },
  {
    text: "Khaali peeli biscuit zameen pe daalre... Nizam sahab ka dil dukh raha upar se!",
    speaker: "Nizami Historian",
    mood: "funny",
  },
];

export const CAUGHT_CHILLI_ROASTS: BanterQuote[] = [
  {
    text: "Arey tauba tauba! Chai me mirchi kaun dalta miyan?! Zaban jal gayi!",
    speaker: "Irani Ustaad Abdul",
    mood: "angry",
  },
  {
    text: "Khaali peeli Guntur mirchi pakad liye! Ye Osmania biscuit dikhra kya tumko?!",
    speaker: "Chotu Chaiwala",
    mood: "angry",
  },
  {
    text: "Baigan ka kismat! Chai ke bajaye thecha banadiye tum to!",
    speaker: "Saleem Pheku",
    mood: "funny",
  },
  {
    text: "Arey ustaad, dimaag ki biryani mat banao, mirchi chhod ke biscuit pakdo!",
    speaker: "Software Anna",
    mood: "warn",
  },
];

export const CHAI_MISTAKE_ROASTS: BanterQuote[] = [
  {
    text: "Arey ustaad, samovar phutne laga! Gas dheemi karo, poori dukan udaoge kya?!",
    speaker: "Chotu Chaiwala",
    mood: "angry",
  },
  {
    text: "Ye kya kadak paani banaye? Customer bolra 'is se acha to Tank Bund ka paani peelu'!",
    speaker: "Saleem Pheku",
    mood: "funny",
  },
  {
    text: "Chai thandi kardiye miyan! Hyderabad me thandi chai pilaoge to jail bhejenge!",
    speaker: "Ustaad Nimrah",
    mood: "angry",
  },
  {
    text: "Malai daalne me itni kanjoosi? Nizam sahab ke dawat me aaye kya hum?",
    speaker: "Old City Chacha",
    mood: "funny",
  },
];

export const STREAK_PRAISE: BanterQuote[] = [
  {
    text: "Ek number ustaad! Nizam sahab bhi khush hoke jagir de dete!",
    speaker: "Nizami Connoisseur",
    mood: "proud",
  },
  {
    text: "Kirrak speed miyan! Seedha Charminar ke ustaad ban gaye tum!",
    speaker: "Saleem Pheku",
    mood: "proud",
  },
  {
    text: "Kya kadak joda hai... Chai aur Osmania! Public fidaa hogayi!",
    speaker: "Ustaad Nimrah",
    mood: "proud",
  },
  {
    text: "Ustaad ki setting zabardast hai! Golconda tak dhoom machgayi!",
    speaker: "Software Anna",
    mood: "proud",
  },
  {
    text: "Ufff! Malai Rush chalu hogaya! Ab dekho coins ki baarish!",
    speaker: "Chotu Chaiwala",
    mood: "proud",
  },
];

export const CUSTOMER_PROFILES = [
  {
    id: 'saleem',
    name: 'Saleem Pheku',
    title: 'Old City Legend',
    avatarEmoji: '😎',
    dialogue: 'Ustaad ek kadak chai dalo, kal Dubai se Sheikh aare mere paas!',
    patienceSpeed: 1.2,
    orderType: 'KADAK_CHAI' as const,
    points: 40,
    coins: 15,
  },
  {
    id: 'chotu',
    name: 'Chotu',
    title: 'Rapid Delivery Boy',
    avatarEmoji: '🏃‍♂️',
    dialogue: 'Bhaiyya table number 4 pe 2 cut chai jaldi!',
    patienceSpeed: 1.6,
    orderType: 'CUT_CHAI' as const,
    points: 25,
    coins: 10,
  },
  {
    id: 'software_anna',
    name: 'Software Anna',
    title: 'HITEC City Coder',
    avatarEmoji: '💻',
    dialogue: 'Bhai production bug aaya hai, extra malai chai do dimag chalega!',
    patienceSpeed: 1.1,
    orderType: 'MALAI_CHAI' as const,
    points: 60,
    coins: 25,
  },
  {
    id: 'nizami_uncle',
    name: 'Mirza Sahab',
    title: 'Chowmahalla Connoisseur',
    avatarEmoji: '👑',
    dialogue: 'Barkhurdar, Zafran ki khushboo aani chahiye har ghoont me!',
    patienceSpeed: 0.9,
    orderType: 'SPECIAL_ZAFRAN' as const,
    points: 90,
    coins: 40,
  },
  {
    id: 'aunty',
    name: 'Begum Sahiba',
    title: 'Banjara Hills Foodie',
    avatarEmoji: '🧕',
    dialogue: 'Chai me shakkar theek rakhna, diet pe hu lekin Nimrah biscuit zaroor khana!',
    patienceSpeed: 1.3,
    orderType: 'CUT_CHAI' as const,
    points: 35,
    coins: 12,
  },
];
