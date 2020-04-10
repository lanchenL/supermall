<template>
  <div id="detail">
    <detail-nav-bar class="detail-nav" @titleClick="titleClick" ref="detailNav"></detail-nav-bar>
    
    <scroll class="content" ref="scroll" @scroll="contentScroll" :probe-type="3">
    <detail-swiper :top-images="topImages"></detail-swiper>
    <detail-base-info :goods="goods"></detail-base-info>
    <detail-shop-info :shop="shop"></detail-shop-info>
    <detail-goods-info :detail-info="detailInfo" @imageLoad="imageLoad"></detail-goods-info>
    <!-- <detail-params ></detail-params> -->
    <detail-param-info :param-info="paramInfo" ref="params"></detail-param-info>
    <detail-comment-info :comment-info="commentInfo" ref="comment"></detail-comment-info>
    <goods-list :goods="getRecommends" ref="recommend"></goods-list>
   </scroll>
   <detail-bottom-bar @addToCart="addToCart" class="detail-bottom-var"></detail-bottom-bar>
   <back-top @click.native="backClick" v-show="isShowBackTop"></back-top>
   <!-- <toast :message="message" :show="show"></toast> -->
    
  </div>
</template>

<script>
import DetailNavBar from 'views/detail/childComps/DetailNavBar'
import DetailSwiper from './childComps/DetailSwiper'
import DetailBaseInfo from './childComps/DetailBaseInfo'
import DetailShopInfo from './childComps/DetailShopInfo'
import DetailGoodsInfo from './childComps/DetailGoodsInfo'
import DetailParams from './childComps/DetailParams'
import DetailParamInfo from './childComps/DetailParamInfo'
import DetailCommentInfo from './childComps/DetailCommentInfo'
import DetailBottomBar from './childComps/DetailBottomBar'

import Scroll from 'components/common/scroll/Scroll'
import GoodsList from 'components/content/goods/GoodsList'
//进行了混入
import backTop from 'components/content/backTop/backTop'
// import Toast from 'components/common/toast/Toast'

import {getDetail , Goods, Shop ,GoodsParam, getRecommend} from 'network/detail'
import {debounce} from 'common/utils'
import {backTopMixin} from 'common/mixin'

export default {
  name: "Detail",
  data () {
    return {
      iid: null,
      topImages: [],
      goods: {},
      shop:{},
      detailInfo: {},
      paramInfo: {},
      commentInfo: {},
      getRecommends: [],
      themeTopYs: [],
      getThemeTopY: null,
      currentIndex: 0,
      // message: '111',
      // show: false
      //进行了混入
      // isShowBackTop: false
    }
  },
  mixins: [backTopMixin],
  methods: {
    imageLoad() {
      this.$refs.scroll.refresh()
      this.getThemeTopY()
    },
    titleClick(index) {
      // console.log(index);
      this.$refs.scroll.scrollTo(0, -this.themeTopYs[index], 200)
    },
    contentScroll(position) {
      const positionY = -position.y
      let length = this.themeTopYs.length
      for(let i = 0; i < length; i++){
        // if( positionY > this.themeTopYs[i] && positionY < this.themeTopYs[i+1]){
        //   console.log(i);
        //需要在上面的themeTops中加入push  (Number.MAX_VALUE)在最后
        // }
        if(this.currentIndex !== i && ((i < length - 1 && positionY >= this.themeTopYs[i] &&
        positionY < this.themeTopYs[i+1]) || (i === length - 1 && positionY >= this.themeTopYs[i]))){
          this.currentIndex = i;
          console.log(this.currentIndex);
          this.$refs.detailNav.currentIndex = this.currentIndex
          
        }
      }
      //用于显示什么时候显示出来返回的图标
      this.isShowBackTop = -position.y > 1500
    },
    //进行了混入
    // backClick() {
    //   this.$refs.scroll.scrollTo(0, 0 , 500)
    // }
    addToCart() {
      // console.log("...");
      const product = {}
      product.image = this.topImages[0]
      product.title = this.goods.title
      product.desc = this.goods.desc
      product.price = this.goods.realPrice
      product.iid = this.iid
     // this.$store.commit('addCart', product) 这个是间接操作state里面的数据
     //用操作action的方法
     this.$store.dispatch('addCart', product).then(res => {
      this.$toast.show(res, 2000)
      //  console.log(res);
      //  this.show = true
      //  this.message = res
      //  setTimeout(() => {
      //    this.show = false
      //    this.message = ''
      //  }, 2000);
     })
    }
  },
  created () {
    this.iid = this.$route.params.iid,
    getDetail(this.iid).then(res => {
      // console.log(res);
      const data = res.data.result
      //轮播图信息
      this.topImages = data.itemInfo.topImages
      //商品详情信息
      this.goods = new Goods(data.itemInfo, data.columns, data.shopInfo.services)
      //创建店铺者的信息
      this.shop = new Shop(data.shopInfo)
      //保存商品数据
      this.detailInfo = data.detailInfo
      //获取参数信息
      this.paramInfo = new GoodsParam(data.itemParams.info, data.itemParams.rule)
      // console.log(this.paramInfo);
      //获取评论相关信息
       if (data.rate.cRate !== 0) {
          this.commentInfo = data.rate.list[0]
        }
    }),
    getRecommend().then(res => {
      // console.log(res);
      this.getRecommends = res.data.data.list
      // console.log(this.getRecommends);
    })
    // updated()dom没有渲染 有数据更新时有用 $nextTick() 当dom进行渲染完后，但是部分图片没有加载,高度没计算,在created(不能获取元素)，
    //mounted没有获取到数据

    this.getThemeTopY = debounce(() => {
    this.themeTopYs = []
    this.themeTopYs.push(0);
    this.themeTopYs.push(this.$refs.params.$el.offsetTop)
    this.themeTopYs.push(this.$refs.comment.$el.offsetTop)
    this.themeTopYs.push(this.$refs.recommend.$el.offsetTop)
    console.log(this.themeTopYs);
    })
  },
  mounted () {
     const refresh = debounce(this.$refs.scroll.refresh, 500)
     this.$bus.$on('detailItemImageLoad', () => { //监听GoodsListItem中的detailItemImageLoad事件
      refresh()
    })
    
    
  },
  components: {
    DetailNavBar,
    DetailSwiper,
    DetailBaseInfo,
    DetailShopInfo,
    Scroll,
    DetailGoodsInfo,
    DetailParams,
    DetailParamInfo,
    DetailCommentInfo,
    GoodsList,
    DetailBottomBar,
    backTop
    // Toast
  }
}

</script>
<style scoped>
#detail {
  position: relative;
  z-index: 9;
  background-color: #fff;
  height: 100vh;
}
.content {
  height: calc(100% - 44px - 49px);
}
.detail-nav {
  position: relative;
  z-index: 9;
  background-color: #fff;
}

</style>