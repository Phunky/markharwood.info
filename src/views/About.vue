<template>
  <div class="about">
    <twinkle><h1>{{ welcome }}</h1></twinkle>
    <h3>I'm Mark, a well versed product director and developer with over fifteen years experience of building web applications, automating business processes and growing start-ups.</h3>
    <h4>Currently working with <twinkle href="https://www.fleetondemand.com" target="_blank">Fleetondemand</twinkle> as the Product Director of <twinkle href="https://www.mobilleo.com" target="_blank">Mobilleo</twinkle> which is the first mobility-as-a-service business travel platform.</h4>
    <h5>Previously Engineering Manager at <twinkle href="https://www.trendmicro.com" target="_blank">Trend Micro</twinkle>, User Interface Team Lead at <twinkle href="https://www.crunchbase.com/organization/humyo" target="_blank">Humyo.com</twinkle> and some other senior and consultant positions more of which you can find on <twinkle href="https://www.linkedin.com/in/markphunkyharwood/" target="_blank">LinkedIn</twinkle>.</h5>
    <twinkle><hr /></twinkle>
    <p></p>
  </div>
</template>

<script>
export default {
  computed: {
    welcome () {
      let values = ['Hey!', 'Hello.', 'Hi!', 'Yo!', 'Sup!', 'Now then.', 'Yello!', 'Howdy!'];
      return values[Math.floor(Math.random() * values.length)];
    }
  }
}
</script>


<style lang="stylus" scoped>
  p
    font-size 1.2rem
  img 
    border-radius 1em
    border .5em solid #f8fafc
  p + p
    margin-bottom 0
  hr
    height 0
    margin 2em 0
    text-align center
    border-top 4px solid currentColor
</style>
