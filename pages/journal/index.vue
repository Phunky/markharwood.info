<template>
  <div>
    <h1>
      Journal
    </h1>
    <h6 class="text-gray-600">
      I try to write, yet I fail often.
    </h6>
    <hr>
    <div v-for="(entry, key) in entries" :key="key" class="mt-4 mb-8">
      <h2>{{ entry.title }}</h2>
      <pre>{{ entry }}</pre>
      <div v-html="entry.description" />
      <h6>
        <nuxt-link
          tag="a"
          :to="entry.path"
          class="text-gray-600 font-normal no-underline hover:underline"
        >
          View this entry →
        </nuxt-link>
      </h6>
    </div>
  </div>
</template>

<script>
export default {
  name: 'Journal',
  async asyncData ({ $content }) {
    return {
      entries: await $content('journal')
        .only(['title', 'slug', 'path'])
        .fetch()
    }
  }
}
</script>
