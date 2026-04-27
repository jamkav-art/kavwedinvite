-- ── Soul-Sync Quiz Engine: Seed 50 Questions into question_bank ──
-- Run this after migration 20260427_question_bank.sql
-- Uses service_role or direct SQL insertion

-- ── Pattern 1: Nostalgia & The Spark ❤️ ──
INSERT INTO question_bank (category, question_text, options) VALUES
('nostalgia', 'What was the very first thing I noticed about you?', '["Your smile", "Your shoes", "Your snack choice"]'),
('nostalgia', 'Where did our first date happen?', '["That cozy café", "The grocery store", "Your dreams"]'),
('nostalgia', 'What song was playing when we first kissed?', '["A slow love song", "Elevator music", "My nervous heartbeat"]'),
('nostalgia', 'What did I wear on our first meeting?', '["That blue outfit", "Something borrowed", "A full tuxedo obviously"]'),
('nostalgia', 'Who said ''I love you'' first?', '["You did", "The cat did", "Neither, it was typed"]'),
('nostalgia', 'What''s the first gift I ever gave you?', '["Something handmade", "A high-five", "Emotional damage"]'),
('nostalgia', 'Where was our first trip together?', '["A weekend getaway", "The balcony", "Imagination land"]'),
('nostalgia', 'What did we cook together the first time?', '["Burnt pasta", "Instant noodles", "A five-star disaster"]'),
('nostalgia', 'What movie did we watch on our first movie night?', '["A rom-com classic", "Whatever was on TV", "I was watching you"]'),
('nostalgia', 'What inside joke started it all?', '["That weird accent", "A typo text", "Your dance moves"]'),

-- ── Pattern 2: The LOL Challenge 😂 ──
('playful', 'We''re in a horror movie. Who dies first?', '["You for sure", "Me, I''m too nice", "The dog lives"]'),
('playful', 'Who is the better dancer?', '["Definitely me", "Nobody wins here", "The washing machine"]'),
('playful', 'What''s my most annoying habit?', '["Stealing the blanket", "Leaving lights on", "Breathing too loud"]'),
('playful', 'If our relationship was a movie genre?', '["Rom-com", "Chaos documentary", "Silent film"]'),
('playful', 'Who is more likely to cry at a commercial?', '["You, softie", "Me, obviously", "Both, full ugly cry"]'),
('playful', 'What''s the weirdest thing I eat?', '["Pizza with pineapple", "Dry cereal", "Your last slice"]'),
('playful', 'Who takes longer to get ready?', '["Me, worth the wait", "You, forever", "We''re both disasters"]'),
('playful', 'If we were a reality show, what would it be called?', '["Love & Laughter", "Chaos Central", "Who Snored Last Night"]'),
('playful', 'Who is more competitive during board games?', '["I am the champion", "You cheat nicely", "We both lose gracefully"]'),
('playful', 'What''s my go-to karaoke song?', '["A power ballad", "The national anthem", "Silence"]'),

-- ── Pattern 3: Soul Layers 🔥 ──
('soul', 'What do I do that makes you feel safest?', '["Your warm hug", "Making me tea", "Existing in the same room"]'),
('soul', 'What''s my biggest dream I haven''t achieved yet?', '["Travel the world", "Own a pet sloth", "World domination"]'),
('soul', 'What is my primary love language?', '["Quality time", "Free food", "Sarcastic compliments"]'),
('soul', 'What am I most afraid of losing?', '["My family", "My phone battery", "The TV remote"]'),
('soul', 'What''s one thing I wish you understood without me saying?', '["When I need space", "That I''m always right", "My food order"]'),
('soul', 'What does our future look like in 10 years?', '["A cozy home with kids", "Living in a van", "Same chaos, older faces"]'),
('soul', 'What''s the deepest secret I''ve shared with you?', '["My childhood fear", "I fake-laughed at your jokes", "My hidden snack stash"]'),
('soul', 'What makes me feel most understood?', '["When you just listen", "When you agree with me", "When you bring snacks"]'),
('soul', 'What''s my biggest insecurity?', '["Not being enough", "My terrible dance moves", "Losing at Mario Kart"]'),
('soul', 'What moment brought us closest together?', '["That tough conversation", "The WiFi went out", "Shared dessert"]'),

-- ── Pattern 4: Did You Know? 🤔 ──
('discovery', 'What was the name of my first ever pet?', '["A cute dog name", "A creative cat name", "I had a pet rock"]'),
('discovery', 'What''s my go-to comfort food?', '["Warm home-cooked meal", "Midnight ice cream", "Whatever''s free"]'),
('discovery', 'What''s my secret hidden talent?', '["I can sing decently", "I can sleep anywhere", "Parallel parking"]'),
('discovery', 'What''s my guilty pleasure TV show?', '["Cheesy reality TV", "Kids cartoons", "Infomercials at 3 AM"]'),
('discovery', 'If I could have any superpower?', '["Teleportation", "The power to nap forever", "Flying while eating"]'),
('discovery', 'What''s my favorite way to spend a Sunday?', '["Sleeping in late", "Doing absolutely nothing", "Planning next week"]'),
('discovery', 'Which season makes me happiest?', '["Spring with blooms", "Monsoon with cozy rains", "AC season"]'),
('discovery', 'What''s my biggest pet peeve?', '["People chewing loudly", "Slow walkers", "Unsolicited advice"]'),
('discovery', 'What was my childhood dream job?', '["Astronaut or doctor", "Professional video gamer", "Full-time dreamer"]'),
('discovery', 'What''s the one food I absolutely refuse to eat?', '["Cilantro or liver", "Anything green", "Leftovers from last week"]'),

-- ── Pattern 5: Hopes & Challenges 🚀 ──
('future', 'What will we be arguing about when we are 80?', '["TV remote control", "Who forgot the dentures", "Who loves whom more"]'),
('future', 'Where do I want us to retire?', '["A beachside cottage", "A fancy retirement home", "Mars colony"]'),
('future', 'What''s the number one thing on my bucket list?', '["Skydiving or safari", "Eating at every restaurant", "Napping for a week"]'),
('future', 'What hobby do I want us to take up together?', '["Cooking classes", "Competitive napping", "Learning TikTok dances"]'),
('future', 'How many kids do I want?', '["Two little ones", "Furry four-legged kids", "A small army"]'),
('future', 'What''s my biggest hope for our relationship?', '["Growing old together", "Never running out of snacks", "Always laughing"]'),
('future', 'What skill do I most want to learn?', '["A new language", "The art of patience", "How to fold fitted sheets"]'),
('future', 'What travel destination is at the top of my list?', '["Santorini or Bali", "The moon probably", "Anywhere with good Wi-Fi"]'),
('future', 'What kind of home do I dream of?', '["A cozy bungalow", "A tiny house on wheels", "A castle with moat"]'),
('future', 'What''s one promise I want us to keep forever?', '["Always be honest", "Always share dessert", "Never sing in public"]');
