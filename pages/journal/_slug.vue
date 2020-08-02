<template>
  <div v-if="entry">
    <h6 class="m-0">
      {{ $dateFns.format(entry.date, 'EEEE, do MMMM yyyy') }}
    </h6>
    <h1>
      {{ entry.title }}
    </h1>
    <hr class="mb-4">
    <nuxt-content :document="entry" />
    <hr class="mt-8 mb-4">
    <div class="mb-4 text-gray-600">
      <template v-for="tag in entry.tags">
        #{{ tag }}
      </template>
    </div>
    <div v-if="prev">
      <h6>← Previous</h6>
      <nuxt-link
        tag="a"
        :to="prev.path"
        class="font-bold underline"
      >
        {{ prev.title }}
      </nuxt-link>
    </div>
    <div v-if="next">
      <h6>Next →</h6>
      <nuxt-link
        tag="a"
        :to="next.path"
        class="font-bold underline"
      >
        {{ next.title }}
      </nuxt-link>
    </div>
  </div>
</template>

<script>
export default {
  async asyncData ({ $content, params }) {
    const entry = await $content('journal', params.slug)
      .fetch()
    const [prev, next] = await $content('journal')
      .only(['title', 'path'])
      .surround(params.slug)
      .sortBy('date', 'asc')
      .fetch()
    return {
      entry,
      prev,
      next
    }
  }
}
</script>
