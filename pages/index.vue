<template>
  <div class="leading-relaxed tracking-tight text-indigo-900 subpixel-antialiased">
    <Twinkle tag="h1" :speed="1000" class="mb-4 mt-2">
      👋 {{ welcome }} I'm Mark.
    </Twinkle>

    <p>
      For the last twenty years I have been building web applications, automating business processes and helping start-ups grow.
    </p>
    <p>
      Currently I'm working as Head of Engineering at <a href="https://orcascan.com" target="_blank">Orca Scan</a>, enabling companies to build enterprise barcode systems using just smartphones. Previously I was Product Director for <a href="https://mobilleo.com" target="_blank">Mobilleo</a> at <a href="https://fleetondemand.com" target="_blank">Fleetondemand</a>.
    </p>
    <p>
      I’m also available for <em>short</em> freelance development projects if you wish to <a href="mailto:mark@phunky.co.uk?subject=Let's work together">hire me</a>
    </p>
    <hr class="my-10">
    <h1 class="mb-4 mt-2">
      🕹 Playing and consuming.
    </h1>
    <div class="grid grid-cols-2 md:grid-cols-10 md:grid-rows-none gap-2">
      <template v-for="(item, key) in consuming">
        <a
          :key="key"
          :href="item.link"
          :class="item.type"
          target="_blank"
          class="consuming border-4"
        >
          <img
            border="0"
            :src="item.image"
            class="w-full object-fill md:h-32"
          >
        </a>
      </template>
    </div>
    <hr class="my-10">
    <h1 class="mb-4 mt-2">
      ✍️ Writing and rambling.
    </h1>
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
  async asyncData ({ $content }) {
    return {
      entries: await $content('journal')
        .only(['title', 'path', 'date'])
        .sortBy('date', 'desc')
        .fetch(),
      consuming: await $content('consuming')
        .sortBy('date', 'desc')
        .limit(10)
        .fetch()
    }
  },
  computed: {
    welcome () {
      const values = [
        'Hey!',
        'Hello.',
        'Hi!',
        'Yo!',
        'Sup!',
        'Now then.',
        'Yello!',
        'Howdy!'
      ]
      return values[Math.floor(Math.random() * values.length)]
    }
  }
}
</script>

<style>
.consuming.tvshow {
  @apply col-span-2;
}
</style>
