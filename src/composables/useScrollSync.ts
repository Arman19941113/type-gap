import type { Ref } from 'vue'

export function useScrollSync(
  el1: Ref<HTMLElement | null | undefined>, 
  el2: Ref<HTMLElement | null | undefined>
) {
  let isSyncingScroll = false

  const handleScroll = (event: Event) => {
    if (isSyncingScroll) {
      isSyncingScroll = false
      return
    }

    isSyncingScroll = true

    const source = event.target as HTMLElement
    const target = source === el1.value ? el2.value : el1.value

    if (target) {
      target.scrollTop = source.scrollTop
      target.scrollLeft = source.scrollLeft
    }
  }

  return {
    handleScroll
  }
} 
