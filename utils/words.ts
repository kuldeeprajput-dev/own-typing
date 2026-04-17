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
  'night', 'same', 'today', 'next', 'last', 'last', 'last', 'last', 'last', 'last'
];

export function generateWords(count: number): string[] {
  const words: string[] = [];
  for (let i = 0; i < count; i++) {
    words.push(WORD_LIST[Math.floor(Math.random() * WORD_LIST.length)]);
  }
  return words;
}