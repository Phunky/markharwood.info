<template>
  <div>
    <h1>
      Projects
    </h1>
    <h6 class="text-gray-600">
      Some tings I gone done before today.
    </h6>
    <hr>
    <div v-for="(item, key) in projects" :key="key" class="mt-4 mb-8">
      <h2>{{ item.title }}</h2>
      <div v-html="item.description" />
      <h6>
        <a
          :href="item.url"
          target="_blank"
          class="text-gray-600 font-normal no-underline hover:underline"
        >
          View this project →
        </a>
      </h6>
    </div>
  </div>
</template>

<script>
export default {
  name: 'Projects',
  async asyncData ({ $content }) {
    return {
      projects: await $content('projects')
        .only(['title', 'description', 'url', 'tags', 'epoc'])
        .sortBy('epoch', 'desc')
        .fetch()
    }
  }
}
</script>
