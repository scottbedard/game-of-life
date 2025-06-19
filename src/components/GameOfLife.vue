<template>
  <canvas
    class="h-screen w-screen"
    ref="canvasEl"
    :height="height"
    :width="width"
  />
</template>

<script lang="ts" setup>
import { computed, onMounted, useTemplateRef, watch } from 'vue'
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

let ctx: CanvasRenderingContext2D

onMounted(() => {
  ctx = canvasEl.value?.getContext('2d')!
})

function clear(index: number) {
  const row = Math.floor(index / props.cols)
  const col = index % props.cols
  
  ctx.clearRect(col * cellWidth.value, row * cellHeight.value, cellWidth.value, cellHeight.value)
}

function fill(index: number) {
  const row = Math.floor(index / props.cols)
  const col = index % props.cols
  
  ctx.fillStyle = 'oklch(54.6% 0.245 262.881)'
  ctx.fillRect(col * cellWidth.value, row * cellHeight.value, cellWidth.value, cellHeight.value)
}

watch(() => props.game, (current, prev) => {
  const _width = cellWidth.value
  const _height = cellHeight.value

  ctx.fillStyle = 'oklch(54.6% 0.245 262.881)'

  for (let i = 0; i < props.game.length; i++) {
    const cell = current[i]
    const row = Math.floor(i / props.cols)
    const col = i % props.cols

    if (cell.alive) {
      ctx.fillRect(col * _width, row * _height, _width, _height)
    } else {
      ctx.clearRect(col * _width, row * _height, _width, _height)
    }
  }
})
</script>