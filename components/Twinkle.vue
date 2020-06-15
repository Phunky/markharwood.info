<template>
  <component :is="tag" :style="{ color }" class="twinkle">
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
    randomColor () {
      const values = [
        '#E3342F',
        '#F6993F',
        '#FFED4A',
        '#38C172',
        '#4DC0B5',
        '#3490DC',
        '#6574CD',
        '#9561E2',
        '#F66D9B'
      ]
      return values[Math.floor(Math.random() * values.length)]
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
