<template>
  <canvas
    class="h-full w-full"
    ref="canvasEl"
    :height="elementHeight"
    :width="elementWidth"
  />
</template>

<script lang="ts" setup>
import { computed, onMounted, useTemplateRef } from 'vue'
import { useMouseInElement, useRafFn, useMousePressed } from '@vueuse/core'
import type { Cell } from '../behavior/use-game'

const props = defineProps<{
  cols: number
  game: Cell[]
  rows: number
}>()

let ctx: CanvasRenderingContext2D

onMounted(() => {
  ctx = canvasEl.value?.getContext('2d')!
})

const canvasEl = useTemplateRef('canvasEl')

const { elementX, elementY, elementWidth, elementHeight, isOutside } = useMouseInElement(canvasEl)

const { pressed } = useMousePressed()

const cellWidth = computed(() => elementWidth.value / props.cols)

const cellHeight = computed(() => elementHeight.value / props.rows)

const hoverCell = computed(() => {
  const col = Math.floor(elementX.value / cellWidth.value)
  const row = Math.floor(elementY.value / cellHeight.value)
  
  // Check bounds and return cell index
  if (col >= 0 && col < props.cols && row >= 0 && row < props.rows) {
    return row * props.cols + col
  }
  
  return -1
})

useRafFn(() => {
  ctx.clearRect(0, 0, elementWidth.value, elementHeight.value)

  const _width = cellWidth.value
  const _height = cellHeight.value

  // set fill style once
  ctx.fillStyle = 'oklch(54.6% 0.245 262.881)'
  
  // build a single path for all alive cells
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
  
  // fill all cells
  ctx.fill()

  // fill hover cell
  if (hoverCell.value !== -1) {
    ctx.fillStyle = `oklch(63.7% 0.237 25.331)`
    ctx.fillRect(
      hoverCell.value % props.cols * _width,
      Math.floor(hoverCell.value / props.cols) * _height,
      _width,
      _height)
  }

  if (pressed.value && !isOutside.value) {
    const cell = props.game[hoverCell.value]
    cell.alive = true
  }
})
</script>