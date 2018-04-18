<template>
  <div class="container">
    <div class="sidebar">
      <nav>
        <router-link to="about">About</router-link>
        <router-link to="experience">Experience</router-link>
        <router-link to="projects">Projects</router-link>
        <router-link to="streams">Streams</router-link>
      </nav>
      <div class="colophon">
        Pushing the boundaries of the t'internet.
      </div>
    </div>
    <div class="router">
      <pre>{{ $route }}</pre>
      <!-- <router-view/> -->
    </div>
  </div>
</template>

<style lang="stylus" scoped>
.container
  display flex
  width 100vw
  height 100vh
.sidebar
  display flex
  flex 0 0 auto
  flex-direction column
  width 10em
  padding 2em
  background-color #f8fafc
  nav 
    flex 1 1 auto
    > a
      display block
      text-decoration none 
      font-size 1.3em
      margin-bottom 1em
      color #6574CD
      transition all .2s ease-in-out
      &:hover
        color #5661B3
      &.router-link-active
        color #794ACF
        font-size 1.8em
  .colophon
    flex 0 0 auto
    font-size .8rem
.router
  flex 1 1 auto
</style>

<style lang="stylus">
@import url('https://fonts.googleapis.com/css?family=Varela+Round')

html, body
  margin 0
  padding 0
  font-family 'Varela Round', sans-serif
</style>

