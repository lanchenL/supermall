<template>
  <div>
    <swiper>
      <swiper-item v-for="(item, index) in banners" :key="index">
        <a :href="item.link">
          <img :src="item.image" alt="" @load="imggeLoad">
        </a>
      </swiper-item>
    </swiper>
  </div>
</template>

<script>
import {Swiper, SwiperItem} from 'components/common/swiper/index'
export default {
  name: "HomeSwiper",
  props:  {
    banners: {
      type: Array,
      default() {
        return []
      }
    }
  },
  data () {
    return {
      isLoad: false  
    }
  },
  components: {
    Swiper,
    SwiperItem
  },
  methods: {
    imggeLoad() {
    if (!this.isLoad) {
       this.$emit('swiperImageLoad')
       this.isLoad = true
    }
     
    }
  }

}

</script>
<style scoped>
</style>