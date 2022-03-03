<template>
  <div>
    <div v-for="(entry, key) in entries" :key="key" class="mt-4 mb-8">
      <h6 class="m-0">
        {{ $dateFns.format(entry.date, 'EEEE, do MMMM yyyy') }}
      </h6>
      <h3>
        <nuxt-link
          tag="a"
          :to="entry.path"
          class="font-bold underline"
        >
          {{ entry.title }}
        </nuxt-link>
      </h3>
    </div>
  </div>
</template>

<script>
export default {
  name: 'JournalIndex',
  async asyncData ({ $content }) {
    return {
      entries: await $content('journal')
        .only(['title', 'path', 'date'])
        .sortBy('date', 'desc')
        .fetch()
    }
  }
}
</script>
