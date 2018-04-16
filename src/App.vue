<template>
  <div class="m-6 p-8 bg-grey-lighter overflow-y-scroll w-screen font-serif">
    <img src="./assets/mug.jpg">
    <router-view/>
  </div>
</template>

<style lang="stylus">
@tailwind preflight;
@tailwind components;
@tailwind utilities;

body
  display flex
  overflow hidden
  width 100vw
  height 100vh
</style>
