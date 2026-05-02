import { TestOptions } from '@/types';

const WORD_LIST = [
  'the', 'be', 'to', 'of', 'and', 'a', 'in', 'that', 'have', 'I',
  'it', 'for', 'not', 'on', 'with', 'he', 'as', 'you', 'do', 'at',
  'this', 'but', 'his', 'by', 'from', 'they', 'we', 'say', 'her', 'she',
  'or', 'an', 'will', 'my', 'one', 'all', 'would', 'there', 'their', 'what',
  'so', 'up', 'out', 'if', 'about', 'who', 'get', 'which', 'go', 'me',
  'when', 'make', 'can', 'like', 'time', 'no', 'just', 'him', 'know', 'take',
  'people', 'into', 'year', 'your', 'good', 'some', 'could', 'them', 'see', 'other',
  'than', 'then', 'now', 'look', 'only', 'come', 'its', 'over', 'think', 'also',
  'back', 'after', 'use', 'two', 'how', 'our', 'work', 'first', 'well', 'way',
  'even', 'new', 'want', 'because', 'any', 'these', 'give', 'day', 'most', 'us',
  'is', 'was', 'are', 'been', 'were', 'being', 'has', 'had', 'did', 'does',
  'said', 'each', 'more', 'very', 'much', 'before', 'too', 'here', 'should', 'many',
  'where', 'through', 'life', 'being', 'made', 'find', 'world', 'still', 'own', 'something',
  'start', 'go', 'set', 'hand', 'place', 'while', 'show', 'every', 'small', 'found',
  'those', 'never', 'under', 'might', 'home', 'keep', 'part', 'such', 'end', 'another',
  'must', 'big', 'since', 'away', 'again', 'put', 'right', 'old', 'long', 'point',
  'great', 'last', 'three', 'run', 'state', 'once', 'change', 'both', 'number', 'man',
  'night', 'same', 'today', 'next'
];

const PUNCTUATION = ['.', ',', ';', ':', '!', '?', '(', ')', '"', "'"];

export function generateWords(count: number, options: TestOptions = { punctuation: false, numbers: false, capitals: false }): string[] {
  const words: string[] = [];
  
  for (let i = 0; i < count; i++) {
    let word = WORD_LIST[Math.floor(Math.random() * WORD_LIST.length)];
    
    if (options.capitals) {
      // 20% chance to capitalize a word
      if (Math.random() < 0.2 || i === 0) {
        word = word.charAt(0).toUpperCase() + word.slice(1);
      }
    }
    
    if (options.punctuation) {
      // 10% chance to add punctuation
      if (Math.random() < 0.1) {
        const p = PUNCTUATION[Math.floor(Math.random() * PUNCTUATION.length)];
        if (p === '(') {
          word = '(' + word + ')';
        } else if (p === '"') {
          word = '"' + word + '"';
        } else {
          word = word + p;
        }
      }
    }

    if (options.numbers) {
      // 5% chance to replace word with a number
      if (Math.random() < 0.05) {
        word = Math.floor(Math.random() * 1000).toString();
      }
    }

    words.push(word);
  }
  return words;
}