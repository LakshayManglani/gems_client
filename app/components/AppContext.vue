<script setup lang="ts">
import type { ContextMenuItem } from '@nuxt/ui'

type ContextType =
  | 'body'
  | 'link';


const contextMenuElement = ref<ContextType>('body')
const targetElement = ref<HTMLElement | null>(null)

const colorMode = useColorMode()

const items = ref<Record<ContextType, ContextMenuItem[][]>>({
  'body':
    [
      [
        {
          label: 'Appearance',
          children: [
            {
              label: 'System',
              icon: 'i-lucide-monitor',
              onSelect() {
                colorMode.preference = "system";
              }
            },
            {
              label: 'Light',
              icon: 'i-lucide-sun',
              onSelect() {
                colorMode.preference = "light";
              }

            },
            {
              label: 'Dark',
              icon: 'i-lucide-moon',
              onSelect() {
                colorMode.preference = "dark";
              }
            }
          ]
        }
      ],
      [
        {
          label: 'Refresh the Page',
          onSelect() {
            window.location.reload()
          }
        },
      ]
    ],
  'link': [
    [
      {
        label: 'Open',
        onSelect() {
          const anchor = getAnchor()

          if (!anchor)
            return

          anchor.click()
        },
      },
      {
        label: 'Open in new tab',
        onSelect() {

          const anchor = getAnchor()

          if (!anchor)
            return

          window.open(anchor.href, '_blank', 'noopener,noreferrer')
        }
      },
      {
        label: 'Copy link',
        async onSelect() {
          const anchor = getAnchor()

          if (!anchor)
            return

          await navigator.clipboard.writeText(anchor.href)
        }
      }
    ]
  ]
})

function getAnchor() {
  return targetElement.value as HTMLAnchorElement | null
}

const currentItems = computed(() => {
  return items.value[contextMenuElement.value];
})

const show = ref(false);

function open(context: ContextType, target?: HTMLElement) {
  contextMenuElement.value = context
  targetElement.value = target ?? null
  show.value = true
}

function close() {
  show.value = false;
}

if (import.meta.client) {
  document.addEventListener('contextmenu', (e) => {
    e.preventDefault();
    const target = e.target as HTMLElement

    // if already open close
    if (show.value) {
      close();
      return;
    }

    // Links
    if (target.closest('a')) {
      open('link', target.closest('a') as HTMLElement)
      return
    }

    // Default app background
    open('body', target);
  })

  document.addEventListener('click', () => {
    if (show.value) {
      close();
    }
  });

  document.addEventListener('dragstart', (e) => {
    e.preventDefault()
  })
}
</script>

<template>
  <UContextMenu :items="currentItems" :ui="{
    content: show ? '' : 'hidden'
  }">
    <div>
      <slot />
    </div>
  </UContextMenu>
</template>
