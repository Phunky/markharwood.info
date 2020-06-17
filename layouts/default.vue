<template>
  <div class="border-purple-900 border-t-4">
    <div class="container p-8 sm:p-0 sm:max-w-xl mx-auto">
      <router-link :to="{path: '/'}">
        <img src="~/assets/img/trippy.jpg" class="w-16 h-16 sm:w-24 sm:h-24 sm:my-8 shadow rounded-full">
      </router-link>
      <nuxt />
    </div>
  </div>
</template>

<style>
@import url('https://fonts.googleapis.com/css2?family=M+PLUS+Rounded+1c:wght@100;300;400;500;700;800;900&display=swap');

html {
  font-family: 'M PLUS Rounded 1c', sans-serif;
  @apply bg-gray-300;
}
</style>
