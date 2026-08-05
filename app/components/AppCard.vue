<template>
  <div class="overflow-hidden rounded-xl hover:rounded-sm
    border  transition-all duration-300 
    group relative

    bg-[#BDBDBD]/20 hover:bg-[#FFFFFF]/20 border-[#BDBDBD]

    dark:border-[#292929] dark:bg-[#292929]/20 dark:hover:bg-[#000000]/20
    ">

    <!-- dark:bg-black/20 dark:hover:bg-black/60 dark:hover:border-black -->
    <!-- !border-black -->
    <div>
      <slot />
    </div>
  </div>
</template>
