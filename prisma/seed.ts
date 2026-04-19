import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

const genres = [
  { name: "Action", slug: "action" },
  { name: "RPG", slug: "rpg" },
  { name: "Strategy", slug: "strategy" },
  { name: "Adventure", slug: "adventure" },
  { name: "Simulation", slug: "simulation" },
  { name: "Puzzle", slug: "puzzle" },
  { name: "Horror", slug: "horror" },
  { name: "Sports", slug: "sports" },
  { name: "Fighting", slug: "fighting" },
  { name: "Shooter", slug: "shooter" },
  { name: "Platformer", slug: "platformer" },
  { name: "Indie", slug: "indie" },
];

const tags = [
  { name: "Story Rich", slug: "story-rich" },
  { name: "Multiplayer", slug: "multiplayer" },
  { name: "Open World", slug: "open-world" },
  { name: "Singleplayer", slug: "singleplayer" },
  { name: "Atmospheric", slug: "atmospheric" },
  { name: "Dark Fantasy", slug: "dark-fantasy" },
  { name: "Sci-Fi", slug: "sci-fi" },
  { name: "Post-Apocalyptic", slug: "post-apocalyptic" },
  { name: "Roguelike", slug: "roguelike" },
  { name: "Pixel Art", slug: "pixel-art" },
  { name: "Souls-like", slug: "souls-like" },
  { name: "Co-op", slug: "co-op" },
];

const platforms = [
  { name: "PC", slug: "pc" },
  { name: "PlayStation 5", slug: "ps5" },
  { name: "Xbox Series X", slug: "xbox-series-x" },
  { name: "Nintendo Switch", slug: "nintendo-switch" },
  { name: "PlayStation 4", slug: "ps4" },
  { name: "Xbox One", slug: "xbox-one" },
];

