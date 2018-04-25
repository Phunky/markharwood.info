<template>
  <div class="about">
    <twinkle tag="h1" :speed="2000">
      {{ welcome }}
    </twinkle>
    <h3>I'm Mark, a well versed product director and developer with over fifteen years experience of building web applications, automating business processes and growing start-ups.</h3>
    <h4>Currently working with <twinkle tag="a" href="https://www.fleetondemand.com" target="_blank">Fleetondemand</twinkle> as the Product Director of <twinkle tag="a" href="https://www.mobilleo.com" target="_blank">Mobilleo</twinkle> which is the first mobility-as-a-service business travel platform.</h4>
    <h5>Previously Engineering Manager at <twinkle tag="a" href="https://www.trendmicro.com" target="_blank">Trend Micro</twinkle>, User Interface Team Lead at <twinkle tag="a" href="https://www.crunchbase.com/organization/humyo" target="_blank">Humyo.com</twinkle> and some other senior and consultant positions more of which you can find on <twinkle tag="a" href="https://www.linkedin.com/in/markphunkyharwood/" target="_blank">LinkedIn</twinkle>.</h5>
    <hr />
    <h6>Married since 2011 and Father of two <i><b>super energetic</b></i> children, who love nothing more than to run rings around me daily. Pretty much everyone in our household is somewhere on the <twinkle tag="a" href="https://en.wikipedia.org/wiki/Autism_spectrum" target="_blank">ASD spectrum</twinkle> and this is something we as a family embrace completely.</h6>
    <h6>Other random things to note;</h6>
    <ul>
      <li>I represented the UK at the 2005 World Cyber Games playing Counter-Strike (<twinkle tag="a" href="http://news.bbc.co.uk/1/hi/technology/4429264.stm" target="_blank">BBC Article</twinkle>)</li>
      <li>Lost in my first Ultra White Collar Boxing event in <twinkle tag="a" href="https://www.instagram.com/p/BZN7wkeFZ32/" target="_blank">2017</twinkle>, but looking to go again soon.</li>
      <li>I suffer with Anxiety and Depression, but have thankfully learnt to be mindful of them both and now manage them in a much healthier way.</li>
      <li>Have dislocated cartilage in my chest, which used to allow me to mimic the chest breaking scene from aliens.</li>
      <li>Would drop everything to move my family to NYC.</li>
    </ul>
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
  p, li
    font-size 1.2rem
  li
    margin-bottom 1em
  img 
    border-radius 1em
    border .5em solid #f8fafc
  p + p
    margin-bottom 0
  hr
    height 0
    margin 1.5em 0
    text-align center
    border-top 3px solid currentColor
  a:hover
    font-weight bolder
    background currentColor

</style>
