<template>
  <a :href="href" :style="{color}"><slot /></a>
</template>

<script>
export default {
    name: 'twinkle',
    props: {
        href: {
            type: String,
            required: true
        },
        speed: {
            type: Number,
            default: 1500
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
            let values = ['#E3342F', '#F6993F', '#FFED4A', '#38C172', '#4DC0B5', '#3490DC', '#6574CD', '#9561E2', '#F66D9B']
            return values[Math.floor(Math.random() * values.length)]
        }
    }
}
</script>

<style lang="stylus" scoped>
    a
        transition all .5s ease-in
        &:hover
            background-color: currentColor
            color #fff
</style>
