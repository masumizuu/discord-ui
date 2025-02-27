import { v4 as uuidv4 } from "uuid";

// User Data
export const users = [
    {
        id: 1000,
        displayName: "wubba >:[",
        username: "kusoyaroucnn",
        picture: "/user.jpg",
        banner: "#d2b1a7",
        bio: "bry >:3",
        memberSince: "Mar 24, 2024",
        connections: [
            { category: '/conns/github.svg', name: 'masumizuu' },
            { category: '/conns/spotify.svg', name: 'cyan' },
            { category: '/conns/steam.svg', name: 'Masumizuu' },
        ],
        status: "do-not-disturb",
        friends: "friends",
    }, // wubba
    {
        id: 1001,
        displayName: "kdot",
        username: "breezus24",
        picture: "/friends/breezus.jpg",
        banner: "#6c6759",
        bio: "go to another acc",
        memberSince: "May 1, 2018",
        connections: [
            { category: "/conns/github.svg", name: "Bleu24" },
            { category: "/conns/spotify.svg", name: "McDoah" },
        ],
        status: "offline",
        friends: "friends",
    }, // kdot
    {
        id: 1002,
        displayName: "Jazzam | Real Deal",
        username: "jazzamashqy",
        picture: "/friends/jazzam.jpg",
        banner: "#6b4829",
        memberSince: "Aug 31, 2017",
        connections: [{ category: "/conns/steam.svg", name: "Jazzam" }],
        status: "offline",
        friends: "friends",
    }, // jazzam
    {
        id: 1003,
        displayName: "Calms",
        username: ".cocogoatie",
        picture: "/friends/calms.jpg",
        banner: "#000",
        memberSince: "Dec 9, 2017",
        status: "online",
        friends: "friends",
    }, // calms
    {
        id: 1004,
        displayName: "YamZ",
        username: "yamz_zam",
        picture: "/friends/yamz.jpg",
        banner: "#7f777f",
        memberSince: "Aug 19, 2020",
        connections: [
            { category: '/conns/spotify.svg', name: 'YamZ' },
        ],
        status: "offline",
        friends: "friends",
    }, // yamz
    {
        id: 1005,
        displayName: "Coco",
        username: "cocomelon1468",
        picture: "/friends/coco.jpg",
        banner: "#561510",
        memberSince: "Apr 2, 2021",
        status: "offline",
        friends: "friends",
    }, // coco
    {
        id: 1006,
        displayName: "eus",
        username: "sue_eus",
        picture: "/friends/eus.jpg",
        banner: "#a9a6ab",
        bio: "kwori <3",
        memberSince: "Jun 10, 2020",
        status: "offline",
        friends: "friends",
        connections: [
            { category: '/conns/steam.svg', name: 'Suwi?!' },
            { category: '/conns/spotify.svg', name: 'EUS' },
        ],
    }, // eus
    {
        id: 1007,
        displayName: "pernicious",
        username: "pernicious7633",
        picture: "/friends/pernicious.jpg",
        banner: "#fff",
        memberSince: "May 23, 2017",
        status: "offline",
        friends: "friends",
        connections: [
            { category: '/conns/steam.svg', name: "exali" },
        ],
    }, // pao
    {
        id: 1008,
        displayName: "adrien",
        username: "adrien7551",
        picture: "/friends/adrian.jpg",
        banner: "#bcc548",
        bio: "bruh",
        memberSince: "Mar 14, 2019",
        status: "away",
        friends: "friends",
    }, // adrian
    {
        id: 1009,
        displayName: "lev1",
        username: "lev14487",
        picture: "/friends/lev1.jpg",
        banner: "#e49d5d",
        bio: "Zzz",
        memberSince: "Sep 7, 2020",
        status: "offline",
        friends: "friends",
    }, // levi
    {
        id: 10010,
        displayName: "Chilimansi",
        username: ".chilimansi",
        picture: "/friends/chilimansi.jpg",
        banner: "#000",
        memberSince: "Aug 29, 2019",
        status: "offline",
        friends: "pending",
    }, // chilimansi
    {
        id: 10011,
        displayName: "bogart",
        username: "lamp9381",
        picture: "/friends/bogart.jpg",
        banner: "#000",
        bio: "https://www.youtube.com/watch?v=dQw4w9WgXcQ",
        memberSince: "May 22, 2017",
        status: "do-not-disturb",
        friends: "friends",
        connections: [
            { category: '/conns/steam.svg', name: "D" },
        ],
    }, // do
];

