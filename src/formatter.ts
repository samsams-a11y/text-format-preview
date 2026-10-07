export type TextColor = 'blue' | 'yellow' | 'green' | 'red'

export interface TextRun {
  text: string
  color: TextColor | null
}

const MARKER_COLORS: Record<string, TextColor> = {
  '@': 'blue',
  '#': 'yellow',
  '$': 'green',
  '&': 'red',
}

export function toEscapedNewlines(text: string): string {
  return text.replace(/\r\n|\r|\n/g, String.raw`\n`)
}

export function toPreviewText(text: string): string {
  return text.replace(/\\n|\r\n|\r|\n/g, '\n')
}

export function parseColorMarkers(text: string): TextRun[] {
  const stack: { marker: string; index: number }[] = []
  const paired = new Set<number>()
  const ranges: { start: number; end: number; color: TextColor }[] = []

  for (let index = 0; index < text.length; index += 1) {
    const marker = text[index]
    const color = MARKER_COLORS[marker]
    if (!color) continue

    const top = stack.at(-1)
    if (top?.marker === marker) {
      stack.pop()
      paired.add(top.index)
      paired.add(index)
      ranges.push({ start: top.index + 1, end: index, color })
    } else if (!stack.some((entry) => entry.marker === marker)) {
      stack.push({ marker, index })
    }
    // A marker that would cross an open range stays visible as ordinary text.
  }

  ranges.sort((a, b) => a.start - b.start)
  const active: typeof ranges = []
  let nextRange = 0
  const runs: TextRun[] = []
  for (let index = 0; index < text.length; index += 1) {
    while (ranges[nextRange]?.start <= index) active.push(ranges[nextRange++])
    while (active.at(-1) && active.at(-1)!.end <= index) active.pop()
    if (paired.has(index)) continue
    const color = active.at(-1)?.color ?? null
    const previous = runs.at(-1)
    if (previous?.color === color) previous.text += text[index]
    else runs.push({ text: text[index], color })
  }

  return runs
}
