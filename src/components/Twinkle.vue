<template>
  <component :is="tag" :style="{ color }" class="twinkle"><slot /></component>
</template>

<script>
export default {
  name: "twinkle",
  props: {
    tag: {
      type: String,
      default: "span"
    },
    speed: {
      type: Number,
      default() {
        return Math.random() * (5000 - 1500) + 1500;
      }
    }
  },
  data() {
    return {
      color: null
    };
  },
  created() {
    this.color = this.randomColor();
    setInterval(() => {
      this.color = this.randomColor();
    }, this.speed);
  },
  methods: {
    randomColor() {
      let values = [
        "#E3342F",
        "#F6993F",
        "#FFED4A",
        "#38C172",
        "#4DC0B5",
        "#3490DC",
        "#6574CD",
        "#9561E2",
        "#F66D9B"
      ];
      return values[Math.floor(Math.random() * values.length)];
    }
  }
};
</script>

<style lang="stylus" scoped>
.twinkle
  transition color .8s ease-in-out
  will-change color
</style>