// initial server messages
export const serverMsgs = [
    // ascent messages
    {
        id: uuidv4(),
        from: "server",
        server: "ascent",
        channel: "general",
        timeSent: "1/02/25, 01:32 PM",
        sender: users[1],
        content: "good morning, baby!! <33",
    },
    {
        id: uuidv4(),
        from: "server",
        server: "ascent",
        channel: "general",
        timeSent: "1/02/25, 01:33 PM",
        sender: users[1],
        content: "good aftie pala HAHAAHAH",
    },
    {
        id: uuidv4(),
        from: "server",
        server: "ascent",
        channel: "general",
        timeSent: "1/02/25, 01:35 PM",
        sender: users[0],
        content: "GUMORNINGGGG",
    },
    {
        id: uuidv4(),
        from: "server",
        server: "ascent",
        channel: "general",
        timeSent: "1/02/25, 01:36 PM",
        sender: users[0],
        content: "inang sleep sched yan ;-;",
    },
    {
        id: uuidv4(),
        from: "server",
        server: "ascent",
        channel: "general",
        timeSent: "1/02/25, 01:39 PM",
        sender: users[0],
        content: "am still eepy :<",
    },
    {
        id: uuidv4(),
        from: "server",
        server: "ascent",
        channel: "general",
        timeSent: "1/02/25, 02:00 PM",
        sender: users[1],
        content: "really ninja?? WAKE UP HAHAAHHA",
    },
    // vitamins messages
    {
        id: uuidv4(),
        from: "server",
        server: "vitamins",
        channel: "matinong-usapan",
        timeSent: "10/27/24, 12:15 PM",
        sender: users[0],
        content: "hoy ung mga kagrupo ko sa alerto, nubalak nyo?",
    },
    {
        id: uuidv4(),
        from: "server",
        server: "vitamins",
        channel: "general",
        timeSent: "5/10/24, 10:04 PM",
        sender: users[4],
        content: "1v1 terraria",
    },
    {
        id: uuidv4(),
        from: "server",
        server: "vitamins",
        channel: "general",
        timeSent: "5/10/24, 10:10 PM",
        sender: users[5],
        content: "di ka mananalo bading",
    },
    {
        id: uuidv4(),
        from: "server",
        server: "vitamins",
        channel: "general",
        timeSent: "5/10/24, 10:16 PM",
        sender: users[7],
        content: "micko nasakin vape mo",
    },
    {
        id: uuidv4(),
        from: "server",
        server: "vitamins",
        channel: "general",
        timeSent: "5/10/24, 10:20 PM",
        sender: users[3],
        content: "akin yan e :(",
    },
    {
        id: uuidv4(),
        from: "server",
        server: "vitamins",
        channel: "comms",
        timeSent: "8/20/24, 10:25 PM",
        sender: users[9],
        content: "balo baga?",
    },
    {
        id: uuidv4(),
        from: "server",
        server: "vitamins",
        channel: "chat",
        timeSent: "1/18/25, 11:29 AM",
        sender: users[10],
        content: "may tapos na sainyo sa LE2 kay Sir Dela Vega?",
    },
    {
        id: uuidv4(),
        from: "server",
        server: "vitamins",
        channel: "chat",
        timeSent: "1/18/25, 11:31 AM",
        sender: users[7],
        content: "yung amen ata",
    },
    {
        id: uuidv4(),
        from: "server",
        server: "vitamins",
        channel: "chat",
        timeSent: "1/18/25, 11:34 AM",
        sender: users[0],
        content: "nope, uminom aq ;-; nagccram ren ako ngayon",
    },
    // big ror messages
    {
        id: uuidv4(),
        from: "server",
        server: "big ror",
        channel: "chikahan",
        timeSent: "10/27/24, 07:30 PM",
        sender: users[6],
        content: "buhay pa ba si adrian?",
    },
    {
        id: uuidv4(),
        from: "server",
        server: "big ror",
        channel: "chikahan",
        timeSent: "10/27/24, 07:36 PM",
        sender: users[0],
        content: "ewan di ko na rin nakikita yun lmao",
    },
    {
        id: uuidv4(),
        from: "server",
        server: "big ror",
        channel: "chikahan",
        timeSent: "10/27/24, 07:40 PM",
        sender: users[3],
        content: "di ka kasi napasok hays",
    },
    {
        id: uuidv4(),
        from: "server",
        server: "big ror",
        channel: "chikahan",
        timeSent: "10/29/24, 06:32 AM",
        sender: users[8],
        content: "ako rin eh di na napasok HAHAAHAHAH",
    },
    // jazzams server messages
    {
        id: uuidv4(),
        from: "server",
        server: "Jazzam's Server",
        channel: "vip",
        timeSent: "01/01/25, 12:00 AM",
        sender: users[0],
        content: "HAPPY NEW YEARRRRRRRRRR!!! ano handa :DD",
    },
    {
        id: uuidv4(),
        from: "server",
        server: "Jazzam's Server",
        channel: "vip",
        timeSent: "01/01/25, 01:01 AM",
        sender: users[2],
        content: "wala, alak",
    },
    {
        id: uuidv4(),
        from: "server",
        server: "Jazzam's Server",
        channel: "vip",
        timeSent: "01/01/25, 01:03 AM",
        sender: users[11],
        content: "same",
    },
];

// initial dm messages
export const dmMsgs = [
    {
        id: uuidv4(),
        from: "dm",
        timeSent: "10/26/24, 11:30 PM",
        sender: users[1], // kdot
        recipient: users[0].id,
        content: "wassap :)",
    },
    {
        id: uuidv4(),
        timeSent: "10/27/24, 03:50 PM",
        from: "dm",
        sender: users[3],
        recipient: users[0].id,
        content: "sis pasend ako ng picture para mamyday ko na",
    },
    {
        id: uuidv4(),
        timeSent: "10/27/24, 09:00 PM",
        from: "dm",
        sender: users[0],
        recipient: users[2].id,
        content: "Just finished reviewing the document. Looks good!",
    },
];

// servers
