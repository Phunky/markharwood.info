<template>
  <div class="leading-relaxed tracking-tight text-indigo-900 subpixel-antialiased">
    <h1 class="text-xl sm:text-3xl font-bold mb-4 mt-2 sm:mt-0">
      {{ welcome }} I'm Mark.
    </h1>
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

<style scoped>
p {
  @apply mb-4;
}

a {
  @apply underline text-bold;
}

a:hover {
  @apply text-indigo-600;
}
</style>
