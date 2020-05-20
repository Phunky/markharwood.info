<template>
  <div class="about">
    <twinkle tag="h1" :speed="2000">
      {{ welcome }}
    </twinkle>
    <h3>
      I'm Mark, a well versed Technical Lead and Software Developer with over
      twenty years experience of building web applications, automating business
      processes and growing start-ups.
    </h3>
    <h4>
      Currently working with
      <twinkle tag="a" href="https://www.fleetondemand.com" target="_blank"
        >Fleetondemand</twinkle
      >
      as the Product Director of
      <twinkle tag="a" href="https://www.mobilleo.com" target="_blank"
        >Mobilleo</twinkle
      >
      which is the first mobility-as-a-service business travel platform.
    </h4>
    <p>
      Previously Engineering Manager at
      <twinkle tag="a" href="https://www.trendmicro.com" target="_blank"
        >Trend Micro</twinkle
      >, User Interface Team Lead at
      <twinkle
        tag="a"
        href="https://www.crunchbase.com/organization/humyo"
        target="_blank"
        >Humyo.com</twinkle
      >
      and some other senior and consultant positions more of which you can find
      on
      <twinkle
        tag="a"
        href="https://www.linkedin.com/in/markphunkyharwood/"
        target="_blank"
        >LinkedIn</twinkle
      >.
    </p>
    <p>
      Married since 2011 and Father of two
      <i><b>super energetic</b></i> children, who love nothing more than to run
      rings around me daily. Pretty much everyone in our household is somewhere
      on the
      <twinkle
        tag="a"
        href="https://en.wikipedia.org/wiki/Autism_spectrum"
        target="_blank"
        >ASD spectrum</twinkle
      >
      and this is something we as a family embrace completely.
    </p>
    <h3>Other random things to note;</h3>
    <ul>
      <li>
        I represented the UK at the
        <twinkle
          tag="a"
          href="http://news.bbc.co.uk/1/hi/technology/4429264.stm"
          target="_blank"
          >2005 World Cyber Games</twinkle
        >
        playing Counter-Strike.
      </li>
      <li>
        I have fought and lost twice at
        <twinkle
          tag="a"
          href="https://gallery.ultrapix.co.uk/gallery/bradford20191uwcb/album/6716287/photo/1207237199"
          target="_blank"
          >Ultra White Collar Boxing</twinkle
        >
        events, but massively enjoyed them both.
      </li>
      <li>
        I had a black dog, his name was
        <twinkle
          tag="a"
          href="https://www.youtube.com/watch?v=XiCrniLQGYc"
          target="_blank"
          >depression</twinkle
        >
        and anxiety.
      </li>
      <li>
        I have dislocated cartilage in my chest, which used to allow me to mimic
        the
        <twinkle
          tag="a"
          href="https://www.youtube.com/watch?v=nPQ7om598OM"
          target="_blank"
          >chest breaking scene</twinkle
        >
        from aliens.
      </li>
      <li>I would drop everything to move my family to NYC.</li>
    </ul>
  </div>
</template>

<script>
export default {
  computed: {
    welcome() {
      let values = [
        "Hey!",
        "Hello.",
        "Hi!",
        "Yo!",
        "Sup!",
        "Now then.",
        "Yello!",
        "Howdy!"
      ];
      return values[Math.floor(Math.random() * values.length)];
    }
  }
};
</script>

<style lang="stylus" scoped>
hr
  height 0
  margin 1.5em 0
  text-align center
  border-top 3px solid currentColor
a:hover
  font-weight bolder
  background currentColor
ul
  padding 0
li
  margin 16px
</style>
