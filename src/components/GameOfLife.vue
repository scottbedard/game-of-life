<template>
  <canvas
    class="h-screen w-screen"
    ref="canvasEl"
    :height="height"
    :width="width"
  />
</template>

<script lang="ts" setup>
import { computed, useTemplateRef } from 'vue'
import { useRafFn, useElementSize } from '@vueuse/core'
import type { Cell } from '../behavior/use-game'

const props = defineProps<{
  cols: number
  game: Cell[]
  rows: number
}>()

const canvasEl = useTemplateRef('canvasEl')
const { height, width } = useElementSize(canvasEl)

const cellWidth = computed(() => width.value / props.cols)
const cellHeight = computed(() => height.value / props.rows)

useRafFn(() => {
  const ctx = canvasEl.value?.getContext('2d')

  if (!ctx) {
    return
  }

  const _width = cellWidth.value
  const _height = cellHeight.value

  ctx.clearRect(0, 0, width.value, height.value)

  for (let i = 0; i < props.game.length; i++) {
    const cell = props.game[i]
    const row = Math.floor(i / props.cols)
    const col = i % props.cols

    if (cell.alive) {
      ctx.fillStyle = 'oklch(54.6% 0.245 262.881)'
      ctx.fillRect(col * _width, row * _height, _width, _height)
    }
  }
})
</script>