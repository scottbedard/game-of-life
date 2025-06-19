import { ref } from "vue";
import { shuffle } from 'lodash-es'

export interface Cell {
  alive: boolean
  color: string
}

interface Options {
  cols: number
  rows: number
}

export const colors = [
  'oklch(79.2% 0.209 151.711)',
  'oklch(62.3% 0.214 259.815)',
  'oklch(85.2% 0.199 91.936)',
  'oklch(74% 0.238 322.16)',
]

export function useGame(opts: Options) {
  const cols = ref(opts.cols)
  const rows = ref(opts.rows)
  const game = ref<Cell[]>([])

  const seed = .8

  const clear = () => {
    game.value = Array.from({ length: rows.value * cols.value }, () => {
      return {
        alive: false,
        color: colors[0],
      }
    })
  }

  const randomize = () => {
    game.value = Array.from({ length: rows.value * cols.value }, () => {
      return {
        alive: Math.random() > seed,
        color: shuffle(colors)[0],
      }
    })

    tick()
  }

  const tick = () => {
    game.value = game.value.map((cell, i) => {
      const row = Math.floor(i / cols.value)
      const col = (i % cols.value) - 1
      
      // directional neighbors
      const nw = row > 0 && col > 0 ? game.value[i - cols.value - 1] : undefined
      const n = row > 0 ? game.value[i - cols.value] : undefined
      const ne = row > 0 && col < cols.value - 1 ? game.value[i - cols.value + 1] : undefined
      const w = col > 0 ? game.value[i - 1] : undefined
      const e = col < cols.value - 1 ? game.value[i + 1] : undefined
      const sw = row < rows.value - 1 && col > 0 ? game.value[i + cols.value - 1] : undefined
      const s = row < rows.value - 1 ? game.value[i + cols.value] : undefined
      const se = row < rows.value - 1 && col < cols.value - 1 ? game.value[i + cols.value + 1] : undefined

      const neighbors = [nw, n, ne, w, e, sw, s, se].filter(n => n?.alive).length

      const neighborColors = [nw, n, ne, w, e, sw, s, se]
        .filter(n => n?.alive)
        .map(n => n!.color)
      
      const colorCounts = neighborColors.reduce((acc, color) => {
        acc[color] = (acc[color] || 0) + 1
        return acc
      }, {} as Record<string, number>)

      const mostCommonColor = Object.entries(colorCounts)
        .sort(([,a], [,b]) => b - a)[0]?.[0] || shuffle(colors)[0]
  
      if (cell.alive) {
        const leastCommonColor = Object.entries(colorCounts)
          .sort(([,a], [,b]) => a - b)[0]?.[0] || shuffle(colors)[0]

        return {
          alive: neighbors === 2 || neighbors === 3,
          color: neighbors > 3 ? mostCommonColor : cell.color,
        }
      } else {

        return {
          alive: neighbors === 3,
          color: mostCommonColor
        }
      }
    })
  }

  return {
    clear,
    cols,
    game,
    randomize,
    rows,
    tick,
  }
}