<template>
  <div id="home">
    <nav-bar class="home-nav">
      <div slot="center">购物街</div>
    </nav-bar>
     <tab-control :titles="['流行', '新款', '精选']" @tabClick="tabClick" ref="tabControl1" class="tab-control" v-show="isTopFixed">
      </tab-control>
    <scroll class="content" ref="scroll" 
        :probe-type="3"
        @scroll="contentScroll"
        :pull-up-load="true" 
        @pullingUp="loadMore">
      <home-swiper :banners="banners" @swiperImageLoad="swiperImageLoad"></home-swiper>
      <recommend-view :recommends="recommends"></recommend-view>
      <feature-view></feature-view>
      <tab-control :titles="['流行', '新款', '精选']" 
      @tabClick="tabClick" ref="tabControl2">
      </tab-control>
      <goods-list :goods="goods[currentType].list"></goods-list>
    </scroll>
    <back-top @click.native="backClick" v-show="isShowBackTop"></back-top>
  </div>
</template>
 
<script>
import NavBar from 'components/common/navbar/NavBar'
import TabControl from 'components/content/tabControl/TabControl'
import GoodsList from 'components/content/goods/GoodsList'
import Scroll from 'components/common/scroll/Scroll'
import backTop from 'components/content/backTop/backTop'

import HomeSwiper from './childComs/HomeSwiper'
import RecommendView from './childComs/RecommendView'
import FeatureView from './childComs/FeatureView'

import {getHomeMultidata, getHomeGoods} from 'network/home'
import {debounce} from 'common/utils'

export default {
  name: "Home",
  data () {
    return {
      banners: [],
      recommends: [],
      goods: {
        'pop': {page: 0, list:[]},
        'new': {page: 0, list:[]},
        'sell': {page: 0, list:[]},
      },
      currentType: 'pop',
      isShowBackTop: false,
      tabOffsetTop: 0,
      isTopFixed: false,
      saveY: 0
    }
  },
  components: {
    NavBar,
    TabControl,
    GoodsList,
    Scroll,
    backTop,
    HomeSwiper,
    RecommendView,
    FeatureView
  },
  created () {
    this.getHomeMultidata(),
    this.getHomeGoods('pop'),
    this.getHomeGoods('new'),
    this.getHomeGoods('sell')

  },
  mounted () {
    const refresh = debounce(this.$refs.scroll.refresh, 500)
    this.$bus.$on('homeItemImageLoad', () => { //监听GoodsListItem中的homeItemImageLoad事件
      refresh()
      //所有组件都有$el属性。用于获取组件中的元素
      // console.log(this.$refs.tabControl.$el.offsetTop);
    })
    
   
  },
  methods: {
    tabClick(index) {
      switch(index){
        case 0:
          this.currentType = 'pop'
          break
        case 1:
          this.currentType = 'new'
          break
        case 2:
          this.currentType = 'sell'
          break
      }
     this.$refs.tabControl1.currentIndex = index;
     this.$refs.tabControl2.currentIndex = index;
    },
    backClick() {
      this.$refs.scroll.scrollTo(0, 0 , 500)
    },
    contentScroll(position) {
      // console.log(position);
      this.isShowBackTop = -position.y > 1500
      this.isTopFixed = (-position.y) > this.tabOffsetTop
      
    },
    loadMore() {
      // console.log('加载更多');
      this.getHomeGoods(this.currentType)
      
    },
    swiperImageLoad() {
      this.tabOffsetTop = this.$refs.tabControl2.$el.offsetTop //用于获取图片高度
      
    },
  
    //以下是网络请求的代码
    getHomeMultidata() {
      getHomeMultidata().then(res => {
      this.banners = res.data.data.banner.list;
      this.recommends = res.data.data.recommend.list;
    }).catch(err => {
      console.log(err);
    })
    },
    getHomeGoods(type) {
      const page = this.goods[type].page + 1
      getHomeGoods(type, page).then(res => {
        // console.log(res);
        this.goods[type].list.push(...res.data.data.list)
        this.goods[type].page += 1
        this.$refs.scroll.finishPullUp()
       
      })
    }
    
  },
  computed: {
    showGoods() {
      return this.goods[this.currentType].list
    }
  },
  activated () {
      this.$refs.scroll.scrollTo(0, this.saveY, 0)
      this.$refs.scroll.refresh()
    },
  deactivated () {
    this.saveY = this.$refs.scroll.getScrollY()
  }

}

</script>
<style scoped>
#home{
  /* padding-top: 44px; */
  height: 100vh;
  position: relative;
}
.home-nav{
  background-color: var(--color-tint);
  color: #ffffff;

  /* position: fixed;
  left: 0;
  right: 0;
  top: 0;
  z-index: 9; */
}
/** 这个position: sticky;属性为 固定定位到一定的高度*/
/* .tab-control{
  line-height: 50px;
  height: 50px;
  position: sticky;
  top: 44px;
  background-color: white;
  z-index: 9;
} */
.tab-control{

  position: relative;
  z-index: 9;
}
.content{
  overflow: hidden;
  position: absolute;
  top: 44px;
  bottom: 49px;
  left: 0;
  right: 0;
}
/* .content {
  margin-top: 44px;
  overflow: hidden;
  height: calc(100% - 93);
} */
</style>