<template>
  <div class="container">
    <div class="router">
      <router-view/>
    </div>
    <div class="footer">
      <div class="external">
        <twinkle :speed="500" href="https://github.com/phunky" target="_blank"><i class="fab fa-github"></i></twinkle>
        <twinkle :speed="500" href="https://twitter.com/irphunky" target="_blank"><i class="fab fa-twitter"></i></twinkle>
        <twinkle :speed="500" href="https://www.linkedin.com/in/markphunkyharwood" target="_blank"><i class="fab fa-linkedin"></i></twinkle>
        <twinkle :speed="500" href="twitch.tv/irphunky" target="_blank"><i class="fab fa-twitch"></i></twinkle>
      </div>
    </div>
  </div>
</template>

<style lang="stylus" scoped>
.container
  display flex
  flex-direction column
  font-size 2vw
  padding 5vw 10vw
.external
  display flex
  flex-direction row
  justify-content space-between
.router
  display flex
  flex 1 1 auto
</style>

<style lang="stylus">
@import url('https://fonts.googleapis.com/css?family=Varela+Round')

html, body
  display flex
  width 100vw
  height 100vh
  margin 0
  padding 0
  font-family 'Varela Round', sans-serif
  color #8795A1

.router
  h1, h2, h3, h4, h5, h6, p
    margin-top 0
</style>

