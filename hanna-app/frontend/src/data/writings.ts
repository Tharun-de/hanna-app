export interface WritingData {
  id: string;
  title?: string; // title is optional as seen in some original data, keep it optional
  content: string;
  sectionId?: string; // Add sectionId as optional
  mood?: string;      // Added from AdminPage.Writing
  date?: string;      // Added from AdminPage.Writing
  likes?: number;     // Added from AdminPage.Writing
}

// Export an array instead of an object
export const allWritings: WritingData[] = [
  {
    id: "loveAndPain",
    title: "Love and Pain",
    content: `You just don't understand what it is to suffer until you've been on your knees, struggling to get some air into your lungs as the hurt they've caused you constricts your throat like a noose, squeezing out every sliver of hope left in you to survive. Often, people get away with hurting you. So easily. But as a victim, you're left by yourself crawling to discover mechanisms to cope through. We live in an oddly built world where if you speak out loudly about your hurt, you're labelled weak or attention seeking and if you bury it silently without having to deal with it, you're labelled a coward.\n\nLove - the cause of all hurt. If you don't love, you can't be hurt. But if you aren't loved, then you certainly are hurting. It makes you shut out everything and everyone for so long that the empty feeling of vulnerability sweeps across your chest every now and then, reminding you of what usually follows close behind love- pain. Pain is the root of all anguish. Pain is what pushes you to an edge. You stand on the edge of the cliff, praying that someone will find you and stop you from the free fall at the same time wishing that no one is there to witness your spiral. Pain is a paradox within itself. As various situations roll out in front of you at your lowest, the pain chips at your soul piece by piece and continues to feed off of it until there's no distinct piece of you as an individual left. You have no idea running through your mind except praying that it's not too late to climb back. The mediocre existence of the flesh seems to be in vain when you lose what makes you YOU. As hurt storms into your life without your knowledge, knocking down the walls you've built around your heart and trying to rear its head and prove its presence at every step of your way, it makes you lose hope. And loss of hope means the death of the soul.`
  },
  {
    id: "cosmicSerendipity",
    title: "Cosmic Serendipity",
    content: `As the setting sun paints the sky pink,\nI blow tenderly on my diary to dry the ink.\nBeautiful phrases drip down my pen,\nAs I reminisce the glimpses of heaven.\nI look at the clouds and ask myself,\nIs there anything more beautiful than this?\nMy skin replies, "His touch, my darling,\nThe touch that glides so tenderly."\n\nSolitude surrounds the dark night,\nAs the headlights of his car glow bright.\nThe midnight skies come alive,\nAs the love equations we derive.\nI look at the moon and ask myself,\nIs there anything more beautiful than this?\nMy eyes reply, "His smile, my darling,\nThe smile that intoxicates you so warmly."\n\nA love so theoretical,\nA chemistry so rhetorical…\nAn obsession so twisted;\nAn addiction so hardly resisted…\nFalling, drowning and fiending...\nIn this cosmic serendipity,\nI find hope and its meaning…`
  },
  {
    id: "morphedLove",
    title: "Morphed Love",
    content: `Hungry for one more of the devil's kiss\nGladly satiated in the erotic bliss\nLike the softest caress of a feather \nHe touches me and I wither...\n\nAs these feelings push me off the cliff\nI plunge into oblivion as I catch his whiff \nTrusting his arms to catch me in the dive\nHoping my rotten heart is now alive\n\nKissing under the stars that barely glow\nA language only our hearts know\nA passion only our souls recognise \nUndying devotion for him, I now realise\n\nThis fire burning between him and me\nSo, is this how love is supposed to be?`
  },
  {
    id: "femininePower",
    title: "Feminine Power",
    content: `Born as a baby girl,\nTo be a woman I am raised,\nDeeply loved, cared and embraced...\n\nYet, not all places were a haven...\nGroped on the streets,\nEnslaved on the sheets,\nBelittled in the crowd,\nFear of being wrapped in the shroud...\nI screamed and begged everyone in my view\nTo come for my rescue\n\nAnd when no one did,\nI stood on my own feet\nI held my head high, shoulders squared\nI've taught myself, for nothing I shall be afraid\nI'm a wizard, I'm the magic\nI'm the moment, I'm unique\n\nThere's nothing in this world as special as a woman\nWe hold the power to bring in lives\nWe are not just meant to be mere wives\nIn being a woman, I take vanity\nWe become tough, learning from calamity`
  },
  {
    id: "hellsFury",
    title: "Hell's Fury",
    content: `I have loved you from the start\nMiles of distance never kept us apart\nWaiting for you with presumed opinion\nMy mind slipping into innocent oblivion\n\nAnd now you say you never loved me \nAll the infatuation was just an illusion \nYou've filled my mind with commotion\n\nYet...\nYou aren't too late to find your next prey \nAnd I see red when I see her hips sway \nYour hands explore her in front of me \nAnd I want to explode because it isn't me\n\nThis is all a game to you\nAnd I should have warned\nDarling, I bet you never knew\nHell, hath no fury like a woman scorned`
  },
  {
    id: "yearning",
    title: "When My Yearning Found a Home",
    content: `I've waited for you for so long\nA trepidant yearning for where I belong\nAs hopelessness now earns a quick demise \nI find my home in the depths of your eyes\n\nAnd now we're looking at the same moon \nWe're kissing under the same stars\nYou're holding me here in your arms\nAs you trail sweet kisses over my palms\n\nWriting poems on my skin with your tongue\nMarking me yours as you grip my hip \nLike the filthiest lyrics in the sweetest song \nAll of my carnal screams you lazily sip\n\nI would empty my veins for you to fill me\nI drown in your touch and I forget to breathe\nPawns of cosmic destiny, you've found me\nThis little soul of mine, for you, I unsheathe`
  },
  {
    id: "fireAndIce",
    title: "The Song of Fire and Ice",
    content: `They don't see what I see when I look into your eyes\nThe fire inside you burns my soul like a surprise\n\nAlways the poet, but never the muse\nBut under your gaze, I turn into poetry\nAlways a want, but never the need \nBut within your touch, I find an alchemy\n\nWhispered promises under the stars\nFilthy desires erasing my scars\nWith a passion that transcends all acrimony\nOur bodies collide in a perfect symphony \n\nThey don't see what I see when I look into your eyes\nYou and I forever dance to the song of fire and ice`
  },
  {
    id: "fickleHeart",
    title: "Fickle, Frail Heart",
    content: `Oh fickle, frail heart\nYou'll never learn\nThe love that you chase\nWill only let you burn\n\nThe world is never ready for the way you love\nSo full passion and a blazing intensity\nThe world can never measure the way you love \nSo full of warmth and a searing absurdity \n\nThere is love in holding,\nThere is love in letting go...\nSo sometimes I hold him like he's the air I breathe,\nAnd sometimes I let go because it hurts like a knife out of sheath...\n\nAnd so, when I say I love you, \nHe'll never fathom its weight \nFor a love like this,\nAn eternity is worth the wait...`
  },
  {
    id: "oneNight",
    title: "One Night of Bliss",
    content: `Let's kiss for once and say goodbye\nI'd want to see you again \nBut my desires will feel awry\n\nSkeptic hearts trying to get a feel\nYou look at me and my layers start to peel\nUnsteady hands trying to steal a hold\nYou touch me and my dreams turn to real\n\nWith a passion that burns my soul\nOne night of bliss, we get high on the roll\nLet's make love and say goodbye\nThe ghost of our intimacy\nI'll forever testify`
  },
  {
    id: "unquenchedFire",
    title: "Unquenched Fire",
    content: `Into the eternal void of darkness\nAs the smoke flows out of my lips\nFeral thoughts, hard to harness\nCause a familiar tingling in my hips\n\nI shut my eyes, breathe in and out deeply\nWilling myself not to surrender \nTo those stealthy thoughts creeping slowly\n\nEngulfed within the crutches of lonesome\nI stand alone on the verge of falling\nOverwhelming chills, warmth defying\nI keep thinking all the time and then some\n\nI burn with fire\nA passion that fills my entire\nBut your absence pours down\nIn your memories, I'll forever drown`
  },
  {
    id: "fictitiousDreams",
    title: "Fictitious Dreams",
    content: `I once read a quote that said, "Truth is strange, often stranger than fiction." But there is also another that says, "The truth shall set you free." How strange it is that we seek fictional stories, scenarios and happenings to escape from reality when accepting the reality is what brings peace to our mind. While fiction offers us a window of freedom where we can envision all our fantasies, reality brings us back like the sound of raindrops against that very window. We are engulfed in this conflict between fiction and truth, therefore blurring the fine line that separates them. Sometimes both of those words are so inextricably meshed within the deepest seats of our minds and it takes us a moment to differentiate what is what.\n\nFiction brings with it the freedom to write down your own versions of life, helping us wipe the burdens of reality. We so hopelessly cling to this freedom so that we can take a minute to catch our breath in this hustling and bustling world. And in that process, we often attribute physical traits to the word – freedom and tend to forget the mental, emotional and spiritual dimensions of it. Freedom isn't just the ability to utilize free will without someone questioning it. Freedom begins right at the conception of such will - where your mind isn't being questioned in the first place. Right at this juncture is a conundrum born. 'What about conscience?' Are we truly free if we have our conscience questioning each of our decisions, weighing the pros and cons, tailoring our paths to perfection? Aren't we all somehow tied up by the shackles of our conscience? So in that case when do we have true freedom?`
  },
  {
    id: "ghostOfSpark",
    title: "Ghost of a Spark",
    content: `Looking up at the place where we found each other,\nSo at peace even though we have a million things to bother.\n\nWe take a small walk and stop to smoke,\nWe look into each other's eyes,\nAnd unholy thoughts start to evoke.\n\nThen,\nYou almost forget,\nTo light my cigarette,\nSo, I stand there looking at you with a smile,\nAnd it takes you a little while,\nYou pull out the lighter,\nThe flame between us burns brighter.\n\nBut now,\nIntimacy feels like a distant fantasy,\nTouching someone else feels like heresy,\nOh, how the nights feel so bleak without you,\nAll these raging desires, I fight to bid adieu.`
  },
  {
    id: "calmInStorm",
    title: "The Calm in the Storm",
    content: `Walking into a raging storm,\nJust to find some solace,\nI step out of this void I built myself,\nAway from the haunting tranquil space.\n\nThe deafening silence tears me apart,\nI'm left with nothing but racing thoughts,\nSo I seek comfort in the storm,\nThe roars that rip my notions into noughts.\n\nNow my mind carries a vacuum,\nThe murderous storm,\nFills my lungs with a poisonous fume,\nI find peace within the thunder,\nThe thrilling fear,\nFills my blood with awe and wonder.\n\nI am changed through this very storm,\nI surpass the crutches of the worldly norm,\nDare not ask me why I walk in silence,\nThe boisterous storm within me,\nJust makes infinite sense.`
  },
  {
    id: "poisonedSanctuary",
    title: "Poisoned Sanctuary",
    content: `You touch me,\nLike I'm everything you asked God for,\nI feel you within,\nLike you are the world's greatest wonder.\n\nYour presence lingers in my heart,\nA memory of the bloodiest kiss,\nPiercing my body like the sharpest dart,\nA fantasy of the eternal bliss.\n\nA sugar-coated poison,\nI look at you and lose my poise and,\nIn the darkest night like a beacon,\nIn your embrace I'm strengthened.`
  },
  {
    id: "loseToLove",
    title: "Lose You to Love Me",
    content: `Fighting with you, for you,\nYet I fight with my own self,\nWithout you, my mind is askew,\nI am nothing but a shell.\n\nThe allure of romance,\nOverpowering my reason,\nYour silent demands,\nOverindulging my season.\n\nHow many times do I have to lose,\nBefore I can love?\nHow many hurts do I have to endure,\nBefore I can move?\n\nEvery moment I've been holding on,\nYou've only drained my energy,\nYou've crushed my spirit,\nMade my mind creep into lethargy.\n\nI have missed you,\nMuch longer than I've last kissed you,\nNow I just wait and hope,\nThat my mornings won't start with you.`
  },
  {
    id: "redemption",
    title: "Redemption from Reverie",
    content: `As the mediocre desires of flesh,\nRot me from within,\nThe umpteen demands rise afresh,\nAnd ruin me into nothing.\n\nAs the sizzling lust tethers to my skin,\nDrowning me deeper into the ocean,\nI lap around with flailing hands,\nTrying to get air into my lungs,\nWondering where my existence belongs,\nAnd so, I fail to see what I've become...\n\nDrenched in reverie,\nWith a heart filled with agony,\nUnable to conjure some bravery,\nI yearn to make out of this gluttony,\nCan't you see?\nI don't want you to give up on me...`
  },
  {
    id: "loveAndPainWillCome",
    title: "Love Will Come and So Will Pain",
    content: `Without love,\nThere's no pain...\nI've wandered cities,\nRummaged through towns,\nLove is absent but not pain,\nAnd all my efforts were just in vain…\n\nWithout pain,\nThere's no love…\nI've trusted blindly,\nSacrificed my heart and sanity,\nPain is present but not love,\nAnd I pray for solace to the God above.\n\nBut I know that one day,\nLove will come and so will pain,\nLove will hurt and pain will slay,\nLove will hold with sweet things said,\nPain will kiss with gestures unmade.`
  },
  {
    id: "killingMyFlesh",
    title: "Killing My Flesh",
    content: `As the agony tears apart my strength,\nAs the anguish steals my breath,\nAs I latch on to the crutches of hope,\nTrying not to fall on the steep slope.\n\nI lay on my bed in suffering,\nInfinite thoughts in my brain swirling,\nI search everywhere for a company,\nFailing at it, I feel so lonely.\n\nShame on me, shame on my sanity,\nI defiled my body with vanity,\nIt's fruit now killing me from the inside,\nMaybe I'll give it all up, I can't decide.\n\nThe blood of my blood,\nThe flesh of my flesh,\nNow flushed down the drain,\nLeaving me in excruciating pain.`
  }
];