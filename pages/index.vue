<template>
  <div class="leading-relaxed tracking-tight text-indigo-900 subpixel-antialiased">
    <Twinkle tag="h1" class="mb-4 mt-2">
      👋 {{ welcome }} I'm Mark.
    </Twinkle>
    <div class="text-sm sm:text-xl">
      <p>
        For the last twenty years I have been building web applications, automating business processes and helping start-ups grow.
      </p>
      <p>
        Currently working with <a href="https://fleetondemand.com" target="_blank">Fleetondemand</a> as the Product Director of <a href="https://mobilleo.com" target="_blank">Mobilleo</a>, A revolutionary mobility as a service technology platform for business.
      </p>
      <p>
        I’m also available for short, freelance development projects if you wish to <a href="mailto:mark@phunky.co.uk?subject=Let's work together">hire me</a>
      </p>
    </div>
    <h2 class="text-ls sm:text-xl font-bold mt-6">
      Still here? Right, well then...
    </h2>
    <ul class="text-sm sm:text-xl">
      <li>
        <router-link tag="a" :to="{path: 'now'}">
          /now
        </router-link>
      </li>
      <li>
        <router-link tag="a" :to="{path: 'uses'}">
          /uses
        </router-link>
      </li>
      <li>
        <router-link tag="a" :to="{path: 'about'}">
          /about
        </router-link>
      </li>
    </ul>
  </div>
</template>

<script>
export default {
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