const games = [
  // ─── FromSoftware / Souls ────────────────────────────────────────────────
  {
    title: "Elden Ring",
    slug: "elden-ring",
    description: "A vast world where open fields with a variety of situations and huge dungeons with complex and three-dimensional designs are seamlessly connected. As you explore, the joy of discovering unknown and overwhelming threats await you, leading to a high sense of accomplishment.",
    coverUrl: "https://media.rawg.io/media/games/b29/b294fdd866dcdb643e7bab370a552855.jpg",
    bannerUrl: "https://media.rawg.io/media/games/b29/b294fdd866dcdb643e7bab370a552855.jpg",
    developer: "FromSoftware", publisher: "Bandai Namco", releaseYear: 2022, avgRating: 4.8, ratingCount: 0,
    genres: ["action", "rpg"], tags: ["open-world", "souls-like", "dark-fantasy", "singleplayer"],
    platforms: ["pc", "ps5", "xbox-series-x", "ps4", "xbox-one"],
  },
  {
    title: "Dark Souls III",
    slug: "dark-souls-iii",
    description: "As fires fade and the world falls into ruin, journey into a universe filled with more colossal enemies and environments. Players will engage in challenging gameplay with a fluid, new battle system and deeper character development.",
    coverUrl: "https://media.rawg.io/media/games/da1/da1b267764d77221f07a4386b6548e5a.jpg",
    bannerUrl: "https://media.rawg.io/media/games/da1/da1b267764d77221f07a4386b6548e5a.jpg",
    developer: "FromSoftware", publisher: "Bandai Namco", releaseYear: 2016, avgRating: 4.7, ratingCount: 0,
    genres: ["action", "rpg"], tags: ["souls-like", "dark-fantasy", "atmospheric", "singleplayer"],
    platforms: ["pc", "ps4", "xbox-one"],
  },
  {
    title: "Bloodborne",
    slug: "bloodborne",
    description: "Face your fears as you search for answers in the ancient city of Yharnam, now cursed with a strange endemic illness spreading through the streets like wildfire. Danger, death and madness lurk around every corner.",
    coverUrl: "https://media.rawg.io/media/games/214/214b29aeff13a0ae6a70fc4426e85991.jpg",
    bannerUrl: "https://media.rawg.io/media/games/214/214b29aeff13a0ae6a70fc4426e85991.jpg",
    developer: "FromSoftware", publisher: "Sony Interactive Entertainment", releaseYear: 2015, avgRating: 4.8, ratingCount: 0,
    genres: ["action", "rpg"], tags: ["souls-like", "atmospheric", "dark-fantasy", "singleplayer"],
    platforms: ["ps4"],
  },
  {
    title: "Sekiro: Shadows Die Twice",
    slug: "sekiro-shadows-die-twice",
    description: "Carve your own clever path to vengeance in the award winning action-adventure title from developer FromSoftware. In Sekiro: Shadows Die Twice you are the one-armed wolf, a disgraced and disfigured warrior rescued from the brink of death.",
    coverUrl: "https://media.rawg.io/media/games/67f/67f62d1f062a6164f57575e0604ee9f6.jpg",
    bannerUrl: "https://media.rawg.io/media/games/67f/67f62d1f062a6164f57575e0604ee9f6.jpg",
    developer: "FromSoftware", publisher: "Activision", releaseYear: 2019, avgRating: 4.7, ratingCount: 0,
    genres: ["action", "adventure"], tags: ["souls-like", "atmospheric", "singleplayer"],
    platforms: ["pc", "ps4", "xbox-one"],
  },

  // ─── RPG / Open World ────────────────────────────────────────────────────
  {
    title: "The Witcher 3: Wild Hunt",
    slug: "the-witcher-3-wild-hunt",
    description: "You are Geralt of Rivia, mercenary monster slayer. Before you stands a war-torn, monster-infested continent you can explore at will. Your current contract? Tracking down the Child of Prophecy, a living weapon that can alter the shape of the world.",
    coverUrl: "https://media.rawg.io/media/games/618/618c2031a07bbff6b4f611f10b6bcdbc.jpg",
    bannerUrl: "https://media.rawg.io/media/games/618/618c2031a07bbff6b4f611f10b6bcdbc.jpg",
    developer: "CD Projekt Red", publisher: "CD Projekt", releaseYear: 2015, avgRating: 4.9, ratingCount: 0,
    genres: ["rpg", "adventure"], tags: ["open-world", "story-rich", "dark-fantasy", "singleplayer"],
    platforms: ["pc", "ps5", "xbox-series-x", "ps4", "xbox-one", "nintendo-switch"],
  },
  {
    title: "Cyberpunk 2077",
    slug: "cyberpunk-2077",
    description: "Cyberpunk 2077 is an open-world, action-adventure story set in Night City, a megalopolis obsessed with power, glamour and body modification. You play as V, a mercenary outlaw going after a one-of-a-kind implant that is the key to immortality.",
    coverUrl: "https://media.rawg.io/media/games/26d/26d4437715bee60138dab4a7c8c59c92.jpg",
    bannerUrl: "https://media.rawg.io/media/games/26d/26d4437715bee60138dab4a7c8c59c92.jpg",
    developer: "CD Projekt Red", publisher: "CD Projekt", releaseYear: 2020, avgRating: 4.2, ratingCount: 0,
    genres: ["rpg", "action", "shooter"], tags: ["open-world", "story-rich", "sci-fi", "singleplayer"],
    platforms: ["pc", "ps5", "xbox-series-x", "ps4", "xbox-one"],
  },
  {
    title: "Baldur's Gate 3",
    slug: "baldurs-gate-3",
    description: "Baldur's Gate 3 is a story-rich, party-based RPG set in the universe of Dungeons & Dragons, where your choices shape a tale of fellowship and betrayal, survival and sacrifice, and the lure of absolute power.",
    coverUrl: "https://media.rawg.io/media/games/699/69907ecf13f172e9e144069769c3be73.jpg",
    bannerUrl: "https://media.rawg.io/media/games/699/69907ecf13f172e9e144069769c3be73.jpg",
    developer: "Larian Studios", publisher: "Larian Studios", releaseYear: 2023, avgRating: 4.9, ratingCount: 0,
    genres: ["rpg", "strategy"], tags: ["story-rich", "co-op", "multiplayer", "dark-fantasy"],
    platforms: ["pc", "ps5", "xbox-series-x"],
  },
  {
    title: "Disco Elysium",
    slug: "disco-elysium",
    description: "Disco Elysium is a groundbreaking open world role playing game. You're a detective with a unique skill system at your disposal and a whole city block to carve your path across.",
    coverUrl: "https://media.rawg.io/media/games/f49/f4920e37aa923b2d8bfd07c7f3f10b98.jpg",
    bannerUrl: "https://media.rawg.io/media/games/f49/f4920e37aa923b2d8bfd07c7f3f10b98.jpg",
    developer: "ZA/UM", publisher: "ZA/UM", releaseYear: 2019, avgRating: 4.6, ratingCount: 0,
    genres: ["rpg", "adventure"], tags: ["story-rich", "singleplayer", "atmospheric"],
    platforms: ["pc", "ps4", "ps5", "nintendo-switch", "xbox-one"],
  },
  {
    title: "Red Dead Redemption 2",
    slug: "red-dead-redemption-2",
    description: "America, 1899. The end of the wild west era has begun as lawmen hunt down the last remaining outlaw gangs. Those who will not accept the death of the old ways, will clash with the forces of civilization.",
    coverUrl: "https://media.rawg.io/media/games/511/5118aff5091cb3efec399c808f8c598f.jpg",
    bannerUrl: "https://media.rawg.io/media/games/511/5118aff5091cb3efec399c808f8c598f.jpg",
    developer: "Rockstar Games", publisher: "Rockstar Games", releaseYear: 2018, avgRating: 4.7, ratingCount: 0,
    genres: ["action", "adventure"], tags: ["open-world", "story-rich", "atmospheric", "singleplayer"],
    platforms: ["pc", "ps4", "xbox-one"],
  },
  {
    title: "Grand Theft Auto V",
    slug: "grand-theft-auto-v",
    description: "Grand Theft Auto V is a vast open world game set in Los Santos: a sprawling sun-soaked metropolis struggling with self-help gurus, starlets and fading celebrities, once the envy of the Western world, now struggling to stay afloat in an era of economic uncertainty and cheap reality TV.",
    coverUrl: "https://media.rawg.io/media/games/456/456dea5e1c7e3cd07060c14e96612001.jpg",
    bannerUrl: "https://media.rawg.io/media/games/456/456dea5e1c7e3cd07060c14e96612001.jpg",
    developer: "Rockstar Games", publisher: "Rockstar Games", releaseYear: 2013, avgRating: 4.5, ratingCount: 0,
    genres: ["action", "adventure"], tags: ["open-world", "multiplayer", "singleplayer"],
    platforms: ["pc", "ps4", "ps5", "xbox-one", "xbox-series-x"],
  },
  {
    title: "The Elder Scrolls V: Skyrim",
    slug: "the-elder-scrolls-v-skyrim",
    description: "Skyrim reimagines and revolutionizes the open-world fantasy epic, bringing to life a complete virtual world open for you to explore any way you choose.",
    coverUrl: "https://media.rawg.io/media/games/7cf/7cfc9220b401b7a300e409e539c9afd5.jpg",
    bannerUrl: "https://media.rawg.io/media/games/7cf/7cfc9220b401b7a300e409e539c9afd5.jpg",
    developer: "Bethesda Game Studios", publisher: "Bethesda Softworks", releaseYear: 2011, avgRating: 4.4, ratingCount: 0,
    genres: ["rpg", "action"], tags: ["open-world", "dark-fantasy", "singleplayer", "atmospheric"],
    platforms: ["pc", "ps4", "xbox-one", "nintendo-switch"],
  },
  {
    title: "Mass Effect Legendary Edition",
    slug: "mass-effect-legendary-edition",
    description: "The Mass Effect Legendary Edition includes single-player base content and over 40 DLC from the highly acclaimed Mass Effect, Mass Effect 2, and Mass Effect 3 games.",
    coverUrl: "https://media.rawg.io/media/games/3ea/3ea3c9bbd940b6cb7f2139e42d3d443f.jpg",
    bannerUrl: "https://media.rawg.io/media/games/3ea/3ea3c9bbd940b6cb7f2139e42d3d443f.jpg",
    developer: "BioWare", publisher: "Electronic Arts", releaseYear: 2021, avgRating: 4.7, ratingCount: 0,
    genres: ["rpg", "action", "shooter"], tags: ["story-rich", "sci-fi", "singleplayer"],
    platforms: ["pc", "ps4", "xbox-one"],
  },

  // ─── Action / Adventure ──────────────────────────────────────────────────
  {
    title: "God of War",
    slug: "god-of-war-2018",
    description: "His vengeance against the Gods of Olympus years behind him, Kratos now lives as a man in the realm of Norse Gods and monsters. It is in this harsh, unforgiving world that he must fight to survive…and teach his son to do the same.",
    coverUrl: "https://media.rawg.io/media/games/4be/4be6a6ad0364751a96229c56bf69be73.jpg",
    bannerUrl: "https://media.rawg.io/media/games/4be/4be6a6ad0364751a96229c56bf69be73.jpg",
    developer: "Santa Monica Studio", publisher: "Sony Interactive Entertainment", releaseYear: 2018, avgRating: 4.9, ratingCount: 0,
    genres: ["action", "adventure"], tags: ["story-rich", "singleplayer", "atmospheric", "dark-fantasy"],
    platforms: ["pc", "ps4", "ps5"],
  },
  {
    title: "God of War Ragnarök",
    slug: "god-of-war-ragnarok",
    description: "Join Kratos and Atreus on a mythic journey for answers before Ragnarök arrives. Together they will explore stunning mythological landscapes and face fearsome enemies.",
    coverUrl: "https://media.rawg.io/media/games/121/121467d9db93c43bdf0bf6b86de54949.jpg",
    bannerUrl: "https://media.rawg.io/media/games/121/121467d9db93c43bdf0bf6b86de54949.jpg",
    developer: "Santa Monica Studio", publisher: "Sony Interactive Entertainment", releaseYear: 2022, avgRating: 4.8, ratingCount: 0,
    genres: ["action", "adventure"], tags: ["story-rich", "singleplayer", "atmospheric"],
    platforms: ["ps4", "ps5"],
  },
  {
    title: "The Last of Us Part I",
    slug: "the-last-of-us-part-i",
    description: "Experience the emotional storytelling and unforgettable characters of Joel and Ellie in The Last of Us, winner of over 200 Game of the Year awards.",
    coverUrl: "https://media.rawg.io/media/games/909/909974d1c7863c2027241e265fe7011f.jpg",
    bannerUrl: "https://media.rawg.io/media/games/909/909974d1c7863c2027241e265fe7011f.jpg",
    developer: "Naughty Dog", publisher: "Sony Interactive Entertainment", releaseYear: 2022, avgRating: 4.8, ratingCount: 0,
    genres: ["action", "adventure", "horror"], tags: ["story-rich", "post-apocalyptic", "atmospheric", "singleplayer"],
    platforms: ["pc", "ps4", "ps5"],
  },
  {
    title: "Spider-Man: Miles Morales",
    slug: "spider-man-miles-morales",
    description: "Experience the rise of Miles Morales as the new hero masters incredible, explosive new powers to become his own Spider-Man.",
    coverUrl: "https://media.rawg.io/media/games/9fb/9fbf956a1cf6bfdb4a2836e797b5f7e4.jpg",
    bannerUrl: "https://media.rawg.io/media/games/9fb/9fbf956a1cf6bfdb4a2836e797b5f7e4.jpg",
    developer: "Insomniac Games", publisher: "Sony Interactive Entertainment", releaseYear: 2020, avgRating: 4.5, ratingCount: 0,
    genres: ["action", "adventure"], tags: ["story-rich", "singleplayer", "open-world"],
    platforms: ["pc", "ps4", "ps5"],
  },
  {
    title: "Ghost of Tsushima",
    slug: "ghost-of-tsushima",
    description: "A storm is coming. Entire Mongol fleets have been destroyed. And the Island of Tsushima is all that stands between mainland Japan and a ruthless Mongol invasion.",
    coverUrl: "https://media.rawg.io/media/games/3f1/3f16b229e40de5d944a2f77c56b5a3c9.jpg",
    bannerUrl: "https://media.rawg.io/media/games/3f1/3f16b229e40de5d944a2f77c56b5a3c9.jpg",
    developer: "Sucker Punch Productions", publisher: "Sony Interactive Entertainment", releaseYear: 2020, avgRating: 4.6, ratingCount: 0,
    genres: ["action", "adventure"], tags: ["open-world", "story-rich", "atmospheric", "singleplayer"],
    platforms: ["ps4", "ps5"],
  },
  {
    title: "Horizon Zero Dawn",
    slug: "horizon-zero-dawn",
    description: "Experience Aloy's entire legendary quest to unravel the mysteries of a world ruled by deadly Machines. An outcast from her tribe, Aloy must discover her destiny.",
    coverUrl: "https://media.rawg.io/media/games/b7d/b7d3f1715fa8381a4e780173a197a615.jpg",
    bannerUrl: "https://media.rawg.io/media/games/b7d/b7d3f1715fa8381a4e780173a197a615.jpg",
    developer: "Guerrilla Games", publisher: "Sony Interactive Entertainment", releaseYear: 2017, avgRating: 4.4, ratingCount: 0,
    genres: ["action", "rpg"], tags: ["open-world", "story-rich", "sci-fi", "singleplayer"],
    platforms: ["pc", "ps4"],
  },
  {
    title: "Death Stranding",
    slug: "death-stranding",
    description: "Sam Bridges must brave a world utterly transformed by the Death Stranding. Carrying the stranded remnants of the future in his hands, Sam embarks on a journey to reunite the shattered world one step at a time.",
    coverUrl: "https://media.rawg.io/media/games/12b/12b69d9287c57a39ee5957af2a2ee69a.jpg",
    bannerUrl: "https://media.rawg.io/media/games/12b/12b69d9287c57a39ee5957af2a2ee69a.jpg",
    developer: "Kojima Productions", publisher: "505 Games", releaseYear: 2019, avgRating: 4.1, ratingCount: 0,
    genres: ["action", "adventure"], tags: ["atmospheric", "sci-fi", "story-rich", "singleplayer"],
    platforms: ["pc", "ps4", "ps5"],
  },

  // ─── Shooters ────────────────────────────────────────────────────────────
  {
    title: "Halo Infinite",
    slug: "halo-infinite",
    description: "When all hope is lost and humanity's fate hangs in the balance, the Master Chief is ready to confront the most ruthless foe he's ever faced. Begin anew and step inside the armor of humanity's greatest hero.",
    coverUrl: "https://media.rawg.io/media/games/3ea/3eae63b9ddd3e55c89f59dc561bd7ea5.jpg",
    bannerUrl: "https://media.rawg.io/media/games/3ea/3eae63b9ddd3e55c89f59dc561bd7ea5.jpg",
    developer: "343 Industries", publisher: "Xbox Game Studios", releaseYear: 2021, avgRating: 4.0, ratingCount: 0,
    genres: ["shooter", "action"], tags: ["multiplayer", "sci-fi", "co-op", "open-world"],
    platforms: ["pc", "xbox-series-x", "xbox-one"],
  },
  {
    title: "Doom Eternal",
    slug: "doom-eternal",
    description: "Hell's armies have invaded Earth. Become the Slayer in an epic single-player campaign to conquer demons across dimensions and stop the final destruction of humanity.",
    coverUrl: "https://media.rawg.io/media/games/c4b/c4b0cab189e73432de3a250d8cf1c84e.jpg",
    bannerUrl: "https://media.rawg.io/media/games/c4b/c4b0cab189e73432de3a250d8cf1c84e.jpg",
    developer: "id Software", publisher: "Bethesda Softworks", releaseYear: 2020, avgRating: 4.6, ratingCount: 0,
    genres: ["shooter", "action"], tags: ["singleplayer", "atmospheric"],
    platforms: ["pc", "ps4", "ps5", "xbox-one", "xbox-series-x", "nintendo-switch"],
  },
  {
    title: "Titanfall 2",
    slug: "titanfall-2",
    description: "What happens when a Pilot and their Titan form an unlikely bond? Experience a rich single player campaign or enjoy the evolution of Titanfall's multiplayer.",
    coverUrl: "https://media.rawg.io/media/games/8cc/8cce7c0e99dcc43d66c8efd42f9d03e3.jpg",
    bannerUrl: "https://media.rawg.io/media/games/8cc/8cce7c0e99dcc43d66c8efd42f9d03e3.jpg",
    developer: "Respawn Entertainment", publisher: "Electronic Arts", releaseYear: 2016, avgRating: 4.6, ratingCount: 0,
    genres: ["shooter", "action"], tags: ["singleplayer", "multiplayer", "sci-fi"],
    platforms: ["pc", "ps4", "xbox-one"],
  },
  {
    title: "Bioshock Infinite",
    slug: "bioshock-infinite",
    description: "Indebted to the wrong people, with his life on the line, veteran of the U.S. Cavalry and now hired gun Booker DeWitt has only one opportunity to wipe his slate clean. He must rescue Elizabeth, a mysterious girl imprisoned since childhood.",
    coverUrl: "https://media.rawg.io/media/games/fc1/fc1307a2774506b5bd65d7e8424664a7.jpg",
    bannerUrl: "https://media.rawg.io/media/games/fc1/fc1307a2774506b5bd65d7e8424664a7.jpg",
    developer: "Irrational Games", publisher: "2K Games", releaseYear: 2013, avgRating: 4.5, ratingCount: 0,
    genres: ["shooter", "action"], tags: ["story-rich", "singleplayer", "atmospheric"],
    platforms: ["pc", "ps4", "xbox-one", "nintendo-switch"],
  },

  // ─── Indie Gems ──────────────────────────────────────────────────────────
  {
    title: "Hades",
    slug: "hades",
    description: "Defy the god of the dead as you hack and slash your way out of the Underworld in this rogue-like dungeon crawler from the creators of Bastion, Transistor, and Pyre.",
    coverUrl: "https://media.rawg.io/media/games/1f4/1f47a270b8f241f3bf9b53f98fc74e25.jpg",
    bannerUrl: "https://media.rawg.io/media/games/1f4/1f47a270b8f241f3bf9b53f98fc74e25.jpg",
    developer: "Supergiant Games", publisher: "Supergiant Games", releaseYear: 2020, avgRating: 4.8, ratingCount: 0,
    genres: ["action", "indie", "rpg"], tags: ["roguelike", "story-rich", "singleplayer", "atmospheric"],
    platforms: ["pc", "ps4", "ps5", "xbox-one", "xbox-series-x", "nintendo-switch"],
  },
  {
    title: "Hollow Knight",
    slug: "hollow-knight",
    description: "A challenging 2D action-adventure. Explore twisting caverns, battle tainted creatures and befriend bizarre bugs, all in a classic, hand-drawn art style.",
    coverUrl: "https://media.rawg.io/media/games/4cf/4cfc6b7f1850590a4634b08bfab308ab.jpg",
    bannerUrl: "https://media.rawg.io/media/games/4cf/4cfc6b7f1850590a4634b08bfab308ab.jpg",
    developer: "Team Cherry", publisher: "Team Cherry", releaseYear: 2017, avgRating: 4.7, ratingCount: 0,
    genres: ["action", "indie", "adventure"], tags: ["souls-like", "atmospheric", "pixel-art", "singleplayer"],
    platforms: ["pc", "nintendo-switch", "ps4", "xbox-one"],
  },
  {
    title: "Stardew Valley",
    slug: "stardew-valley",
    description: "You've inherited your grandfather's old farm plot in Stardew Valley. Armed with hand-me-down tools and a few coins, you set out to begin your new life.",
    coverUrl: "https://media.rawg.io/media/games/713/713269608dc8f2f40f5a670a14b2de94.jpg",
    bannerUrl: "https://media.rawg.io/media/games/713/713269608dc8f2f40f5a670a14b2de94.jpg",
    developer: "ConcernedApe", publisher: "ConcernedApe", releaseYear: 2016, avgRating: 4.6, ratingCount: 0,
    genres: ["simulation", "indie"], tags: ["pixel-art", "multiplayer", "co-op", "singleplayer"],
    platforms: ["pc", "ps4", "xbox-one", "nintendo-switch"],
  },
  {
    title: "Celeste",
    slug: "celeste",
    description: "Help Madeline survive her inner demons on her journey to the top of Celeste Mountain, in this super-tight platformer from the creators of TowerFall. Brave hundreds of hand-crafted challenges, uncover devious secrets, and piece together the mystery of the mountain.",
    coverUrl: "https://media.rawg.io/media/games/594/59487800889ebef7d2a66e9f2b59dac6.jpg",
    bannerUrl: "https://media.rawg.io/media/games/594/59487800889ebef7d2a66e9f2b59dac6.jpg",
    developer: "Maddy Makes Games", publisher: "Maddy Makes Games", releaseYear: 2018, avgRating: 4.7, ratingCount: 0,
    genres: ["platformer", "indie"], tags: ["story-rich", "singleplayer", "pixel-art", "atmospheric"],
    platforms: ["pc", "ps4", "xbox-one", "nintendo-switch"],
  },
  {
    title: "Undertale",
    slug: "undertale",
    description: "A small child falls into the Underground, a realm filled with monsters. Navigate through the Underground, encountering various monsters. You can fight, or talk your way out.",
    coverUrl: "https://media.rawg.io/media/games/236/236390d2992b7e1fc1d3f836bd2aa847.jpg",
    bannerUrl: "https://media.rawg.io/media/games/236/236390d2992b7e1fc1d3f836bd2aa847.jpg",
    developer: "tobyfox", publisher: "tobyfox", releaseYear: 2015, avgRating: 4.6, ratingCount: 0,
    genres: ["rpg", "indie"], tags: ["story-rich", "pixel-art", "singleplayer", "atmospheric"],
    platforms: ["pc", "ps4", "nintendo-switch", "xbox-one"],
  },
  {
    title: "Ori and the Will of the Wisps",
    slug: "ori-and-the-will-of-the-wisps",
    description: "On the outskirts of Nibel is Niwen, a mysterious forest filled with wonder and wildlife. Explore lush environments and discover how they are all connected.",
    coverUrl: "https://media.rawg.io/media/games/718/71869bc94fea4c9fb1a69a544657f975.jpg",
    bannerUrl: "https://media.rawg.io/media/games/718/71869bc94fea4c9fb1a69a544657f975.jpg",
    developer: "Moon Studios", publisher: "Xbox Game Studios", releaseYear: 2020, avgRating: 4.6, ratingCount: 0,
    genres: ["platformer", "indie"], tags: ["atmospheric", "story-rich", "singleplayer"],
    platforms: ["pc", "xbox-one", "xbox-series-x", "nintendo-switch"],
  },
  {
    title: "Cuphead",
    slug: "cuphead",
    description: "Cuphead is a classic run and gun action game heavily focused on boss battles. Inspired by cartoons of the 1930s, the visuals and audio are painstakingly created with the same techniques of the era.",
    coverUrl: "https://media.rawg.io/media/games/58b/58b961b5d0e1f8d00960706a613bced9.jpg",
    bannerUrl: "https://media.rawg.io/media/games/58b/58b961b5d0e1f8d00960706a613bced9.jpg",
    developer: "Studio MDHR", publisher: "Studio MDHR", releaseYear: 2017, avgRating: 4.5, ratingCount: 0,
    genres: ["action", "platformer", "indie"], tags: ["co-op", "multiplayer", "singleplayer"],
    platforms: ["pc", "ps4", "xbox-one", "nintendo-switch"],
  },
  {
    title: "Terraria",
    slug: "terraria",
    description: "Dig, fight, explore, build! Nothing is impossible in this action-packed adventure game. Four Pack also available.",
    coverUrl: "https://media.rawg.io/media/games/f46/f466571d536f2e3ea9e815ad17177501.jpg",
    bannerUrl: "https://media.rawg.io/media/games/f46/f466571d536f2e3ea9e815ad17177501.jpg",
    developer: "Re-Logic", publisher: "Re-Logic", releaseYear: 2011, avgRating: 4.6, ratingCount: 0,
    genres: ["action", "indie"], tags: ["multiplayer", "co-op", "pixel-art", "singleplayer"],
    platforms: ["pc", "ps4", "xbox-one", "nintendo-switch"],
  },

  // ─── Strategy ────────────────────────────────────────────────────────────
  {
    title: "Civilization VI",
    slug: "civilization-vi",
    description: "Civilization VI offers new ways to interact with your world, expand your empire across the map, advance your culture, and compete against history's greatest leaders.",
    coverUrl: "https://media.rawg.io/media/games/35b/35b884f51f7f9c5f21eff35d0de1da06.jpg",
    bannerUrl: "https://media.rawg.io/media/games/35b/35b884f51f7f9c5f21eff35d0de1da06.jpg",
    developer: "Firaxis Games", publisher: "2K Games", releaseYear: 2016, avgRating: 4.3, ratingCount: 0,
    genres: ["strategy"], tags: ["multiplayer", "singleplayer"],
    platforms: ["pc", "ps4", "xbox-one", "nintendo-switch"],
  },
  {
    title: "XCOM 2",
    slug: "xcom-2",
    description: "XCOM 2 is the sequel to XCOM: Enemy Unknown, the 2012 award-winning strategy game of the year. Earth has changed and is now under alien rule.",
    coverUrl: "https://media.rawg.io/media/games/8d6/8d69eb6c32ed6acfd75f82d532144993.jpg",
    bannerUrl: "https://media.rawg.io/media/games/8d6/8d69eb6c32ed6acfd75f82d532144993.jpg",
    developer: "Firaxis Games", publisher: "2K Games", releaseYear: 2016, avgRating: 4.3, ratingCount: 0,
    genres: ["strategy"], tags: ["singleplayer", "sci-fi", "roguelike"],
    platforms: ["pc", "ps4", "xbox-one", "nintendo-switch"],
  },
  {
    title: "Hades II",
    slug: "hades-ii",
    description: "The next rogue-like game from Supergiant, the independent studio behind Hades, Pyre, Transistor, and Bastion. Battle through the Underworld as Melinoë, the immortal Princess of the Underworld, on a quest to defeat the Titan of Time.",
    coverUrl: "https://media.rawg.io/media/games/f3e/f3eec35c6218dcfd93a537751e6bfa61.jpg",
    bannerUrl: "https://media.rawg.io/media/games/f3e/f3eec35c6218dcfd93a537751e6bfa61.jpg",
    developer: "Supergiant Games", publisher: "Supergiant Games", releaseYear: 2024, avgRating: 4.7, ratingCount: 0,
    genres: ["action", "indie", "rpg"], tags: ["roguelike", "singleplayer", "atmospheric"],
    platforms: ["pc", "nintendo-switch"],
  },

  // ─── Horror ──────────────────────────────────────────────────────────────
  {
    title: "Resident Evil Village",
    slug: "resident-evil-village",
    description: "Experience survival horror like never before in the eighth major installment in the Resident Evil franchise. Set a few years after the horrifying events in the critically acclaimed Resident Evil 7 biohazard.",
    coverUrl: "https://media.rawg.io/media/games/f87/f87457e8347484033cb34cde6101d08d.jpg",
    bannerUrl: "https://media.rawg.io/media/games/f87/f87457e8347484033cb34cde6101d08d.jpg",
    developer: "Capcom", publisher: "Capcom", releaseYear: 2021, avgRating: 4.5, ratingCount: 0,
    genres: ["horror", "action"], tags: ["story-rich", "singleplayer", "atmospheric"],
    platforms: ["pc", "ps4", "ps5", "xbox-one", "xbox-series-x"],
  },
  {
    title: "Alien: Isolation",
    slug: "alien-isolation",
    description: "Discover the true meaning of fear in Alien: Isolation, a survival horror set in an atmosphere of constant dread and mortal danger. Fifteen years after the events of Alien™, Ellen Ripley's daughter, Amanda enters a desperate battle for survival.",
    coverUrl: "https://media.rawg.io/media/games/b7b/b7b638609f437ab8a4c08cfe58ef9f28.jpg",
    bannerUrl: "https://media.rawg.io/media/games/b7b/b7b638609f437ab8a4c08cfe58ef9f28.jpg",
    developer: "Creative Assembly", publisher: "SEGA", releaseYear: 2014, avgRating: 4.5, ratingCount: 0,
    genres: ["horror", "action"], tags: ["atmospheric", "singleplayer", "sci-fi"],
    platforms: ["pc", "ps4", "xbox-one", "nintendo-switch"],
  },

  // ─── Nintendo / Platformers ──────────────────────────────────────────────
  {
    title: "The Legend of Zelda: Breath of the Wild",
    slug: "the-legend-of-zelda-breath-of-the-wild",
    description: "Step into a world of discovery, exploration and adventure in The Legend of Zelda: Breath of the Wild, a boundary-breaking new game in the acclaimed series.",
    coverUrl: "https://media.rawg.io/media/games/cc3/cc3f7f5a3e5b604e3e3b6d02b2e2b4a2.jpg",
    bannerUrl: "https://media.rawg.io/media/games/cc3/cc3f7f5a3e5b604e3e3b6d02b2e2b4a2.jpg",
    developer: "Nintendo", publisher: "Nintendo", releaseYear: 2017, avgRating: 4.8, ratingCount: 0,
    genres: ["action", "adventure"], tags: ["open-world", "singleplayer", "atmospheric"],
    platforms: ["nintendo-switch"],
  },
  {
    title: "The Legend of Zelda: Tears of the Kingdom",
    slug: "the-legend-of-zelda-tears-of-the-kingdom",
    description: "An epic adventure across the land and skies of Hyrule awaits in The Legend of Zelda: Tears of the Kingdom, the successor to Breath of the Wild.",
    coverUrl: "https://media.rawg.io/media/games/2b7/2b7504e8cece52e5f02b1a90d9a9adfe.jpg",
    bannerUrl: "https://media.rawg.io/media/games/2b7/2b7504e8cece52e5f02b1a90d9a9adfe.jpg",
    developer: "Nintendo", publisher: "Nintendo", releaseYear: 2023, avgRating: 4.8, ratingCount: 0,
    genres: ["action", "adventure"], tags: ["open-world", "singleplayer", "atmospheric"],
    platforms: ["nintendo-switch"],
  },
  {
    title: "Super Mario Odyssey",
    slug: "super-mario-odyssey",
    description: "Join Mario on a massive, globe-trotting 3D adventure and use his incredible new abilities to collect Moons so you can power up your airship, the Odyssey, and rescue Princess Peach from Bowser's wedding plans!",
    coverUrl: "https://media.rawg.io/media/games/267/267bd0dbc496f52692487d07d014c061.jpg",
    bannerUrl: "https://media.rawg.io/media/games/267/267bd0dbc496f52692487d07d014c061.jpg",
    developer: "Nintendo", publisher: "Nintendo", releaseYear: 2017, avgRating: 4.6, ratingCount: 0,
    genres: ["platformer", "adventure"], tags: ["singleplayer"],
    platforms: ["nintendo-switch"],
  },
  {
    title: "Metroid Dread",
    slug: "metroid-dread",
    description: "Samus Aran's story continues in Metroid Dread. While investigating a mysterious transmission on planet ZDR, Samus faces a deadly threat that pushes her to her limits.",
    coverUrl: "https://media.rawg.io/media/games/e73/e73968b4b8fcf82d3c16ff5e1ef3c5ae.jpg",
    bannerUrl: "https://media.rawg.io/media/games/e73/e73968b4b8fcf82d3c16ff5e1ef3c5ae.jpg",
    developer: "MercurySteam", publisher: "Nintendo", releaseYear: 2021, avgRating: 4.5, ratingCount: 0,
    genres: ["action", "platformer"], tags: ["singleplayer", "atmospheric", "souls-like"],
    platforms: ["nintendo-switch"],
  },

  // ─── Multiplayer / Online ────────────────────────────────────────────────
  {
    title: "Minecraft",
    slug: "minecraft",
    description: "Minecraft is a game about placing blocks and going on adventures. Explore randomly generated worlds and build amazing things from the simplest of homes to the grandest of castles.",
    coverUrl: "https://media.rawg.io/media/games/b4e/b4e4c73d5aa4ec4f7b5e40da7ef0d085.jpg",
    bannerUrl: "https://media.rawg.io/media/games/b4e/b4e4c73d5aa4ec4f7b5e40da7ef0d085.jpg",
    developer: "Mojang Studios", publisher: "Mojang Studios", releaseYear: 2011, avgRating: 4.4, ratingCount: 0,
    genres: ["simulation", "indie"], tags: ["multiplayer", "co-op", "singleplayer", "open-world"],
    platforms: ["pc", "ps4", "ps5", "xbox-one", "xbox-series-x", "nintendo-switch"],
  },
  {
    title: "Overwatch 2",
    slug: "overwatch-2",
    description: "Overwatch 2 is an ever-evolving free-to-play game. Experience new heroes, maps, modes and events across a growing roster.",
    coverUrl: "https://media.rawg.io/media/games/736/73619d3be9fa31e5bce0e5da0af3ae3f.jpg",
    bannerUrl: "https://media.rawg.io/media/games/736/73619d3be9fa31e5bce0e5da0af3ae3f.jpg",
    developer: "Blizzard Entertainment", publisher: "Blizzard Entertainment", releaseYear: 2022, avgRating: 3.6, ratingCount: 0,
    genres: ["shooter", "action"], tags: ["multiplayer"],
    platforms: ["pc", "ps4", "ps5", "xbox-one", "xbox-series-x", "nintendo-switch"],
  },
  {
    title: "Deep Rock Galactic",
    slug: "deep-rock-galactic",
    description: "Work together as a team of space Dwarves to dig, fight, and explode your way through a veritable smorgasbord of dangerous alien monsters.",
    coverUrl: "https://media.rawg.io/media/games/f6d/f6d03c9af7db17bfc59ad5543714dc07.jpg",
    bannerUrl: "https://media.rawg.io/media/games/f6d/f6d03c9af7db17bfc59ad5543714dc07.jpg",
    developer: "Ghost Ship Games", publisher: "Coffee Stain Publishing", releaseYear: 2020, avgRating: 4.7, ratingCount: 0,
    genres: ["shooter", "indie"], tags: ["co-op", "multiplayer", "sci-fi"],
    platforms: ["pc", "ps4", "ps5", "xbox-one", "xbox-series-x"],
  },
  {
    title: "It Takes Two",
    slug: "it-takes-two",
    description: "Embark on the craziest journey of your life in It Takes Two. Invite a friend to join for free with Friend's Pass and work together across a huge variety of gleefully disruptive gameplay challenges.",
    coverUrl: "https://media.rawg.io/media/games/4f9/4f9e56b89bf41c0b69dec7059fe22a24.jpg",
    bannerUrl: "https://media.rawg.io/media/games/4f9/4f9e56b89bf41c0b69dec7059fe22a24.jpg",
    developer: "Hazelight Studios", publisher: "Electronic Arts", releaseYear: 2021, avgRating: 4.8, ratingCount: 0,
    genres: ["platformer", "adventure"], tags: ["co-op", "multiplayer", "story-rich"],
    platforms: ["pc", "ps4", "ps5", "xbox-one", "xbox-series-x", "nintendo-switch"],
  },

  // ─── Simulation / Other ──────────────────────────────────────────────────
  {
    title: "Factorio",
    slug: "factorio",
    description: "Factorio is a game about building and creating automated factories to produce items of increasing complexity, within an infinite 2D world.",
    coverUrl: "https://media.rawg.io/media/games/d2e/d2e54f64f29cb7c32eedcb64d6f26e3a.jpg",
    bannerUrl: "https://media.rawg.io/media/games/d2e/d2e54f64f29cb7c32eedcb64d6f26e3a.jpg",
    developer: "Wube Software", publisher: "Wube Software", releaseYear: 2020, avgRating: 4.8, ratingCount: 0,
    genres: ["simulation", "strategy"], tags: ["singleplayer", "multiplayer", "co-op"],
    platforms: ["pc"],
  },
  {
    title: "Dave the Diver",
    slug: "dave-the-diver",
    description: "Dave the Diver is a casual, single-player adventure RPG featuring deep-sea exploration and sushi restaurant management.",
    coverUrl: "https://media.rawg.io/media/games/a45/a456a9e5e44c95869af43a6ffd7dba58.jpg",
    bannerUrl: "https://media.rawg.io/media/games/a45/a456a9e5e44c95869af43a6ffd7dba58.jpg",
    developer: "MINTROCKET", publisher: "MINTROCKET", releaseYear: 2023, avgRating: 4.4, ratingCount: 0,
    genres: ["adventure", "simulation", "indie"], tags: ["singleplayer", "story-rich"],
    platforms: ["pc", "nintendo-switch"],
  },
  {
    title: "Palworld",
    slug: "palworld",
    description: "Fight, farm, build and work alongside mysterious creatures called Pals. Use them to battle, build, farm and more in a world where violence is the only law.",
    coverUrl: "https://media.rawg.io/media/games/bf1/bf1e9f4c5aef8d18a9c7f2e7e9e9a9a8.jpg",
    bannerUrl: "https://media.rawg.io/media/games/bf1/bf1e9f4c5aef8d18a9c7f2e7e9e9a9a8.jpg",
    developer: "Pocketpair", publisher: "Pocketpair", releaseYear: 2024, avgRating: 4.0, ratingCount: 0,
    genres: ["action", "simulation"], tags: ["multiplayer", "co-op", "open-world", "singleplayer"],
    platforms: ["pc", "xbox-one", "xbox-series-x"],
  },
  {
    title: "Monster Hunter: World",
    slug: "monster-hunter-world",
    description: "Welcome to a new world! In Monster Hunter: World, the latest installment in the series, you can enjoy the ultimate hunting experience, using everything at your disposal to hunt monsters in a new world teeming with surprises and excitement.",
    coverUrl: "https://media.rawg.io/media/games/d4d/d4d9c19df8e45d2a1cc35dac2e15a96e.jpg",
    bannerUrl: "https://media.rawg.io/media/games/d4d/d4d9c19df8e45d2a1cc35dac2e15a96e.jpg",
    developer: "Capcom", publisher: "Capcom", releaseYear: 2018, avgRating: 4.5, ratingCount: 0,
    genres: ["action", "rpg"], tags: ["co-op", "multiplayer", "singleplayer", "open-world"],
    platforms: ["pc", "ps4", "xbox-one"],
  },
  {
    title: "Divinity: Original Sin 2",
    slug: "divinity-original-sin-2",
    description: "The Divine is dead. The Void approaches. And the powers lying dormant within you are soon to awaken. The battle for Divinity has begun. Choose wisely and trust sparingly; darkness lurks within every heart.",
    coverUrl: "https://media.rawg.io/media/games/424/424facd40f4eb1f2794fe4a576e4e813.jpg",
    bannerUrl: "https://media.rawg.io/media/games/424/424facd40f4eb1f2794fe4a576e4e813.jpg",
    developer: "Larian Studios", publisher: "Larian Studios", releaseYear: 2017, avgRating: 4.8, ratingCount: 0,
    genres: ["rpg", "strategy"], tags: ["co-op", "story-rich", "dark-fantasy", "singleplayer"],
    platforms: ["pc", "ps4", "xbox-one", "nintendo-switch"],
  },
  {
    title: "Control",
    slug: "control",
    description: "After a secretive agency in New York is invaded by an otherworldly threat, you become the new Director struggling to regain Control. From the developer of Max Payne and Alan Wake.",
    coverUrl: "https://media.rawg.io/media/games/2c0/2c098f3a3e7f18b5e0da0d64c1c3b29e.jpg",
    bannerUrl: "https://media.rawg.io/media/games/2c0/2c098f3a3e7f18b5e0da0d64c1c3b29e.jpg",
    developer: "Remedy Entertainment", publisher: "505 Games", releaseYear: 2019, avgRating: 4.3, ratingCount: 0,
    genres: ["action", "adventure"], tags: ["atmospheric", "singleplayer", "story-rich"],
    platforms: ["pc", "ps4", "ps5", "xbox-one", "xbox-series-x"],
  },
  {
    title: "Alan Wake 2",
    slug: "alan-wake-2",
    description: "Saga Anderson arrives to investigate ritualistic murders in a small town. Alan Wake is a writer trapped in a dark dimension, trying to write his way out.",
    coverUrl: "https://media.rawg.io/media/games/5bc/5bc7965fec7f9d79ead0e4b92a8ce6f4.jpg",
    bannerUrl: "https://media.rawg.io/media/games/5bc/5bc7965fec7f9d79ead0e4b92a8ce6f4.jpg",
    developer: "Remedy Entertainment", publisher: "Epic Games Publishing", releaseYear: 2023, avgRating: 4.5, ratingCount: 0,
    genres: ["horror", "adventure"], tags: ["atmospheric", "story-rich", "singleplayer"],
    platforms: ["pc", "ps5", "xbox-series-x"],
  },
  {
    title: "Hi-Fi Rush",
    slug: "hi-fi-rush",
    description: "Feel the beat as wannabe rockstar Chai and his ragtag team of rebels battle against an evil megacorp in a colorful, comic book world where everything pulses to the music.",
    coverUrl: "https://media.rawg.io/media/games/e95/e9588a6e79b8c06e4a9e7024bf42ad9f.jpg",
    bannerUrl: "https://media.rawg.io/media/games/e95/e9588a6e79b8c06e4a9e7024bf42ad9f.jpg",
    developer: "Tango Gameworks", publisher: "Bethesda Softworks", releaseYear: 2023, avgRating: 4.7, ratingCount: 0,
    genres: ["action", "platformer"], tags: ["singleplayer", "story-rich", "atmospheric"],
    platforms: ["pc", "xbox-series-x", "ps5"],
  },

  // ─── Recent Hits (2023–2025) ─────────────────────────────────────────────
  {
    title: "Balatro",
    slug: "balatro",
    description: "A hypnotically satisfying poker roguelite where you play illegal poker hands, discover game-changing jokers, and create wildly outrageous builds to make the perfect hand.",
    coverUrl: "https://media.rawg.io/media/games/5ea/5eafbde03bc30e9d5a3a9a5e0e3e0b43.jpg",
    bannerUrl: "https://media.rawg.io/media/games/5ea/5eafbde03bc30e9d5a3a9a5e0e3e0b43.jpg",
    developer: "LocalThunk", publisher: "Playstack", releaseYear: 2024, avgRating: 4.9, ratingCount: 0,
    genres: ["indie", "strategy"], tags: ["roguelike", "singleplayer"],
    platforms: ["pc", "ps5", "ps4", "xbox-series-x", "xbox-one", "nintendo-switch"],
  },
  {
    title: "Black Myth: Wukong",
    slug: "black-myth-wukong",
    description: "Black Myth: Wukong is an action RPG rooted in Chinese mythology. You shall set out as the Destined One to venture into the challenges and marvels ahead, to uncover the obscured truth beneath the veil of a glorious legend from the past.",
    coverUrl: "https://media.rawg.io/media/games/3f7/3f7eb23ee3da8f72a43988edf5855f34.jpg",
    bannerUrl: "https://media.rawg.io/media/games/3f7/3f7eb23ee3da8f72a43988edf5855f34.jpg",
    developer: "Game Science", publisher: "Game Science", releaseYear: 2024, avgRating: 4.6, ratingCount: 0,
    genres: ["action", "rpg"], tags: ["singleplayer", "story-rich", "atmospheric", "souls-like"],
    platforms: ["pc", "ps5"],
  },
  {
    title: "Astro Bot",
    slug: "astro-bot",
    description: "Astro Bot is a 3D platformer and the fourth game in the Astro Bot series. Players control Astro Bot through over 80 levels across six galaxies, rescuing PlayStation bots while encountering various PlayStation characters.",
    coverUrl: "https://media.rawg.io/media/games/a5b/a5b849e3e4b9f3f3a3a9e8e1b2c3d4e5.jpg",
    bannerUrl: "https://media.rawg.io/media/games/a5b/a5b849e3e4b9f3f3a3a9e8e1b2c3d4e5.jpg",
    developer: "Team Asobi", publisher: "Sony Interactive Entertainment", releaseYear: 2024, avgRating: 4.9, ratingCount: 0,
    genres: ["platformer", "adventure"], tags: ["singleplayer"],
    platforms: ["ps5"],
  },
  {
    title: "Metaphor: ReFantazio",
    slug: "metaphor-refantazio",
    description: "A fantasy world. A royal election. A young boy's wish. Embark on an epic quest with your companions in a medieval fantasy world shaped by fear and magic, and fight for a future free from discrimination.",
    coverUrl: "https://media.rawg.io/media/games/c6f/c6f3f2b3d8e9a1b4e7f8c2d1a5b6e9f2.jpg",
    bannerUrl: "https://media.rawg.io/media/games/c6f/c6f3f2b3d8e9a1b4e7f8c2d1a5b6e9f2.jpg",
    developer: "Atlus", publisher: "Sega", releaseYear: 2024, avgRating: 4.8, ratingCount: 0,
    genres: ["rpg", "strategy"], tags: ["story-rich", "singleplayer", "atmospheric"],
    platforms: ["pc", "ps5", "ps4", "xbox-series-x"],
  },
  {
    title: "Like a Dragon: Infinite Wealth",
    slug: "like-a-dragon-infinite-wealth",
    description: "Ichiban Kasuga travels to Hawaii in search of his mother, only to have his life turned upside down once again. This JRPG epic spans two continents and features both Ichiban and the legendary Kazuma Kiryu.",
    coverUrl: "https://media.rawg.io/media/games/d2c/d2c9f5e2a7b8e3d1c4a6f9b8e2d5a7c3.jpg",
    bannerUrl: "https://media.rawg.io/media/games/d2c/d2c9f5e2a7b8e3d1c4a6f9b8e2d5a7c3.jpg",
    developer: "Ryu Ga Gotoku Studio", publisher: "Sega", releaseYear: 2024, avgRating: 4.7, ratingCount: 0,
    genres: ["rpg", "action"], tags: ["story-rich", "singleplayer"],
    platforms: ["pc", "ps5", "ps4", "xbox-series-x", "xbox-one"],
  },
  {
    title: "Final Fantasy VII Rebirth",
    slug: "final-fantasy-vii-rebirth",
    description: "Cloud Strife and friends leave Midgar on a journey to stop Sephiroth from destroying the planet. The second part of the Final Fantasy VII Remake trilogy reimagines the classic RPG with a massive open world.",
    coverUrl: "https://media.rawg.io/media/games/e7c/e7c9f4d2b8a3f1c5e9b4d7a2c6f8e1b3.jpg",
    bannerUrl: "https://media.rawg.io/media/games/e7c/e7c9f4d2b8a3f1c5e9b4d7a2c6f8e1b3.jpg",
    developer: "Square Enix", publisher: "Square Enix", releaseYear: 2024, avgRating: 4.7, ratingCount: 0,
    genres: ["rpg", "action"], tags: ["story-rich", "open-world", "singleplayer", "atmospheric"],
    platforms: ["ps5", "pc"],
  },
  {
    title: "Helldivers 2",
    slug: "helldivers-2",
    description: "An explosive third-person co-op shooter where you and your squad spread democracy to the galaxy, one planet at a time. The Terminids and Automatons won't know what hit them.",
    coverUrl: "https://media.rawg.io/media/games/f4c/f4c9b2d7e1a8c3f6b9d4a7c2e5f8b1d4.jpg",
    bannerUrl: "https://media.rawg.io/media/games/f4c/f4c9b2d7e1a8c3f6b9d4a7c2e5f8b1d4.jpg",
    developer: "Arrowhead Game Studios", publisher: "Sony Interactive Entertainment", releaseYear: 2024, avgRating: 4.5, ratingCount: 0,
    genres: ["shooter", "action"], tags: ["co-op", "multiplayer", "sci-fi"],
    platforms: ["pc", "ps5"],
  },
  {
    title: "Armored Core VI: Fires of Rubicon",
    slug: "armored-core-vi-fires-of-rubicon",
    description: "FromSoftware's mech action series returns. Pilot a fully customizable Armored Core through a devastated world, engage in intense combat, and uncover the truth behind Rubicon's coral energy source.",
    coverUrl: "https://media.rawg.io/media/games/c3b/c3b5a8d1f7e2a9c4b6d8f1a3c7e5b9d2.jpg",
    bannerUrl: "https://media.rawg.io/media/games/c3b/c3b5a8d1f7e2a9c4b6d8f1a3c7e5b9d2.jpg",
    developer: "FromSoftware", publisher: "Bandai Namco", releaseYear: 2023, avgRating: 4.5, ratingCount: 0,
    genres: ["action"], tags: ["singleplayer", "atmospheric", "sci-fi"],
    platforms: ["pc", "ps5", "ps4", "xbox-series-x", "xbox-one"],
  },
  {
    title: "Lies of P",
    slug: "lies-of-p",
    description: "Lies of P is an action RPG soulslike game based on the story of Pinocchio. Set in the dark, Belle Époque-inspired city of Krat, play as P and fight your way through legions of twisted machines and corrupt humans.",
    coverUrl: "https://media.rawg.io/media/games/a4c/a4c8b3e2f9d1c7b5a8e3d6f2b9c4a7e5.jpg",
    bannerUrl: "https://media.rawg.io/media/games/a4c/a4c8b3e2f9d1c7b5a8e3d6f2b9c4a7e5.jpg",
    developer: "Round8 Studio", publisher: "Neowiz", releaseYear: 2023, avgRating: 4.4, ratingCount: 0,
    genres: ["action", "rpg"], tags: ["souls-like", "atmospheric", "story-rich", "singleplayer"],
    platforms: ["pc", "ps5", "ps4", "xbox-series-x", "xbox-one"],
  },

  // ─── Classics / Must-Plays ───────────────────────────────────────────────
  {
    title: "Portal 2",
    slug: "portal-2",
    description: "Portal 2 draws from the award-winning formula of innovative gameplay, story, and music that earned the original Portal over 70 industry accolades and created one of gaming's most beloved characters.",
    coverUrl: "https://media.rawg.io/media/games/328/3283617cb7d75d67257fc58339188742.jpg",
    bannerUrl: "https://media.rawg.io/media/games/328/3283617cb7d75d67257fc58339188742.jpg",
    developer: "Valve", publisher: "Valve", releaseYear: 2011, avgRating: 4.9, ratingCount: 0,
    genres: ["puzzle", "adventure"], tags: ["co-op", "story-rich", "singleplayer", "sci-fi", "atmospheric"],
    platforms: ["pc", "ps4", "xbox-one"],
  },
  {
    title: "NieR: Automata",
    slug: "nier-automata",
    description: "NieR: Automata tells the story of androids 2B, 9S and A2 and their battle to reclaim the machine-driven dystopia overrun by powerful machines. A brilliant blend of action and existential philosophy.",
    coverUrl: "https://media.rawg.io/media/games/fc1/fc1db56efb85c01e2b37eb31a60c8640.jpg",
    bannerUrl: "https://media.rawg.io/media/games/fc1/fc1db56efb85c01e2b37eb31a60c8640.jpg",
    developer: "PlatinumGames", publisher: "Square Enix", releaseYear: 2017, avgRating: 4.8, ratingCount: 0,
    genres: ["action", "rpg"], tags: ["story-rich", "singleplayer", "atmospheric", "sci-fi"],
    platforms: ["pc", "ps4", "xbox-one", "nintendo-switch"],
  },
  {
    title: "Persona 5 Royal",
    slug: "persona-5-royal",
    description: "Persona 5 Royal is a JRPG about a group of teenagers who discover the power to enter a supernatural realm and steal hearts of corrupted adults. The definitive edition adds new story content, mechanics, and a semester.",
    coverUrl: "https://media.rawg.io/media/games/b11/b11127b9ee3c3701bd15b9af3286d20e.jpg",
    bannerUrl: "https://media.rawg.io/media/games/b11/b11127b9ee3c3701bd15b9af3286d20e.jpg",
    developer: "Atlus", publisher: "Sega", releaseYear: 2019, avgRating: 4.9, ratingCount: 0,
    genres: ["rpg"], tags: ["story-rich", "singleplayer", "atmospheric"],
    platforms: ["pc", "ps4", "ps5", "xbox-series-x", "xbox-one", "nintendo-switch"],
  },
  {
    title: "The Last of Us Part II",
    slug: "the-last-of-us-part-ii",
    description: "Five years after their dangerous journey across the post-pandemic United States, Ellie and Joel have settled down in Jackson, Wyoming. When a violent event disrupts that peace, Ellie embarks on a relentless journey to carry out justice.",
    coverUrl: "https://media.rawg.io/media/games/909/909974d1c7863c2027241e265fe7011f.jpg",
    bannerUrl: "https://media.rawg.io/media/games/909/909974d1c7863c2027241e265fe7011f.jpg",
    developer: "Naughty Dog", publisher: "Sony Interactive Entertainment", releaseYear: 2020, avgRating: 4.5, ratingCount: 0,
    genres: ["action", "adventure"], tags: ["story-rich", "post-apocalyptic", "atmospheric", "singleplayer"],
    platforms: ["ps4", "ps5"],
  },
  {
    title: "Journey",
    slug: "journey",
    description: "Travel through a vast and melancholy world — alone or with a stranger you meet along the way. One of the most beautiful and emotionally resonant games ever created. No words needed.",
    coverUrl: "https://media.rawg.io/media/games/e6d/e6dfb1de69d5e72e2ff1d2f56a26e338.jpg",
    bannerUrl: "https://media.rawg.io/media/games/e6d/e6dfb1de69d5e72e2ff1d2f56a26e338.jpg",
    developer: "thatgamecompany", publisher: "Sony Interactive Entertainment", releaseYear: 2012, avgRating: 4.7, ratingCount: 0,
    genres: ["adventure", "indie"], tags: ["atmospheric", "singleplayer", "co-op"],
    platforms: ["pc", "ps4", "ps5"],
  },
  {
    title: "Returnal",
    slug: "returnal",
    description: "Break the cycle of chaos in an ever-changing third-person shooter. Stranded on a shape-shifting alien planet, Selene must search through the barren landscape of an ancient civilization for her escape.",
    coverUrl: "https://media.rawg.io/media/games/a52/a52e9b97c27f920c66c9f9f9f5e55d13.jpg",
    bannerUrl: "https://media.rawg.io/media/games/a52/a52e9b97c27f920c66c9f9f9f5e55d13.jpg",
    developer: "Housemarque", publisher: "Sony Interactive Entertainment", releaseYear: 2021, avgRating: 4.5, ratingCount: 0,
    genres: ["shooter", "action"], tags: ["roguelike", "atmospheric", "sci-fi", "singleplayer", "souls-like"],
    platforms: ["ps5", "pc"],
  },
  {
    title: "Yakuza 0",
    slug: "yakuza-0",
    description: "The glitz, glamour, and unbridled decadence of the 80s are back in Yakuza 0. A prequel story set in 1988 Japan, featuring a young Kazuma Kiryu and Goro Majima before they became legends of the yakuza.",
    coverUrl: "https://media.rawg.io/media/games/c5c/c5c7fb5b0e5f7b8d9a4c3e7f2b1d9a6c.jpg",
    bannerUrl: "https://media.rawg.io/media/games/c5c/c5c7fb5b0e5f7b8d9a4c3e7f2b1d9a6c.jpg",
    developer: "Ryu Ga Gotoku Studio", publisher: "Sega", releaseYear: 2015, avgRating: 4.7, ratingCount: 0,
    genres: ["action", "adventure", "rpg"], tags: ["story-rich", "singleplayer"],
    platforms: ["pc", "ps4", "xbox-one", "nintendo-switch"],
  },
  {
    title: "Monster Hunter Rise",
    slug: "monster-hunter-rise",
    description: "Set in the ninja-inspired Kamura Village, take on quests to slay or capture monsters using a variety of weapons and the new Wirebug traversal mechanic. Team up with Palico and Palamute companions.",
    coverUrl: "https://media.rawg.io/media/games/7e0/7e0e5a0c2e8d7b3f9a5c4d8e2b6f1a9e.jpg",
    bannerUrl: "https://media.rawg.io/media/games/7e0/7e0e5a0c2e8d7b3f9a5c4d8e2b6f1a9e.jpg",
    developer: "Capcom", publisher: "Capcom", releaseYear: 2021, avgRating: 4.5, ratingCount: 0,
    genres: ["action", "rpg"], tags: ["co-op", "multiplayer", "singleplayer"],
    platforms: ["pc", "nintendo-switch", "ps5", "ps4", "xbox-series-x", "xbox-one"],
  },
  {
    title: "Fire Emblem: Three Houses",
    slug: "fire-emblem-three-houses",
    description: "You are a professor at the Officers Academy at Garreg Mach Monastery, where three houses of students from rival nations study. Choose a house and lead your students through school life, battles, and a war that will decide the fate of Fódlan.",
    coverUrl: "https://media.rawg.io/media/games/9fd/9fd6fd4d4f56a85fbcdb6f0f97f63e17.jpg",
    bannerUrl: "https://media.rawg.io/media/games/9fd/9fd6fd4d4f56a85fbcdb6f0f97f63e17.jpg",
    developer: "Intelligent Systems", publisher: "Nintendo", releaseYear: 2019, avgRating: 4.7, ratingCount: 0,
    genres: ["strategy", "rpg"], tags: ["story-rich", "singleplayer"],
    platforms: ["nintendo-switch"],
  },
  {
    title: "Vampire Survivors",
    slug: "vampire-survivors",
    description: "A time survival game with rogue-lite elements where your choices can allow you to quickly snowball against the hundreds of monsters that get thrown at you.",
    coverUrl: "https://media.rawg.io/media/games/a3b/a3be98acbfdb3a1a7c3d2e8f6a9d4c7b.jpg",
    bannerUrl: "https://media.rawg.io/media/games/a3b/a3be98acbfdb3a1a7c3d2e8f6a9d4c7b.jpg",
    developer: "poncle", publisher: "poncle", releaseYear: 2022, avgRating: 4.7, ratingCount: 0,
    genres: ["indie", "action"], tags: ["roguelike", "singleplayer", "pixel-art"],
    platforms: ["pc", "ps5", "ps4", "xbox-series-x", "xbox-one", "nintendo-switch"],
  },
  {
    title: "Sifu",
    slug: "sifu",
    description: "A third-person brawler featuring realistic martial arts combat. You are the last disciple of a great Kung Fu master, hunting the criminals responsible for your father's death. Each time you die, you age — and time is running out.",
    coverUrl: "https://media.rawg.io/media/games/d56/d5641e7c8d32e6c8e3e4b9a7c3f5d1e8.jpg",
    bannerUrl: "https://media.rawg.io/media/games/d56/d5641e7c8d32e6c8e3e4b9a7c3f5d1e8.jpg",
    developer: "Sloclap", publisher: "Sloclap", releaseYear: 2022, avgRating: 4.4, ratingCount: 0,
    genres: ["action", "indie"], tags: ["singleplayer", "atmospheric"],
    platforms: ["pc", "ps5", "ps4", "xbox-series-x", "xbox-one", "nintendo-switch"],
  },
  {
    title: "Sea of Stars",
    slug: "sea-of-stars",
    description: "A turn-based RPG inspired by the classics, telling the story of two Children of the Solstice who will combine the powers of the sun and moon to perform Eclipse Magic, the only force capable of fending off the monstrous creations of alchemist Fleshmancer.",
    coverUrl: "https://media.rawg.io/media/games/a2e/a2e7c5d3b4f8a1c9e7d5b3a4c6e8f1d2.jpg",
    bannerUrl: "https://media.rawg.io/media/games/a2e/a2e7c5d3b4f8a1c9e7d5b3a4c6e8f1d2.jpg",
    developer: "Sabotage Studio", publisher: "Sabotage Studio", releaseYear: 2023, avgRating: 4.5, ratingCount: 0,
    genres: ["rpg", "indie"], tags: ["story-rich", "singleplayer", "co-op", "pixel-art"],
    platforms: ["pc", "ps5", "ps4", "xbox-series-x", "xbox-one", "nintendo-switch"],
  },
];

