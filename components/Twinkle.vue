<template>
  <component :is="tag" :class="color" class="twinkle">
    <slot />
  </component>
</template>

<script>
export default {
  name: 'Twinkle',
  props: {
    tag: {
      type: String,
      default: 'span'
    },
    speed: {
      type: Number,
      default () {
        return Math.random() * (5000 - 1500) + 1500
      }
    }
  },
  data () {
    return {
      color: null
    }
  },
  created () {
    this.color = this.randomColor()
    setInterval(() => {
      this.color = this.randomColor()
    }, this.speed)
  },
  methods: {
    random (arr) {
      return arr[Math.floor(Math.random() * arr.length)]
    },
    randomColor () {
      const colours = [
        'red', 'amber', 'yellow', 'emerald',
        'teal', 'blue', 'indigo', 'violet', 'pink'
      ]
      const shades = [
        300, 500, 700
      ]
      return `text-${this.random(colours)}-${this.random(shades)}`
    }
  }
}
</script>

<style scoped>
.twinkle {
  transition: color .8s ease-in-out;
  will-change: color;
}
</style>
