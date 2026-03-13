export const avatars = [
    // Free Avatars
    {
        id: 'leo',
        emoji: '🦁',
        name: { en: 'Leo', he: 'ליאו' },
        price: 0,
        category: 'free',
        skins: [
            { id: 'special', name: { en: 'Brave Leo', he: 'ליאו האמיץ' }, image: '/assets/avatars/leo/default.png', price: 200 },
            { id: 'king', name: { en: 'King Leo', he: 'ליאו המלך' }, image: '/assets/avatars/leo/king.png', price: 350 },
            { id: 'superleo', name: { en: 'Super Leo', he: 'סופר ליאו' }, image: '/assets/avatars/leo/superhero.png', price: 500 }
        ]
    },
    {
        id: 'bunny',
        emoji: '🐰',
        name: { en: 'Bunny', he: 'באני' },
        price: 0,
        category: 'free',
        skins: [
            { id: 'hero', name: { en: 'Hero Bunny', he: 'באני הגיבורה' }, image: '/assets/avatars/bunny/hero.png', price: 250 },
            { id: 'london', name: { en: 'Bunny in London', he: 'באני בלונדון' }, image: '/assets/avatars/bunny/london.png', price: 300 },
            { id: 'queen', name: { en: 'Queen Bunny', he: 'באני המלכה' }, image: '/assets/avatars/bunny/queen.png', price: 450 }
        ]
    },
    {
        id: 'foxy',
        emoji: '🦊',
        name: { en: 'Foxy', he: 'פוקסי' },
        price: 0,
        category: 'free',
        skins: [
            { id: 'sweet', name: { en: 'Sweet Foxy', he: 'פוקסי המתוק' }, image: '/assets/avatars/foxy/default.png', price: 200 },
            { id: 'detective', name: { en: 'Detective Foxy', he: 'פוקסי הבלש' }, image: '/assets/avatars/foxy/detective.png', price: 300 },
            { id: 'dancer', name: { en: 'Dancer Foxy', he: 'פוקסי הרקדן' }, image: '/assets/avatars/foxy/dancer.png', price: 400 }
        ]
    },
    { id: 'panda', emoji: '🐼', name: { en: 'PanPan', he: 'פן-פן' }, price: 0, category: 'free' },
    { id: 'penguin', emoji: '🐧', name: { en: 'Pingu', he: 'פינגו' }, price: 0, category: 'free' },

    // Premium (100-450)
    { id: 'monkey', emoji: '🐵', name: { en: 'Bobo', he: 'בובו' }, price: 100, category: 'premium' },
    { id: 'owl', emoji: '🦉', name: { en: 'Professor', he: 'פרופסור' }, price: 250, category: 'premium' },
    { id: 'kitty', emoji: '🐱', name: { en: 'Kitty', he: 'מיצי' }, price: 250, category: 'premium' },
    { id: 'robot', emoji: '🤖', name: { en: 'Robo', he: 'רובו' }, price: 400, category: 'premium' },
    { id: 'alien', emoji: '👽', name: { en: 'Zork', he: 'זורק' }, price: 450, category: 'premium' },

    // Legendary (500-1000)
    { id: 'unicorn', emoji: '🦄', name: { en: 'Luca', he: 'לוקה' }, price: 500, category: 'legendary' },
    { id: 'dog', emoji: '🐶', name: { en: 'Lulu', he: 'לולו' }, price: 550, category: 'legendary' },
    { id: 'dragon', emoji: '🐲', name: { en: 'Draco', he: 'דרקו' }, price: 750, category: 'legendary' },
    { id: 'wizard', emoji: '🧙', name: { en: 'Merlin', he: 'מרלין' }, price: 950, category: 'legendary' },
    { id: 'ghost', emoji: '👻', name: { en: 'Spooky', he: 'ספוקי' }, price: 1000, category: 'legendary' }
];