async function main() {
  console.log("🌱 Seeding GameLog database...");

  for (const genre of genres) {
    await prisma.genre.upsert({ where: { slug: genre.slug }, update: {}, create: genre });
  }
  console.log(`✅ Seeded ${genres.length} genres`);

  for (const tag of tags) {
    await prisma.tag.upsert({ where: { slug: tag.slug }, update: {}, create: tag });
  }
  console.log(`✅ Seeded ${tags.length} tags`);

  for (const platform of platforms) {
    await prisma.platform.upsert({ where: { slug: platform.slug }, update: {}, create: platform });
  }
  console.log(`✅ Seeded ${platforms.length} platforms`);

  for (const game of games) {
    const { genres: gameGenres, tags: gameTags, platforms: gamePlatforms, ...gameData } = game;

    const created = await prisma.game.upsert({
      where: { slug: gameData.slug },
      update: {},
      create: gameData,
    });

    for (const genreSlug of gameGenres) {
      const genre = await prisma.genre.findUnique({ where: { slug: genreSlug } });
      if (genre) {
        await prisma.gameGenre.upsert({
          where: { gameId_genreId: { gameId: created.id, genreId: genre.id } },
          update: {}, create: { gameId: created.id, genreId: genre.id },
        });
      }
    }

    for (const tagSlug of gameTags) {
      const tag = await prisma.tag.findUnique({ where: { slug: tagSlug } });
      if (tag) {
        await prisma.gameTag.upsert({
          where: { gameId_tagId: { gameId: created.id, tagId: tag.id } },
          update: {}, create: { gameId: created.id, tagId: tag.id },
        });
      }
    }

    for (const platformSlug of gamePlatforms) {
      const platform = await prisma.platform.findUnique({ where: { slug: platformSlug } });
      if (platform) {
        await prisma.gamePlatform.upsert({
          where: { gameId_platformId: { gameId: created.id, platformId: platform.id } },
          update: {}, create: { gameId: created.id, platformId: platform.id },
        });
      }
    }
  }
  console.log(`✅ Seeded ${games.length} games`);

  // Demo users
  const demoUsers = [
    {
      username: "playerone", email: "playerone@gamelog.dev", name: "Player One",
      bio: "Hardcore gamer since the NES era. Currently obsessed with FromSoftware games.",
      avatarUrl: "https://ui-avatars.com/api/?name=Player+One&background=6c63ff&color=fff",
      password: "password123",
    },
    {
      username: "questmaster", email: "questmaster@gamelog.dev", name: "Quest Master",
      bio: "RPG enthusiast and completionist. I've sunk 2000+ hours into The Witcher 3.",
      avatarUrl: "https://ui-avatars.com/api/?name=Quest+Master&background=f5c518&color=000",
      password: "password123",
    },
    {
      username: "indiegem", email: "indiegem@gamelog.dev", name: "Indie Gem",
      bio: "Supporting indie devs one purchase at a time. Hollow Knight changed my life.",
      avatarUrl: "https://ui-avatars.com/api/?name=Indie+Gem&background=4caf50&color=fff",
      password: "password123",
    },
  ];

  const createdUsers = [];
  for (const userData of demoUsers) {
    const { password, ...rest } = userData;
    const passwordHash = await bcrypt.hash(password, 10);
    const user = await prisma.user.upsert({
      where: { email: rest.email }, update: {}, create: { ...rest, passwordHash },
    });
    createdUsers.push(user);
  }
  console.log(`✅ Seeded ${demoUsers.length} demo users`);

  // Reviews
  const allGames = await prisma.game.findMany();
  const sampleReviews = [
    { userIdx: 0, gameSlug: "elden-ring", content: "A masterpiece of open-world design. Every corner of the Lands Between feels handcrafted. The combat is punishing but fair, and the sense of discovery is unlike anything I've experienced. FromSoftware's magnum opus.", rating: 5.0 },
    { userIdx: 1, gameSlug: "the-witcher-3-wild-hunt", content: "Still the gold standard for narrative RPGs. The writing, the world, the characters — Geralt's final adventure remains unmatched nearly a decade later. Blood and Wine alone is worth the price of admission.", rating: 5.0 },
    { userIdx: 2, gameSlug: "hollow-knight", content: "Team Cherry created something truly special. The atmosphere is haunting, the gameplay is tight, and the lore is endlessly fascinating. One of the best games ever made for $15.", rating: 5.0 },
    { userIdx: 0, gameSlug: "hades", content: "Redefines what a roguelike can be. The storytelling through gameplay loops is genius — each run reveals more of the narrative. I completed it three times and still wanted more.", rating: 4.5 },
    { userIdx: 1, gameSlug: "baldurs-gate-3", content: "The most ambitious RPG ever made. Larian Studios delivered on every promise. The writing rivals The Witcher 3, the combat is deep, and the reactivity is astounding. Game of a generation.", rating: 5.0 },
    { userIdx: 2, gameSlug: "stardew-valley", content: "One person made this. Let that sink in. Stardew Valley is pure comfort gaming. Whether you're farming, mining, or romancing villagers, it's impossible not to smile.", rating: 4.5 },
    { userIdx: 0, gameSlug: "disco-elysium", content: "Not really a game — it's an interactive novel that happens to be the most creative RPG ever made. The skill system is genius. Harry Du Bois is one of fiction's greatest characters.", rating: 4.5 },
    { userIdx: 1, gameSlug: "cyberpunk-2077", content: "After Phantom Liberty and the 2.0 update, this game finally lives up to its potential. Night City is one of gaming's greatest achievements in world-building.", rating: 4.0 },
    { userIdx: 2, gameSlug: "bloodborne", content: "The gothic atmosphere is unmatched. Yharnam is one of the most memorable game worlds ever crafted. The beast hunting gameplay loop is addictive and terrifying in equal measure.", rating: 5.0 },
    { userIdx: 0, gameSlug: "sekiro-shadows-die-twice", content: "The most satisfying combat system in any FromSoftware game. Parrying feels incredible when it clicks. The Japan setting is gorgeous and the boss fights are pure artistry.", rating: 4.5 },
    { userIdx: 1, gameSlug: "it-takes-two", content: "Played this with my partner and we were blown away. Best co-op game ever made, period. The variety of gameplay ideas is staggering — every chapter introduces something fresh.", rating: 5.0 },
    { userIdx: 2, gameSlug: "celeste", content: "A masterpiece of precision platforming wrapped around a deeply human story about mental health. The assist mode shows true respect for all kinds of players.", rating: 5.0 },
    { userIdx: 0, gameSlug: "the-legend-of-zelda-breath-of-the-wild", content: "Changed what open world games could be. The physics sandbox and sense of discovery make every moment feel like exploration. Nintendo at their absolute best.", rating: 4.8 },
    { userIdx: 1, gameSlug: "deep-rock-galactic", content: "The best co-op shooter available. Rock and Stone! Every class feels distinct, the procedural caves never get old, and the community is genuinely one of the nicest in gaming.", rating: 4.5 },
    { userIdx: 2, gameSlug: "hi-fi-rush", content: "Nobody saw this coming. Tango Gameworks made the most joyful, stylish action game in years. The rhythm combat feels incredible once it clicks, and the art direction is stunning.", rating: 4.5 },
  ];

  for (const review of sampleReviews) {
    const user = createdUsers[review.userIdx];
    const game = allGames.find((g) => g.slug === review.gameSlug);
    if (!user || !game) continue;

    await prisma.review.upsert({
      where: { userId_gameId: { userId: user.id, gameId: game.id } },
      update: {},
      create: { content: review.content, rating: review.rating, userId: user.id, gameId: game.id },
    });
    await prisma.rating.upsert({
      where: { userId_gameId: { userId: user.id, gameId: game.id } },
      update: { value: review.rating },
      create: { value: review.rating, userId: user.id, gameId: game.id },
    });
  }
  console.log(`✅ Seeded ${sampleReviews.length} reviews`);

  // Follow relationships
  const followPairs = [
    [0, 1], [1, 0], [2, 0], [0, 2],
  ];
  for (const [a, b] of followPairs) {
    await prisma.follow.upsert({
      where: { followerId_followingId: { followerId: createdUsers[a].id, followingId: createdUsers[b].id } },
      update: {},
      create: { followerId: createdUsers[a].id, followingId: createdUsers[b].id },
    });
  }
  console.log("✅ Seeded follow relationships");

  // Sample lists
  const lists = [
    {
      id: "seed-list-1",
      title: "Essential RPGs — The Definitive List",
      description: "The RPGs you absolutely must play before you die. Ranked by narrative depth and world-building quality.",
      userId: createdUsers[1].id,
      gameSlugs: ["baldurs-gate-3", "the-witcher-3-wild-hunt", "disco-elysium", "elden-ring", "divinity-original-sin-2", "mass-effect-legendary-edition"],
    },
    {
      id: "seed-list-2",
      title: "Best FromSoftware Games Ranked",
      description: "Every Soulsborne game ranked from best to slightly less best. All of them are masterpieces.",
      userId: createdUsers[0].id,
      gameSlugs: ["elden-ring", "bloodborne", "sekiro-shadows-die-twice", "dark-souls-iii"],
    },
    {
      id: "seed-list-3",
      title: "Perfect Indie Games",
      description: "Small team, massive impact. These indie titles punch far above their weight.",
      userId: createdUsers[2].id,
      gameSlugs: ["hollow-knight", "hades", "celeste", "undertale", "stardew-valley", "cuphead", "terraria"],
    },
  ];

  for (const list of lists) {
    const { gameSlugs, ...listData } = list;
    await prisma.list.upsert({
      where: { id: listData.id }, update: {},
      create: { ...listData, isPublic: true },
    });
    for (let i = 0; i < gameSlugs.length; i++) {
      const game = allGames.find((g) => g.slug === gameSlugs[i]);
      if (!game) continue;
      await prisma.listItem.upsert({
        where: { listId_gameId: { listId: listData.id, gameId: game.id } },
        update: {},
        create: { listId: listData.id, gameId: game.id, position: i + 1 },
      });
    }
  }
  console.log(`✅ Seeded ${lists.length} sample lists`);

  console.log("\n🎮 GameLog database seeded successfully!");
  console.log(`   ${games.length} games · ${sampleReviews.length} reviews · ${demoUsers.length} users`);
  console.log("\nDemo accounts:");
  for (const u of demoUsers) {
    console.log(`  ${u.email} / ${u.password}`);
  }
}

main()
  .catch((e) => { console.error(e); process.exit(1); })
  .finally(() => prisma.$disconnect());
