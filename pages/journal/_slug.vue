<template>
  <div>
    <h6 class="m-0">
      {{ $dateFns.format(entry.createdAt, 'yyyy-MM-dd') }}
    </h6>
    <h1>
      {{ entry.title }}
    </h1>
    <h6 class="text-gray-600">
      {{ entry.description }}
    </h6>
    <nuxt-content :document="entry" />
  </div>
</template>

<script>
export default {
  async asyncData ({ $content, params }) {
    const entry = await $content('journal', params.slug).fetch()
    return {
      entry
    }
  }
}
</script>
