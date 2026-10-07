import assert from 'node:assert/strict'
import { parseColorMarkers, toEscapedNewlines, toPreviewText } from '../src/formatter.ts'

assert.equal(toEscapedNewlines('Hello\nWorld'), String.raw`Hello\nWorld`)
assert.equal(toEscapedNewlines('A\r\n\rB'), String.raw`A\n\nB`)
assert.equal(toEscapedNewlines(String.raw`\n`), String.raw`\n`)
assert.equal(toPreviewText(String.raw`A\n\nB`), 'A\n\nB')
assert.equal(toPreviewText('A\r\nB'), 'A\nB')

assert.deepEqual(parseColorMarkers('@Blue@'), [{ text: 'Blue', color: 'blue' }])
assert.deepEqual(
  parseColorMarkers(toEscapedNewlines('@Blue@\nNormal')),
  [
    { text: 'Blue', color: 'blue' },
    { text: String.raw`\nNormal`, color: null },
  ],
)
assert.deepEqual(
  parseColorMarkers(toPreviewText(String.raw`@Blue@\n\nNormal`)),
  [
    { text: 'Blue', color: 'blue' },
    { text: '\n\nNormal', color: null },
  ],
)
assert.deepEqual(
  parseColorMarkers('@Blue@\n#Yellow#\n$Green$\n&Red&')
    .filter((run) => run.color)
    .map(({ text, color }) => ({ text, color })),
  [
    { text: 'Blue', color: 'blue' },
    { text: 'Yellow', color: 'yellow' },
    { text: 'Green', color: 'green' },
    { text: 'Red', color: 'red' },
  ],
)
assert.deepEqual(parseColorMarkers('Hello @World@'), [
  { text: 'Hello ', color: null },
  { text: 'World', color: 'blue' },
])
assert.deepEqual(parseColorMarkers('@blue #yellow# text@'), [
  { text: 'blue ', color: 'blue' },
  { text: 'yellow', color: 'yellow' },
  { text: ' text', color: 'blue' },
])
assert.deepEqual(parseColorMarkers('A\n\n@* bullet\n* next*@'), [
  { text: 'A\n\n', color: null },
  { text: '* bullet\n* next*', color: 'blue' },
])
assert.deepEqual(parseColorMarkers('unmatched @ stays'), [{ text: 'unmatched @ stays', color: null }])
assert.deepEqual(parseColorMarkers('<script>alert("x")</script>'), [
  { text: '<script>alert("x")</script>', color: null },
])

console.log('formatter tests passed')
