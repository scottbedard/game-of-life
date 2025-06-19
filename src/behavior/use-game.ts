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

  const refresh = () => {
    game.value = Array.from({ length: rows.value * cols.value }, () => {
      return {
        alive: Math.random() > .99,
      }
    })
  }

  const tick = () => {
    const next = game.value.map((cell, i) => {
      const row = Math.floor(i / cols.value)
      const col = (i % cols.value) - 1

      const neighbors = {
        // top: row ? game.value[i - cols.value] : undefined,
        // topRight: row && col < cols.value - 1 ? game.value[i - cols.value + 1] : undefined,
        // right: col < cols.value - 1 ? game.value[i + 1] : undefined,
        // bottomRight: row < rows.value - 1 && col < cols.value - 1 ? game.value[i + cols.value + 1] : undefined,
        // bottom: row < rows.value - 1 ? game.value[i + cols.value] : undefined,
        // bottomLeft: row < rows.value - 1 && col ? game.value[i + cols.value - 1] : undefined,
        // left: col ? game.value[i - 1] : undefined,
        // topLeft: row && col ? game.value[i - cols.value - 1] : undefined,
      }

      return {
        alive: Math.random() > .99
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