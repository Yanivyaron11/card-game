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
    {
        id: 'panda',
        emoji: '🐼',
        name: { en: 'PanPan', he: 'פן-פן' },
        price: 0,
        category: 'free',
        skins: [
            { id: 'poppins', name: { en: 'Mary Poppins Panda', he: 'פנדה מארי פופינס' }, image: '/assets/avatars/panda/poppins.png', price: 200 },
            { id: 'rainbow', name: { en: 'Rainbow Panda', he: 'פנדה קשת בענן' }, image: '/assets/avatars/panda/rainbow.png', price: 300 },
            { id: 'flamenco', name: { en: 'Flamenco Panda', he: 'פנדה פלמנקו' }, image: '/assets/avatars/panda/flamenco.png', price: 400 }
        ]
    },
    {
        id: 'penguin',
        emoji: '🐧',
        name: { en: 'Pingu', he: 'פינגו' },
        price: 0,
        category: 'free',
        skins: [
            { id: 'soccer', name: { en: 'Soccer Pingu', he: 'פינגו כדורגלן' }, image: '/assets/avatars/penguin/soccer.png', price: 200 },
            { id: 'tennis', name: { en: 'Tennis Pingu', he: 'פינגו טניסאי' }, image: '/assets/avatars/penguin/tennis.png', price: 300 },
            { id: 'basketball', name: { en: 'Basketball Pingu', he: 'פינגו כדורסלן' }, image: '/assets/avatars/penguin/basketball.png', price: 400 }
        ]
    },

    // Premium (100-450)
    {
        id: 'monkey',
        emoji: '🐵',
        name: { en: 'Bobo', he: 'בובו' },
        price: 100,
        category: 'premium',
        skins: [
            { id: 'hipster', name: { en: 'Hipster Bobo', he: 'בובו היפסטר' }, image: '/assets/avatars/monkey/hipster.png', price: 200 },
            { id: 'barista', name: { en: 'Barista Bobo', he: 'בובו בריסטה' }, image: '/assets/avatars/monkey/barista.png', price: 300 },
            { id: 'businessman', name: { en: 'Businessman Bobo', he: 'בובו איש עסקים' }, image: '/assets/avatars/monkey/businessman.png', price: 500 }
        ]
    },
    {
        id: 'owl',
        emoji: '🦉',
        name: { en: 'Professor', he: 'פרופסור' },
        price: 250,
        category: 'premium',
        skins: [
            { id: 'university', name: { en: 'University Prof', he: 'פרופסור באוניברסיטה' }, image: '/assets/avatars/owl/university.png', price: 250 },
            { id: 'researcher', name: { en: 'Researcher Prof', he: 'חוקר' }, image: '/assets/avatars/owl/researcher.png', price: 350 },
            { id: 'inventor', name: { en: 'Friendly Inventor', he: 'ממציא ידידותי' }, image: '/assets/avatars/owl/inventor.png', price: 500 }
        ]
    },
    {
        id: 'kitty',
        emoji: '🐱',
        name: { en: 'Mitzi', he: 'מיצי' },
        price: 250,
        category: 'premium',
        skins: [
            { id: 'painter', name: { en: 'Painter Mitzi', he: 'מיצי ציירת' }, image: '/assets/avatars/kitty/painter.png', price: 300 },
            { id: 'paris', name: { en: 'Mitzi in Paris', he: 'מיצי בפריז' }, image: '/assets/avatars/kitty/paris.png', price: 400 },
            { id: 'singer', name: { en: 'Singer Mitzi', he: 'מיצי זמרת' }, image: '/assets/avatars/kitty/singer.png', price: 500 }
        ]
    },
    {
        id: 'robot',
        emoji: '🤖',
        name: { en: 'Robo', he: 'רובו' },
        price: 400,
        category: 'premium',
        skins: [
            { id: 'delivery', name: { en: 'Delivery Robo', he: 'רובו שליח' }, image: '/assets/avatars/robot/delivery.png', price: 400 },
            { id: 'hoverboard', name: { en: 'Hoverboard Robo', he: 'רובו סקייטבורד מרחף' }, image: '/assets/avatars/robot/hoverboard.png', price: 500 },
            { id: 'chef', name: { en: 'Chef Robo', he: 'רובו שף' }, image: '/assets/avatars/robot/chef.png', price: 600 }
        ]
    },
    { id: 'alien', emoji: '👽', name: { en: 'Zork', he: 'זורק' }, price: 450, category: 'premium' },

    // Legendary (500-1000)
    { id: 'unicorn', emoji: '🦄', name: { en: 'Luca', he: 'לוקה' }, price: 500, category: 'legendary' },
    { id: 'dog', emoji: '🐶', name: { en: 'Lulu', he: 'לולו' }, price: 550, category: 'legendary' },
    { id: 'dragon', emoji: '🐲', name: { en: 'Draco', he: 'דרקו' }, price: 750, category: 'legendary' },
    { id: 'wizard', emoji: '🧙', name: { en: 'Merlin', he: 'מרלין' }, price: 950, category: 'legendary' },
    { id: 'ghost', emoji: '👻', name: { en: 'Spooky', he: 'ספוקי' }, price: 1000, category: 'legendary' }
];
