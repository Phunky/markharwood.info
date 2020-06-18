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
