<template>
  <div class="h-screen border-purple-900 border-t-4">
    <div class="container p-8 sm:p-0 sm:max-w-xl mx-auto">
      <img src="~/assets/img/trippy.jpg" class="w-16 h-16 sm:w-24 sm:h-24 sm:my-8 shadow rounded-full">
      <div class="leading-relaxed tracking-tight text-indigo-900 subpixel-antialiased">
        <h1 class="text-xl sm:text-3xl font-bold mb-4 mt-2 sm:mt-0">
          Hey I'm Mark.
        </h1>
        <div class="text-sm sm:text-xl">
          <p>
            For the last twenty years I have been building web applications, automating business processes and helping start-ups grow.
          </p>
          <p>
            Currently working with <a href="https://fleetondemand.com" target="_blank">Fleetondemand</a> as the Product Director of <a href="https://mobilleo.com" target="_blank">Mobilleo</a>, A revolutionary mobility as a service technology platform for business.
          </p>
          <p>
            I’m also available for short, freelance development projects.
          </p>
          <p class="pt-4">
            <a href="mailto:mark@phunky.co.uk" class="block sm:w-40 bg-indigo-900 hover:bg-indigo-600 text-center text-white font-bold py-2 px-4 rounded">
              Hire me
            </a>
          </p>
        </div>
      </div>
      <!-- <nuxt /> -->
    </div>
  </div>
</template>

<style>
@import url('https://fonts.googleapis.com/css2?family=M+PLUS+Rounded+1c:wght@100;300;400;500;700;800;900&display=swap');

html {
  font-family: 'M PLUS Rounded 1c', sans-serif;
  @apply bg-gray-300;
}

p {
  @apply mb-4;
}

a[target] {
  @apply underline;
}

a[target]:hover {
  @apply text-indigo-600;
}
</style>
