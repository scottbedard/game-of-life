<template>
  <div class="p-4">
    <h1 class="my-6 text-center text-4xl">
      Karina's Color Battle!
    </h1>

    <div class="flex flex-wrap gap-4 justify-center mb-6">
      <Button
        class="flex items-center gap-2"
        @click="onClear">
        <svg class="size-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8"/><path d="M3 3v5h5"/></svg>
        Clear
      </Button>

      <Button
        class="flex items-center gap-2"
        @click="onRandomize">
        <svg class="size-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="m18 14 4 4-4 4"/><path d="m18 2 4 4-4 4"/><path d="M2 18h1.973a4 4 0 0 0 3.3-1.7l5.454-8.6a4 4 0 0 1 3.3-1.7H22"/><path d="M2 6h1.972a4 4 0 0 1 3.6 2.2"/><path d="M22 18h-6.041a4 4 0 0 1-3.3-1.8l-.359-.45"/></svg>
        Randomize
      </Button>
    
      <Button
        v-if="isActive"
        class="flex items-center gap-2"
        @click="onPause">
        <svg class="size-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="14" y="4" width="4" height="16" rx="1"/><rect x="6" y="4" width="4" height="16" rx="1"/></svg>
        Pause
      </Button>

      <Button
        v-else
        class="flex items-center gap-2"
        @click="resume">
        <svg class="size-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polygon points="6 3 20 12 6 21 6 3"/></svg>
        Play
      </Button>
    </div>

    <div class="flex gap-6 justify-center mb-6">
      <button
        v-for="color in colors"
        class="cursor-pointer font-bold size-10 rounded-full shadow-md text-white text-sm outline-offset-3"
        :style="{
          background: color,
          outline: selectedColor === color ? `3px solid ${color}` : 'none',
        }"
        @click="selectedColor = color">
        {{ game.filter(cell => cell.alive && cell.color === color).length }}
      </button>
    </div>

    <div
      class="aspect-square bg-gray-50 border border-gray-300 max-w-2xl mx-auto overflow-hidden rounded-lg shadow-lg">
      <GameOfLife
        :cols
        :game
        :rows
        :selected-color
      />
    </div>

    <div class="mt-6 flex justify-center opacity-70">
      <button
        class="flex items-center gap-2 whitespace-nowrap"
        @click="onCopy">
        <svg
          v-if="copied"
          class="size-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M20 6 9 17l-5-5"/></svg>
        <svg
          v-else
          class="size-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71"/><path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71"/></svg>
        
        {{ copied ? 'Done!' : 'Copy Link' }}
      </button>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { colors, useGame } from './behavior/use-game'
import { ref } from 'vue'
import { useIntervalFn } from '@vueuse/core'
import Button from './components/Button.vue'
import GameOfLife from './components/GameOfLife.vue'
import lz from 'lz-string'

const { 
  clear,
  cols,
  game,
  randomize,
  rows,
  tick,
} = useGame({
  cols: 50,
  rows: 50,
  query: new URLSearchParams(window.location.search).get('q'),
})

const copied = ref(false)
const selectedColor = ref(colors[0])

const { pause, resume, isActive } = useIntervalFn(tick, 100, { immediate: false })

function onClear() {
  pause()
  clear()
  window.history.replaceState(null, '', window.location.pathname)
}

function onPause() {
  pause()
  updateUrl()
}

function onRandomize() {
  randomize()
  updateUrl()
}

function updateUrl() {
  const q = lz.compressToBase64(
    game.value
      .map(cell => cell.alive ? colors.indexOf(cell.color) : '-')
      .join('')
  )

  const url = new URL(window.location.href)

  url.searchParams.set('q', q)

  window.history.replaceState(null, '', url.toString())

  return url.toString()
}

function onCopy() {
  navigator.clipboard.writeText(updateUrl())

  copied.value = true

  setTimeout(() => {
    copied.value = false
  }, 2000)
}
</script>