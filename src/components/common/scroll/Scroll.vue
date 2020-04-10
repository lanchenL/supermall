<template>
  <div class="wrapper" ref="wrapper"> 
    <div class="content">
      <slot></slot>
    </div>
  </div>
</template>

<script>
import BScroll from 'better-scroll'
export default {
  name: "Scroll",
  props: {
    probeType: {
      type: Number,
      default: 0
    },
    pullUpLoad: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      scroll: null
    }
  },
  mounted() {
    this.scroll = new BScroll(this.$refs.wrapper, {
      click: true,
      probeType: this.probeType,
      pullUpLoad: this.pullUpLoad
    })
    if(this.probeType === 2 || this.probeType === 3) {
        this.scroll.on('scroll', (position) => {
        this.$emit('scroll', position)
      
      })
    }
    if(this.pullUpLoad) {
      this.scroll.on('pullingUp', () => {
        // console.log('监听到了上拉加载更多');
        
        this.$emit('pullingUp')
      })
    }
    
    // this.scroll.scrollTo(0, 0 , 500) 封装为下面的方法
  },
  methods: {
    scrollTo(x, y, time = 500) {
      this.scroll && this.scroll.scrollTo(x, y, time) //this.scroll && 用于监听mounted里面的scroll是否创建完成，创建完成后才可以执行
    },
    finishPullUp() {
      this.scroll && this.scroll.finishPullUp()
    },
    refresh() {
      // console.log('--');
      
      this.scroll && this.scroll.refresh()
    },
    getScrollY() {
      return this.scroll ? this.scroll.y : 0
    }
  }
}

</script>
<style scoped>
</style>