<template>
  <canvas
    class="h-screen w-screen"
    ref="canvasEl"
    :height="height"
    :width="width"
  />
</template>

<script lang="ts" setup>
import { computed, onMounted, useTemplateRef } from 'vue'
import { useRafFn, useElementSize } from '@vueuse/core'
import type { Cell } from '../behavior/use-game'

const props = defineProps<{
  cols: number
  game: Cell[]
  rows: number
}>()

const canvasEl = useTemplateRef('canvasEl')
const { height, width } = useElementSize(canvasEl)

useRafFn(() => {
  const ctx = canvasEl.value?.getContext('2d')

  if (!ctx) {
    return
  }

  const cellWidth = width.value / props.cols
  const cellHeight = height.value / props.rows

  ctx.clearRect(0, 0, width.value, height.value)

  for (let i = 0; i < props.game.length; i++) {
    const cell = props.game[i]
    const row = Math.floor(i / props.cols)
    const col = i % props.cols

    if (cell.alive) {
      ctx.fillStyle = 'blue'
      ctx.fillRect(col * cellWidth, row * cellHeight, cellWidth, cellHeight)
    }
  }
})
</script>