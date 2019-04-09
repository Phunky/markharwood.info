<template>
  <div class="container">
    <div class="router">
      <router-view />
    </div>
    <div class="external">
      <twinkle
        tag="a"
        :speed="1000"
        href="https://github.com/phunky"
        target="_blank"
        ><i class="fab fa-github"></i
      ></twinkle>
      <twinkle
        tag="a"
        :speed="1000"
        href="https://twitter.com/irphunky"
        target="_blank"
        ><i class="fab fa-twitter"></i
      ></twinkle>
      <twinkle
        tag="a"
        :speed="1000"
        href="https://www.linkedin.com/in/markphunkyharwood"
        target="_blank"
        ><i class="fab fa-linkedin"></i
      ></twinkle>
      <twinkle
        tag="a"
        :speed="1000"
        href="https://twitch.tv/irphunky"
        target="_blank"
        ><i class="fab fa-twitch"></i
      ></twinkle>
    </div>
  </div>
</template>

<style lang="stylus">
@import url('https://fonts.googleapis.com/css?family=Varela+Round')

html, body
  font-family 'Varela Round', sans-serif
  font-size 2vh
  max-width 66vw
  margin auto
  color #b1aabf
  background-color #2a2e46
.router
  padding-top 2vh
.external
  font-size 3vh
  position fixed
  bottom 16px
  right 32px
  a
    display block
    margin-top 16px
</style>
