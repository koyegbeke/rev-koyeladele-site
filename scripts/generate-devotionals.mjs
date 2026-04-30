/**
 * One-time generation script for 365 daily devotionals in Rev. Koye-Ladele's voice.
 * Run once: node scripts/generate-devotionals.mjs
 * Output: src/data/devotionals.json
 */

import Anthropic from '@anthropic-ai/sdk';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const OUTPUT_FILE = path.join(__dirname, '../src/data/devotionals.json');
const PROGRESS_FILE = path.join(__dirname, '../src/data/devotionals.progress.json');

const client = new Anthropic();

// 365 scripture references, distributed across key themes
const SCRIPTURES = [
  // FAITH
  { ref: 'Hebrews 11:1', theme: 'faith' },
  { ref: 'Hebrews 11:6', theme: 'faith' },
  { ref: 'Romans 10:17', theme: 'faith' },
  { ref: 'Mark 11:24', theme: 'faith' },
  { ref: 'Matthew 17:20', theme: 'faith' },
  { ref: '2 Corinthians 5:7', theme: 'faith' },
  { ref: '1 Corinthians 16:13', theme: 'faith' },
  { ref: 'Romans 4:20-21', theme: 'faith' },
  { ref: 'Galatians 2:20', theme: 'faith' },
  { ref: 'Matthew 9:29', theme: 'faith' },
  { ref: 'Luke 17:5', theme: 'faith' },
  { ref: 'James 2:17', theme: 'faith' },
  { ref: 'Romans 1:17', theme: 'faith' },
  { ref: 'Ephesians 6:16', theme: 'faith' },
  { ref: '1 John 5:4', theme: 'faith' },
  { ref: 'Habakkuk 2:4', theme: 'faith' },
  { ref: 'Isaiah 7:9', theme: 'faith' },
  { ref: 'Mark 9:23', theme: 'faith' },
  { ref: 'Luke 1:37', theme: 'faith' },
  { ref: 'Matthew 21:22', theme: 'faith' },

  // HEALING
  { ref: 'Isaiah 53:5', theme: 'healing' },
  { ref: 'Psalm 103:3', theme: 'healing' },
  { ref: 'Jeremiah 17:14', theme: 'healing' },
  { ref: 'Exodus 15:26', theme: 'healing' },
  { ref: 'James 5:14-15', theme: 'healing' },
  { ref: '1 Peter 2:24', theme: 'healing' },
  { ref: 'Psalm 147:3', theme: 'healing' },
  { ref: 'Jeremiah 30:17', theme: 'healing' },
  { ref: 'Matthew 4:23', theme: 'healing' },
  { ref: 'Mark 5:34', theme: 'healing' },
  { ref: 'Luke 4:18', theme: 'healing' },
  { ref: 'Acts 10:38', theme: 'healing' },
  { ref: '3 John 1:2', theme: 'healing' },
  { ref: 'Psalm 41:3', theme: 'healing' },
  { ref: 'Matthew 8:17', theme: 'healing' },
  { ref: 'Psalm 30:2', theme: 'healing' },
  { ref: 'Job 33:24-25', theme: 'healing' },
  { ref: 'Malachi 4:2', theme: 'healing' },
  { ref: 'Proverbs 4:20-22', theme: 'healing' },
  { ref: 'Luke 13:12', theme: 'healing' },

  // PROTECTION & SAFETY
  { ref: 'Psalm 91:1-2', theme: 'protection' },
  { ref: 'Psalm 91:4', theme: 'protection' },
  { ref: 'Psalm 91:9-11', theme: 'protection' },
  { ref: 'Psalm 91:14-15', theme: 'protection' },
  { ref: 'Psalm 23:1', theme: 'protection' },
  { ref: 'Psalm 23:4', theme: 'protection' },
  { ref: 'Isaiah 43:2', theme: 'protection' },
  { ref: 'Psalm 46:1', theme: 'protection' },
  { ref: '2 Thessalonians 3:3', theme: 'protection' },
  { ref: 'Proverbs 18:10', theme: 'protection' },
  { ref: 'Psalm 34:7', theme: 'protection' },
  { ref: 'Psalm 121:7-8', theme: 'protection' },
  { ref: 'Psalm 27:1', theme: 'protection' },
  { ref: 'Deuteronomy 31:6', theme: 'protection' },
  { ref: 'Isaiah 54:17', theme: 'protection' },
  { ref: 'Psalm 57:1', theme: 'protection' },
  { ref: 'Psalm 62:6', theme: 'protection' },
  { ref: 'Proverbs 3:23-24', theme: 'protection' },
  { ref: 'Romans 8:31', theme: 'protection' },
  { ref: '2 Samuel 22:3', theme: 'protection' },
  { ref: 'Zechariah 2:5', theme: 'protection' },
  { ref: 'Psalm 5:11-12', theme: 'protection' },
  { ref: 'Isaiah 41:13', theme: 'protection' },
  { ref: 'Numbers 6:24-26', theme: 'protection' },
  { ref: 'Deuteronomy 33:27', theme: 'protection' },

  // PRAYER
  { ref: 'Matthew 7:7-8', theme: 'prayer' },
  { ref: 'Philippians 4:6-7', theme: 'prayer' },
  { ref: '1 Thessalonians 5:17', theme: 'prayer' },
  { ref: 'James 5:16', theme: 'prayer' },
  { ref: 'John 16:24', theme: 'prayer' },
  { ref: 'Mark 11:24', theme: 'prayer' },
  { ref: 'Luke 18:1', theme: 'prayer' },
  { ref: '2 Chronicles 7:14', theme: 'prayer' },
  { ref: 'Jeremiah 33:3', theme: 'prayer' },
  { ref: 'Romans 8:26', theme: 'prayer' },
  { ref: 'Matthew 18:19-20', theme: 'prayer' },
  { ref: '1 John 5:14-15', theme: 'prayer' },
  { ref: 'John 14:13-14', theme: 'prayer' },
  { ref: 'Hebrews 4:16', theme: 'prayer' },
  { ref: 'Psalm 55:17', theme: 'prayer' },
  { ref: 'Luke 11:9-10', theme: 'prayer' },
  { ref: 'Psalm 145:18-19', theme: 'prayer' },
  { ref: 'Ezekiel 22:30', theme: 'prayer' },

  // PROVISION & ABUNDANCE
  { ref: 'Philippians 4:19', theme: 'provision' },
  { ref: 'Matthew 6:33', theme: 'provision' },
  { ref: 'Luke 12:24', theme: 'provision' },
  { ref: '2 Corinthians 9:8', theme: 'provision' },
  { ref: 'John 10:10', theme: 'provision' },
  { ref: 'Psalm 84:11', theme: 'provision' },
  { ref: 'Malachi 3:10', theme: 'provision' },
  { ref: 'Proverbs 10:22', theme: 'provision' },
  { ref: 'Deuteronomy 28:12', theme: 'provision' },
  { ref: 'Luke 6:38', theme: 'provision' },
  { ref: 'Proverbs 3:9-10', theme: 'provision' },
  { ref: 'Genesis 12:2', theme: 'provision' },
  { ref: 'Psalm 37:25', theme: 'provision' },
  { ref: 'Ecclesiastes 5:19', theme: 'provision' },
  { ref: 'Isaiah 58:11', theme: 'provision' },
  { ref: 'Psalm 23:5', theme: 'provision' },
  { ref: 'Job 36:11', theme: 'provision' },
  { ref: 'Ephesians 3:20', theme: 'provision' },

  // PRAISE & WORSHIP
  { ref: 'Psalm 100:4-5', theme: 'praise' },
  { ref: 'Psalm 34:1', theme: 'praise' },
  { ref: 'Psalm 150:6', theme: 'praise' },
  { ref: 'Psalm 103:1', theme: 'praise' },
  { ref: 'Isaiah 61:3', theme: 'praise' },
  { ref: 'Hebrews 13:15', theme: 'praise' },
  { ref: 'Psalm 30:4', theme: 'praise' },
  { ref: 'Psalm 9:1-2', theme: 'praise' },
  { ref: '2 Samuel 22:50', theme: 'praise' },
  { ref: 'Psalm 63:1-3', theme: 'praise' },
  { ref: 'Revelation 4:11', theme: 'praise' },
  { ref: 'Psalm 47:6-7', theme: 'praise' },
  { ref: 'Romans 15:11', theme: 'praise' },
  { ref: 'Psalm 71:8', theme: 'praise' },
  { ref: 'Psalm 107:1', theme: 'praise' },
  { ref: 'Isaiah 25:1', theme: 'praise' },
  { ref: 'Daniel 2:23', theme: 'praise' },

  // STRENGTH & COURAGE
  { ref: 'Isaiah 40:31', theme: 'strength' },
  { ref: 'Philippians 4:13', theme: 'strength' },
  { ref: 'Psalm 28:7', theme: 'strength' },
  { ref: '2 Corinthians 12:9', theme: 'strength' },
  { ref: 'Joshua 1:9', theme: 'strength' },
  { ref: 'Nehemiah 8:10', theme: 'strength' },
  { ref: 'Ephesians 6:10', theme: 'strength' },
  { ref: 'Isaiah 41:10', theme: 'strength' },
  { ref: 'Psalm 29:11', theme: 'strength' },
  { ref: 'Proverbs 28:1', theme: 'strength' },
  { ref: '1 Chronicles 16:11', theme: 'strength' },
  { ref: 'Habakkuk 3:19', theme: 'strength' },
  { ref: '2 Timothy 1:7', theme: 'strength' },
  { ref: 'Colossians 1:11', theme: 'strength' },
  { ref: 'Psalm 18:1-2', theme: 'strength' },
  { ref: 'Deuteronomy 20:4', theme: 'strength' },
  { ref: 'Isaiah 35:3-4', theme: 'strength' },

  // PERSEVERANCE & ENDURANCE
  { ref: 'James 1:2-4', theme: 'perseverance' },
  { ref: 'Romans 5:3-5', theme: 'perseverance' },
  { ref: 'Galatians 6:9', theme: 'perseverance' },
  { ref: 'Hebrews 12:1-2', theme: 'perseverance' },
  { ref: 'James 1:12', theme: 'perseverance' },
  { ref: '2 Timothy 4:7', theme: 'perseverance' },
  { ref: 'Romans 8:28', theme: 'perseverance' },
  { ref: 'Psalm 40:1-3', theme: 'perseverance' },
  { ref: '1 Corinthians 10:13', theme: 'perseverance' },
  { ref: 'Lamentations 3:22-23', theme: 'perseverance' },
  { ref: 'Revelation 2:10', theme: 'perseverance' },
  { ref: 'Psalm 37:24', theme: 'perseverance' },
  { ref: 'Proverbs 24:16', theme: 'perseverance' },
  { ref: '2 Corinthians 4:8-9', theme: 'perseverance' },
  { ref: 'Romans 8:37', theme: 'perseverance' },
  { ref: '1 Corinthians 15:58', theme: 'perseverance' },
  { ref: 'John 16:33', theme: 'perseverance' },
  { ref: 'Isaiah 43:18-19', theme: 'perseverance' },

  // PEACE
  { ref: 'John 14:27', theme: 'peace' },
  { ref: 'Philippians 4:7', theme: 'peace' },
  { ref: 'Isaiah 26:3', theme: 'peace' },
  { ref: 'Colossians 3:15', theme: 'peace' },
  { ref: 'Romans 5:1', theme: 'peace' },
  { ref: 'Psalm 4:8', theme: 'peace' },
  { ref: 'Numbers 6:26', theme: 'peace' },
  { ref: 'Isaiah 9:6', theme: 'peace' },
  { ref: 'Psalm 29:11', theme: 'peace' },
  { ref: 'John 16:33', theme: 'peace' },
  { ref: '2 Thessalonians 3:16', theme: 'peace' },
  { ref: 'Proverbs 3:17', theme: 'peace' },
  { ref: 'Psalm 119:165', theme: 'peace' },
  { ref: 'Romans 15:13', theme: 'peace' },
  { ref: 'Ezekiel 34:26', theme: 'peace' },

  // PURPOSE & CALLING
  { ref: 'Jeremiah 29:11', theme: 'purpose' },
  { ref: 'Proverbs 16:9', theme: 'purpose' },
  { ref: 'Romans 8:28', theme: 'purpose' },
  { ref: 'Psalm 138:8', theme: 'purpose' },
  { ref: 'Ephesians 2:10', theme: 'purpose' },
  { ref: 'Isaiah 46:10', theme: 'purpose' },
  { ref: 'Proverbs 19:21', theme: 'purpose' },
  { ref: 'Romans 8:30', theme: 'purpose' },
  { ref: 'Joshua 1:8', theme: 'purpose' },
  { ref: 'Psalm 37:4', theme: 'purpose' },
  { ref: 'Philippians 1:6', theme: 'purpose' },
  { ref: '2 Timothy 1:9', theme: 'purpose' },
  { ref: '1 Peter 2:9', theme: 'purpose' },
  { ref: 'Acts 13:36', theme: 'purpose' },
  { ref: 'Psalm 32:8', theme: 'purpose' },
  { ref: 'Proverbs 16:3', theme: 'purpose' },

  // JOY
  { ref: 'Nehemiah 8:10', theme: 'joy' },
  { ref: 'Psalm 16:11', theme: 'joy' },
  { ref: 'John 15:11', theme: 'joy' },
  { ref: 'Romans 14:17', theme: 'joy' },
  { ref: 'Psalm 30:5', theme: 'joy' },
  { ref: 'Zephaniah 3:17', theme: 'joy' },
  { ref: 'Isaiah 61:10', theme: 'joy' },
  { ref: 'Psalm 126:5', theme: 'joy' },
  { ref: '1 Peter 1:8', theme: 'joy' },
  { ref: 'Philippians 4:4', theme: 'joy' },
  { ref: 'Psalm 51:12', theme: 'joy' },
  { ref: 'Habakkuk 3:18', theme: 'joy' },
  { ref: 'Galatians 5:22', theme: 'joy' },
  { ref: 'Romans 15:13', theme: 'joy' },
  { ref: 'Psalm 46:4', theme: 'joy' },

  // WISDOM
  { ref: 'James 1:5', theme: 'wisdom' },
  { ref: 'Proverbs 3:5-6', theme: 'wisdom' },
  { ref: 'Proverbs 4:7', theme: 'wisdom' },
  { ref: 'Psalm 111:10', theme: 'wisdom' },
  { ref: 'Proverbs 2:6', theme: 'wisdom' },
  { ref: 'Colossians 3:16', theme: 'wisdom' },
  { ref: 'Isaiah 11:2', theme: 'wisdom' },
  { ref: 'Proverbs 9:10', theme: 'wisdom' },
  { ref: 'Proverbs 16:16', theme: 'wisdom' },
  { ref: 'James 3:17', theme: 'wisdom' },
  { ref: 'Psalm 25:4-5', theme: 'wisdom' },
  { ref: '1 Corinthians 2:9', theme: 'wisdom' },
  { ref: 'Ecclesiastes 7:12', theme: 'wisdom' },
  { ref: 'Proverbs 13:20', theme: 'wisdom' },
  { ref: 'Daniel 12:3', theme: 'wisdom' },

  // GRACE & SALVATION
  { ref: 'John 3:16', theme: 'grace' },
  { ref: 'Ephesians 2:8-9', theme: 'grace' },
  { ref: 'Romans 5:8', theme: 'grace' },
  { ref: '2 Corinthians 9:8', theme: 'grace' },
  { ref: 'Titus 2:11', theme: 'grace' },
  { ref: 'Romans 6:14', theme: 'grace' },
  { ref: 'Hebrews 4:16', theme: 'grace' },
  { ref: '1 Peter 5:10', theme: 'grace' },
  { ref: 'Acts 15:11', theme: 'grace' },
  { ref: 'Romans 10:9', theme: 'grace' },
  { ref: 'John 1:12', theme: 'grace' },
  { ref: '2 Corinthians 5:17', theme: 'grace' },
  { ref: 'Psalm 103:13', theme: 'grace' },
  { ref: 'Isaiah 1:18', theme: 'grace' },
  { ref: '1 John 1:9', theme: 'grace' },
  { ref: 'Romans 8:1', theme: 'grace' },
  { ref: 'John 11:25-26', theme: 'grace' },

  // HOLY SPIRIT
  { ref: 'Acts 1:8', theme: 'holy_spirit' },
  { ref: 'John 14:16', theme: 'holy_spirit' },
  { ref: 'Romans 8:11', theme: 'holy_spirit' },
  { ref: 'Galatians 5:22-23', theme: 'holy_spirit' },
  { ref: 'John 16:13', theme: 'holy_spirit' },
  { ref: 'Acts 2:17', theme: 'holy_spirit' },
  { ref: '1 Corinthians 3:16', theme: 'holy_spirit' },
  { ref: 'Ezekiel 36:27', theme: 'holy_spirit' },
  { ref: 'Joel 2:28', theme: 'holy_spirit' },
  { ref: 'Isaiah 44:3', theme: 'holy_spirit' },
  { ref: 'Luke 11:13', theme: 'holy_spirit' },
  { ref: 'Romans 8:26', theme: 'holy_spirit' },
  { ref: 'Ephesians 3:16', theme: 'holy_spirit' },
  { ref: 'Zechariah 4:6', theme: 'holy_spirit' },
  { ref: 'Acts 2:38', theme: 'holy_spirit' },

  // VICTORY
  { ref: '1 Corinthians 15:57', theme: 'victory' },
  { ref: 'Romans 8:37', theme: 'victory' },
  { ref: 'Psalm 20:7', theme: 'victory' },
  { ref: '2 Chronicles 20:15', theme: 'victory' },
  { ref: 'Revelation 12:11', theme: 'victory' },
  { ref: '1 John 4:4', theme: 'victory' },
  { ref: 'Deuteronomy 28:7', theme: 'victory' },
  { ref: 'Isaiah 54:17', theme: 'victory' },
  { ref: 'Psalm 118:14', theme: 'victory' },
  { ref: 'Exodus 14:14', theme: 'victory' },
  { ref: 'Romans 16:20', theme: 'victory' },
  { ref: 'Psalm 60:12', theme: 'victory' },
  { ref: 'Proverbs 21:31', theme: 'victory' },
  { ref: 'Genesis 50:20', theme: 'victory' },
  { ref: 'Revelation 21:7', theme: 'victory' },

  // GOD'S LOVE & COMFORT
  { ref: 'Psalm 136:1', theme: 'love' },
  { ref: '1 John 4:8', theme: 'love' },
  { ref: 'Romans 8:38-39', theme: 'love' },
  { ref: 'Psalm 34:18', theme: 'love' },
  { ref: '2 Corinthians 1:3-4', theme: 'love' },
  { ref: 'Isaiah 40:28-29', theme: 'love' },
  { ref: 'John 15:9', theme: 'love' },
  { ref: 'Psalm 145:9', theme: 'love' },
  { ref: 'Deuteronomy 7:9', theme: 'love' },
  { ref: 'Zephaniah 3:17', theme: 'love' },
  { ref: 'Isaiah 43:4', theme: 'love' },
  { ref: '1 John 3:1', theme: 'love' },
  { ref: 'Lamentations 3:22-23', theme: 'love' },
  { ref: 'Psalm 103:8', theme: 'love' },
  { ref: 'Psalm 68:19', theme: 'love' },
  { ref: 'Hosea 2:19', theme: 'love' },
  { ref: 'Micah 7:18', theme: 'love' },

  // FAMILY & RELATIONSHIPS
  { ref: 'Proverbs 22:6', theme: 'family' },
  { ref: 'Ephesians 6:4', theme: 'family' },
  { ref: 'Colossians 3:13', theme: 'family' },
  { ref: 'Psalm 128:1-3', theme: 'family' },
  { ref: 'Joshua 24:15', theme: 'family' },
  { ref: 'Proverbs 17:17', theme: 'family' },
  { ref: '1 Timothy 5:8', theme: 'family' },
  { ref: 'Genesis 2:24', theme: 'family' },
  { ref: 'Proverbs 31:25', theme: 'family' },
  { ref: 'Psalm 127:3', theme: 'family' },
  { ref: 'Ephesians 4:32', theme: 'family' },
  { ref: 'Colossians 3:23-24', theme: 'family' },
  { ref: 'Psalm 133:1', theme: 'family' },
  { ref: 'Romans 12:10', theme: 'family' },

  // THE WORD OF GOD
  { ref: 'Psalm 119:105', theme: 'word' },
  { ref: 'Isaiah 40:8', theme: 'word' },
  { ref: 'Hebrews 4:12', theme: 'word' },
  { ref: '2 Timothy 3:16-17', theme: 'word' },
  { ref: 'Joshua 1:8', theme: 'word' },
  { ref: 'Matthew 24:35', theme: 'word' },
  { ref: 'John 17:17', theme: 'word' },
  { ref: 'Psalm 119:9', theme: 'word' },
  { ref: 'Romans 10:17', theme: 'word' },
  { ref: 'Psalm 33:11', theme: 'word' },
  { ref: 'Isaiah 55:11', theme: 'word' },
  { ref: '1 Thessalonians 2:13', theme: 'word' },
  { ref: 'Psalm 19:7-8', theme: 'word' },
  { ref: 'Proverbs 30:5', theme: 'word' },

  // NEW BEGINNINGS & RESTORATION
  { ref: '2 Corinthians 5:17', theme: 'restoration' },
  { ref: 'Isaiah 43:19', theme: 'restoration' },
  { ref: 'Joel 2:25', theme: 'restoration' },
  { ref: 'Psalm 51:10', theme: 'restoration' },
  { ref: 'Revelation 21:5', theme: 'restoration' },
  { ref: 'Isaiah 61:7', theme: 'restoration' },
  { ref: 'Job 42:12', theme: 'restoration' },
  { ref: 'Psalm 80:3', theme: 'restoration' },
  { ref: 'Acts 3:21', theme: 'restoration' },
  { ref: 'Ezekiel 36:26', theme: 'restoration' },
  { ref: 'Psalm 126:4', theme: 'restoration' },
  { ref: 'Zechariah 9:12', theme: 'restoration' },
  { ref: 'Isaiah 44:22', theme: 'restoration' },

  // TRUST IN GOD
  { ref: 'Psalm 37:5', theme: 'trust' },
  { ref: 'Proverbs 3:5-6', theme: 'trust' },
  { ref: 'Isaiah 26:4', theme: 'trust' },
  { ref: 'Psalm 56:3-4', theme: 'trust' },
  { ref: 'Nahum 1:7', theme: 'trust' },
  { ref: 'Psalm 9:10', theme: 'trust' },
  { ref: 'Psalm 18:30', theme: 'trust' },
  { ref: 'Jeremiah 17:7-8', theme: 'trust' },
  { ref: 'Psalm 62:8', theme: 'trust' },
  { ref: 'Isaiah 12:2', theme: 'trust' },
  { ref: 'Psalm 22:4-5', theme: 'trust' },
  { ref: 'Proverbs 29:25', theme: 'trust' },
  { ref: 'Psalm 46:10', theme: 'trust' },
];

