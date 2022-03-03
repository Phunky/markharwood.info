<template>
  <main class="p-8 lg:ml-32 max-w-screen-lg">
    <router-link to="/">
      <span class="lg:absolute lg:left-0 lg:top-0 lg:ml-8 lg:mt-8">
        <img src="~/assets/img/trippy.jpg" class="w-24 h-24 shadow rounded-full">
      </span>
    </router-link>
    <header class="h-24">
      <h1 class="font-bold text-4xl mb-0">
        Mark Harwood
      </h1>
      <nav class="text-sm uppercase text-gray-600">
        <nuxt-link tag="a" to="/journal">
          Journal
        </nuxt-link>
        <nuxt-link tag="a" to="/now">
          Now
        </nuxt-link>
        <nuxt-link tag="a" to="/uses">
          Uses
        </nuxt-link>
      </nav>
    </header>
    <article class="sm:mt-8">
      <nuxt />
    </article>
  </main>
</template>

<script>
export default {
  name: 'LayoutDefault'
}
</script>

<style>
nav a + a,
nav a + span,
nav span + a,
nav span + span {
  @apply ml-2;
}
nav a:hover {
  @apply text-gray-900;
}
</style>
