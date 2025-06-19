<template>
  <canvas
    class="h-full w-full"
    ref="canvasEl"
    :height="height"
    :width="width"
  />
</template>

<script lang="ts" setup>
import { computed, onMounted, useTemplateRef, watch } from 'vue'
import { useElementSize } from '@vueuse/core'
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

let ctx: CanvasRenderingContext2D

onMounted(() => {
  ctx = canvasEl.value?.getContext('2d')!
})

function render() {
  ctx.clearRect(0, 0, width.value, height.value)

  const _width = cellWidth.value
  const _height = cellHeight.value

  // Set fill style once
  ctx.fillStyle = 'oklch(54.6% 0.245 262.881)'
  
  // Build a single path for all alive cells
  ctx.beginPath()
  
  for (let i = 0; i < props.game.length; i++) {
    const cell = props.game[i]
    const row = Math.floor(i / props.cols)
    const col = i % props.cols

    if (cell.alive) {
      const x = col * _width
      const y = row * _height
      ctx.rect(x, y, _width, _height)
    }
  }
  
  // Fill all cells at once
  ctx.fill()
}

watch(() => props.game, render)
</script>