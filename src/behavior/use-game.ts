import { ref } from "vue";

export interface Cell {
  alive: boolean
}

interface Options {
  cols: number
  rows: number
}

export function useGame(opts: Options) {
  const cols = ref(opts.cols)
  const rows = ref(opts.rows)
  const game = ref<Cell[]>([])

  const seed = .5

  const refresh = () => {
    game.value = Array.from({ length: rows.value * cols.value }, () => {
      return {
        alive: Math.random() > seed,
      }
    })
  }

  const tick = () => {
    const next = game.value.map((cell, i) => {
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

      if (cell.alive) {
        return {
          alive: neighbors === 2 || neighbors === 3,
        }
      } else {
        return {
          alive: neighbors === 3,
        }
      }
    })

    game.value.splice(0, game.value.length, ...next)
  }

  return {
    cols,
    game,
    refresh,
    rows,
    tick,
  }
}