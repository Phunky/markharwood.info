<template>
  <div class="leading-relaxed tracking-tight text-indigo-900 subpixel-antialiased">
    <Twinkle tag="h1" :speed="1000" class="mb-4 mt-2">
      👋 {{ welcome }} I'm Mark.
    </Twinkle>

    <p>
      For the last twenty years I have been building web applications, automating business processes and helping start-ups grow.
    </p>
    <p>
      Currently I'm working as Fullstack Developer at <a href="https://orcascan.com" target="_blank">Orca Scan</a>, enabling companies to build enterprise barcode systems using just smartphones. Previously I was Product Director for <a href="https://mobilleo.com" target="_blank">Mobilleo</a> at <a href="https://fleetondemand.com" target="_blank">Fleetondemand</a>.
    </p>
    <p>
      I’m also available for <em>short</em> freelance development projects if you wish to <a href="mailto:mark@phunky.co.uk?subject=Let's work together">hire me</a>
    </p>
    <hr class="my-10">
    <h1 class="mb-4 mt-2">🕹 Playing, Watching and Reading.</h1>
    <div class="pwr">
      <a href="https://amzn.to/3jxB7tl" target="_blank"><img border="0" src="//ws-eu.amazon-adsystem.com/widgets/q?_encoding=UTF8&ASIN=1786892340&Format=_SL160_&ID=AsinImage&MarketPlace=GB&ServiceVersion=20070822&WS=1&tag=phunky-21&language=en_GB" ></a>

      <a href="https://amzn.to/3hr32t9" target="_blank"><img border="0" src="//ws-eu.amazon-adsystem.com/widgets/q?_encoding=UTF8&ASIN=B07S1BKF3G&Format=_SL160_&ID=AsinImage&MarketPlace=GB&ServiceVersion=20070822&WS=1&tag=phunky-21&language=en_GB" ></a>

      <a href="https://amzn.to/2E2jDVM" target="_blank"><img border="0" src="//ws-eu.amazon-adsystem.com/widgets/q?_encoding=UTF8&ASIN=1473661234&Format=_SL160_&ID=AsinImage&MarketPlace=GB&ServiceVersion=20070822&WS=1&tag=phunky-21&language=en_GB" ></a>

      <a href="https://amzn.to/2CH5Qnc" target="_blank"><img border="0" src="//ws-eu.amazon-adsystem.com/widgets/q?_encoding=UTF8&ASIN=B07D8DPG27&Format=_SL160_&ID=AsinImage&MarketPlace=GB&ServiceVersion=20070822&WS=1&tag=phunky-21&language=en_GB" ></a>

      <a href="https://amzn.to/3hw1EWp" target="_blank"><img border="0" src="//ws-eu.amazon-adsystem.com/widgets/q?_encoding=UTF8&ASIN=B087Z6TLN8&Format=_SL250_&ID=AsinImage&MarketPlace=GB&ServiceVersion=20070822&WS=1&tag=phunky-21&language=en_GB" ></a>
    </div>
    <hr class="my-10">
    <h1 class="mb-4 mt-2">
      ✍️ Writing and rambling.
    </h1>
    <div v-for="(entry, key) in entries" :key="key" class="mt-4 mb-8">
      <h6 class="m-0">
        {{ $dateFns.format(entry.createdAt, 'yyyy-MM-dd') }}
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
        .only(['title', 'path', 'createdAt'])
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
.pwr a {
  @apply inline-block mr-2 border-4;
}
.pwr a img {
  height: 130px;
}
</style>
