<template>
  <div class="container">
    <div class="router">
      <router-view/>
    </div>
    <div class="external">
      <twinkle tag="a" :speed="1000" href="https://github.com/phunky" target="_blank"><i class="fab fa-github"></i></twinkle>
      <twinkle tag="a" :speed="1000" href="https://twitter.com/irphunky" target="_blank"><i class="fab fa-twitter"></i></twinkle>
      <twinkle tag="a" :speed="1000" href="https://www.linkedin.com/in/markphunkyharwood" target="_blank"><i class="fab fa-linkedin"></i></twinkle>
      <twinkle tag="a" :speed="1000" href="twitch.tv/irphunky" target="_blank"><i class="fab fa-twitch"></i></twinkle>
    </div>
  </div>
</template>

<style lang="stylus" scoped>
.container
  display flex
  font-size 2vw
  padding 5vw 10vw
.external
  display flex
  flex-direction column
  padding 0 2vw
.router
  display flex
  flex 1 1 auto
</style>

<style lang="stylus">
@import url('https://fonts.googleapis.com/css?family=Varela+Round')

html, body
  display flex
  min-width 100vw
  min-height 100vh
  margin 0
  padding 0
  font-family 'Varela Round', sans-serif
  color #8795A1

.router
  h1, h2, h3, h4, h5, h6, p
    margin-top 0
</style>

