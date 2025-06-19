<template>
  <GameOfLife
    :cols
    :game
    :rows
  />

  <div class="flex gap-4 fixed bottom-0 left-0 p-4">
    <Button
      class="flex items-center gap-2"
      @click="pause">
      <svg class="size-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="14" y="4" width="4" height="16" rx="1"/><rect x="6" y="4" width="4" height="16" rx="1"/></svg>
      Pause
    </Button>

    <Button
      class="flex items-center gap-2"
      @click="resume">
      <svg class="size-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polygon points="6 3 20 12 6 21 6 3"/></svg>
      Resume
    </Button>
  </div>
</template>

<script lang="ts" setup>
import { useGame } from './behavior/use-game'
import { useIntervalFn } from '@vueuse/core'
import Button from './components/Button.vue'
import GameOfLife from './components/GameOfLife.vue'

const { 
  cols,
  game,
  refresh,
  rows,
  tick,
} = useGame({
  cols: 200,
  rows: 200,
})

refresh()

const { pause, resume, isActive } = useIntervalFn(() => {
  tick()
}, 100)
</script>