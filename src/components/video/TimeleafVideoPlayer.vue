<template>
  <div class="timeleaf-video">
    <VideoPlayer ref="playerRef" :options="options" @ready="onReady" class="video-core" />

    <el-alert v-if="errorText" :title="errorText" type="error" :closable="false" style="margin-top: 12px" />

    <div class="controls">
      <el-button size="small" @click="play">Play</el-button>
      <el-button size="small" @click="pause">Pause</el-button>

      <el-button size="small" @click="seek(0)">Start</el-button>
      <el-button size="small" @click="seek(5)">5s</el-button>
      <el-button size="small" @click="seek(10)">10s</el-button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, ref, onBeforeUnmount, watchEffect } from 'vue'
import { VideoPlayer } from '@videojs-player/vue'
import type { VideoJsPlayer, VideoJsPlayerOptions } from 'video.js'

const props = defineProps<{
  src: string
  poster?: string
}>()

const playerRef = ref<any>(null)
let player: VideoJsPlayer | null = null
const errorText = ref('')

watchEffect(() => {
  // eslint-disable-next-line no-console
  console.log('[TimeleafVideo] props', { src: props.src, poster: props.poster })
})

function getPlayer(): VideoJsPlayer | null {
  const fromRef = (playerRef.value as any)?.player
  const candidate = player || fromRef || null
  const resolved = typeof (candidate as any)?.play === 'function' ? candidate : null
  // eslint-disable-next-line no-console
  console.log('[TimeleafVideo] getPlayer', {
    hasLocal: !!player,
    hasRef: !!fromRef,
    resolved: !!resolved,
    refValueType: typeof playerRef.value,
    refHasPlayerField: typeof (playerRef.value as any)?.player
  })
  return resolved
}

function getVideoEl(): HTMLVideoElement | null {
  const root = (playerRef.value as any)?.$el as HTMLElement | undefined
  const video = root?.querySelector?.('video') as HTMLVideoElement | null | undefined
  // eslint-disable-next-line no-console
  console.log('[TimeleafVideo] getVideoEl', {
    ok: !!video,
    readyState: video?.readyState,
    paused: video?.paused,
    currentTime: video?.currentTime
  })
  return video || null
}

const options = computed<VideoJsPlayerOptions>(() => ({
  controls: false,
  preload: 'auto' as const,
  fluid: true,
  poster: props.poster,
  sources: [{ src: props.src, type: 'video/mp4' }]
}))

