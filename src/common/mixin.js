import backTop from 'components/content/backTop/backTop'
export const backTopMixin = {
  data () {
    return {
      isShowBackTop: false
    }
  },
  methods: {
    backClick() {
      this.$refs.scroll.scrollTo(0, 0 , 500)
    }
  },
  components: {
    backTop
  }
}