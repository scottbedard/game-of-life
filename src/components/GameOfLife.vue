<template>
  <canvas
    class="h-full w-full"
    ref="canvasEl"
    :height="elementHeight"
    :width="elementWidth"
  />
</template>

<script lang="ts" setup>
import { colors } from '../behavior/use-game'
import { computed, onMounted, useTemplateRef } from 'vue'
import { useMouseInElement, useRafFn, useMousePressed } from '@vueuse/core'
import type { Cell } from '../behavior/use-game'

const props = defineProps<{
  cols: number
  game: Cell[]
  rows: number
  selectedColor: string
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

  // draw each cell with it's color
  colors.forEach(color => {
    ctx.fillStyle = color

    // build a single path for all alive cells
    ctx.beginPath()

    props.game
      .filter(cell => cell.alive && cell.color === color)
      .map(cell => {
        const i = props.game.indexOf(cell)
        const row = Math.floor(i / props.cols)
        const col = i % props.cols

        if (cell.alive) {
          const x = col * _width
          const y = row * _height
          ctx.rect(x, y, _width, _height)
        }
      })

    ctx.fill()
  })

  // fill hover cell
  if (hoverCell.value !== -1) {
    ctx.fillStyle = props.selectedColor
    ctx.fillRect(
      hoverCell.value % props.cols * _width,
      Math.floor(hoverCell.value / props.cols) * _height,
      _width,
      _height)
  }

  if (pressed.value && !isOutside.value) {
    const cell = props.game[hoverCell.value]

    if (cell) {
      cell.alive = true
      cell.color = props.selectedColor
    }
  }
})
</script>