function onReady(p: any) {
  const maybe = (p as any)?.player || (p as any)
  player = typeof (maybe as any)?.play === 'function' ? (maybe as any) : null
  errorText.value = ''

  // eslint-disable-next-line no-console
  console.log('[TimeleafVideo] ready', {
    hasArgPlayer: !!p,
    resolved: !!player,
    src: props.src
  })

  // eslint-disable-next-line no-console
  console.log('[TimeleafVideo] ready->arg', {
    argType: typeof p,
    argKeys: p ? Object.keys(p) : null,
    argHasPlayerField: !!p?.player,
    argPlayType: typeof p?.play,
    argPlayerPlayType: typeof p?.player?.play
  })

  // eslint-disable-next-line no-console
  console.log('[TimeleafVideo] ready->resolvedTypes', {
    resolvedPlayType: typeof (player as any)?.play,
    resolvedOnType: typeof (player as any)?.on,
    resolvedPausedType: typeof (player as any)?.paused,
    resolvedCurrentSrcType: typeof (player as any)?.currentSrc
  })

  // eslint-disable-next-line no-console
  console.log('[TimeleafVideo] ready->fallbackVideo', {
    ok: !!getVideoEl()
  })

  const real = getPlayer()

  // eslint-disable-next-line no-console
  console.log('[TimeleafVideo] ready->real', {
    ok: !!real,
    currentSrc: (real as any)?.currentSrc?.(),
    paused: (real as any)?.paused?.()
  })

  real?.on?.('play', () => {
    // eslint-disable-next-line no-console
    console.log('[TimeleafVideo] event:play', {
      currentTime: (real as any)?.currentTime?.(),
      paused: (real as any)?.paused?.()
    })
  })
  real?.on?.('pause', () => {
    // eslint-disable-next-line no-console
    console.log('[TimeleafVideo] event:pause', {
      currentTime: (real as any)?.currentTime?.(),
      paused: (real as any)?.paused?.()
    })
  })
  real?.on?.('waiting', () => {
    // eslint-disable-next-line no-console
    console.log('[TimeleafVideo] event:waiting', {
      currentTime: (real as any)?.currentTime?.(),
      readyState: (real as any)?.readyState?.()
    })
  })
  real?.on?.('loadedmetadata', () => {
    // eslint-disable-next-line no-console
    console.log('[TimeleafVideo] event:loadedmetadata', {
      duration: (real as any)?.duration?.(),
      videoWidth: (real as any)?.videoWidth?.(),
      videoHeight: (real as any)?.videoHeight?.()
    })
  })
  real?.on?.('canplay', () => {
    // eslint-disable-next-line no-console
    console.log('[TimeleafVideo] event:canplay', {
      currentTime: (real as any)?.currentTime?.(),
      readyState: (real as any)?.readyState?.()
    })
  })
  real?.on?.('timeupdate', () => {
    // eslint-disable-next-line no-console
    console.log('[TimeleafVideo] event:timeupdate', {
      currentTime: (real as any)?.currentTime?.()
    })
  })

  real?.on?.('error', () => {
    const err = real?.error?.()
    const code = err?.code
    const msg = err?.message
    errorText.value = msg || '视频播放失败'
    // eslint-disable-next-line no-console
    console.error('[TimeleafVideo] error', { code, msg, src: props.src })
  })
}

function play() {
  // eslint-disable-next-line no-console
  console.log('[TimeleafVideo] click:play')
  const p = getPlayer()
  // eslint-disable-next-line no-console
  console.log('[TimeleafVideo] play->player', {
    ok: !!p,
    currentSrc: (p as any)?.currentSrc?.(),
    paused: (p as any)?.paused?.()
  })
  if (!p) {
    const v = getVideoEl()
    const ret = v?.play?.()
    if (ret && typeof (ret as any).catch === 'function') {
      ;(ret as any).catch((e: any) => {
        // eslint-disable-next-line no-console
        console.error('[TimeleafVideo] native play() rejected', {
          name: e?.name,
          message: e?.message,
          src: props.src
        })
      })
    }
    return
  }

  const ret = p?.play?.()
  if (ret && typeof (ret as any).catch === 'function') {
    ;(ret as any).catch((e: any) => {
      // eslint-disable-next-line no-console
      console.error('[TimeleafVideo] play() rejected', {
        name: e?.name,
        message: e?.message,
        src: props.src
      })
    })
  }
}

function pause() {
  // eslint-disable-next-line no-console
  console.log('[TimeleafVideo] click:pause')
  const p = getPlayer()
  if (!p) {
    getVideoEl()?.pause?.()
    return
  }
  p?.pause?.()
}

function seek(time: number) {
  // eslint-disable-next-line no-console
  console.log('[TimeleafVideo] click:seek', { time })
  const p = getPlayer()
  if (!p) {
    const v = getVideoEl()
    if (v) v.currentTime = time
    return
  }
  p?.currentTime?.(time)
}

onBeforeUnmount(() => {
  // eslint-disable-next-line no-console
  console.log('[TimeleafVideo] beforeUnmount', { src: props.src })
  const p = getPlayer()
  p?.dispose?.()
})
</script>

<style scoped>
.timeleaf-video {
  width: 100%;
}

.video-core {
  border-radius: 12px;
  overflow: hidden;
}

.controls {
  display: flex;
  gap: 8px;
  justify-content: center;
  margin-top: 12px;
}
</style>