// Shuffle deterministically so themes are well-distributed across the year
function seededShuffle(arr) {
  const a = [...arr];
  // Simple deterministic Fisher-Yates with fixed seed
  let seed = 1234567;
  const rand = () => {
    seed = (seed * 1664525 + 1013904223) & 0xffffffff;
    return (seed >>> 0) / 0xffffffff;
  };
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(rand() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

const ORDERED_SCRIPTURES = seededShuffle(SCRIPTURES).slice(0, 365);

const SYSTEM_PROMPT = `You are writing daily devotional entries in the voice of Reverend Edward Adeniji Koye-Ladele (1963–2022), a Yoruba Christian pastor from Nigeria who spent over 30 years in ministry. Write in his authentic broadcast/devotional register.

VOICE GUIDELINES:
- Open each entry with "Beloved," or "Good Morning to us all,"
- Faith is the foundation, not flavouring — God, prayer and Scripture are always present
- Warm but authoritative — he is a father and pastor, never cold or casual
- Use declarative/prophetic blessing form: "Your week SHALL be..." not "I hope your week will be..."
- Capitalise divine pronouns: HE, HIM, HIS, GOD, THE LORD, THE HOLY SPIRIT
- Use "IJMN" as shorthand for "In Jesus Mighty Name" within the body
- Use ALL CAPS only for genuine emphasis or headers — not aggression
- Signature phrases to use naturally when appropriate: "To God be the glory", "Halleluyah", "I command...", "It shall...", "Your source will never run dry", "Keeping you lifted in prayer"
- The word "peculiar" means special/set apart (biblical sense), not strange
- Use "Halleluyah" (not "Hallelujah")
- Close formally with "Reverend Edward Koye-Ladele"
- Pentecostal but middle-of-the-road — avoid fringe or controversial interpretations
- Avoid internet slang, Western idioms, effusive language
- Sentences are often short and declarative

STRUCTURE for each entry:
Opening ("Beloved," or "Good Morning to us all,")
[blank line]
Scripture verse in KJV with reference
[blank line]
2–3 short paragraphs of reflection (~80–100 words total)
[blank line]
A short prayer declaration (2–3 lines, beginning with "I pray today..." or "I declare..." or "I command...")
[blank line]
HAVE A BEAUTIFUL DAY
Reverend Edward Koye-Ladele`;

async function generateBatch(scriptureBatch, startDay) {
  const prompt = scriptureBatch.map((s, i) => {
    return `Day ${startDay + i}: ${s.ref} (theme: ${s.theme})`;
  }).join('\n');

  const message = await client.messages.create({
    model: 'claude-sonnet-4-6',
    max_tokens: 2500,
    system: SYSTEM_PROMPT,
    messages: [{
      role: 'user',
      content: `Write ${scriptureBatch.length} devotional entries. For each one, output EXACTLY this JSON format (one object per line, no array wrapping, separated by ---):

{ "day": <number>, "reference": "<scripture ref>", "verse": "<exact KJV verse text>", "devotional": "<full devotional text with \\n for newlines>" }

---

Entries to write:
${prompt}

Important: verse text must be exact KJV. Keep each devotional tight — no more than 100 words in the reflection body. The prayer declaration should be bold and declarative.`
    }]
  });

  const text = message.content[0].text;
  const entries = [];

  // Parse each JSON block separated by ---
  const blocks = text.split(/\n?---\n?/).map(b => b.trim()).filter(Boolean);
  for (const block of blocks) {
    const jsonMatch = block.match(/\{[\s\S]*\}/);
    if (jsonMatch) {
      try {
        const entry = JSON.parse(jsonMatch[0]);
        entries.push(entry);
      } catch (e) {
        console.warn(`Failed to parse entry block: ${e.message}`);
      }
    }
  }
  return entries;
}

async function main() {
  console.log('Generating 365 daily devotionals...\n');

  // Load existing progress
  let existing = {};
  if (fs.existsSync(PROGRESS_FILE)) {
    existing = JSON.parse(fs.readFileSync(PROGRESS_FILE, 'utf8'));
    console.log(`Resuming — ${Object.keys(existing).length} entries already done.\n`);
  }

  const BATCH_SIZE = 5;
  const allEntries = { ...existing };

  for (let i = 0; i < ORDERED_SCRIPTURES.length; i += BATCH_SIZE) {
    const batch = ORDERED_SCRIPTURES.slice(i, i + BATCH_SIZE);
    const startDay = i + 1;

    // Skip if all days in this batch are done
    const allDone = batch.every((_, j) => allEntries[startDay + j]);
    if (allDone) {
      process.stdout.write(`Skipping days ${startDay}–${startDay + batch.length - 1} (already done)\n`);
      continue;
    }

    try {
      process.stdout.write(`Generating days ${startDay}–${startDay + batch.length - 1}... `);
      const entries = await generateBatch(batch, startDay);

      for (const entry of entries) {
        allEntries[entry.day] = entry;
      }

      // Save progress after every batch
      fs.writeFileSync(PROGRESS_FILE, JSON.stringify(allEntries, null, 2));
      console.log(`✓ (${entries.length} entries)`);

      // Small delay to avoid rate limits
      if (i + BATCH_SIZE < ORDERED_SCRIPTURES.length) {
        await new Promise(r => setTimeout(r, 500));
      }
    } catch (err) {
      console.error(`\nError on batch starting day ${startDay}: ${err.message}`);
      console.log('Progress saved. Re-run the script to resume.');
      process.exit(1);
    }
  }

  // Write final sorted output
  const sorted = Array.from({ length: 365 }, (_, i) => allEntries[i + 1]).filter(Boolean);
  fs.writeFileSync(OUTPUT_FILE, JSON.stringify(sorted, null, 2));

  // Clean up progress file
  if (fs.existsSync(PROGRESS_FILE)) {
    fs.unlinkSync(PROGRESS_FILE);
  }

  console.log(`\n✅ Done! ${sorted.length} devotionals written to src/data/devotionals.json`);
}

main();
