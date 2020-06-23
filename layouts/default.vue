<template>
  <main class="p-8 lg:ml-32 lg:mr-64 max-w-screen-lg">
    <router-link to="/" class="lg:absolute lg:left-0 lg:top-0 lg:ml-8 lg:mt-8">
      <img src="~/assets/img/trippy.jpg" class="w-24 h-24 shadow rounded-full">
    </router-link>
    <header class="h-24">
      <h1 class="font-bold text-4xl mb-0">
        Mark Harwood
      </h1>
      <nav class="text-sm uppercase text-gray-600">
        <span class="line-through">
          Journal
        </span>
        <span class="line-through">
          Projects
        </span>
        <router-link tag="a" to="/now">
          Now
        </router-link>
        <router-link tag="a" to="/uses">
          Uses
        </router-link>
      </nav>
    </header>
    <article class="sm:mt-8">
      <nuxt />
    </article>
  </main>
</template>

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
