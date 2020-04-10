<template>
  <div class="goods-item">
    <img v-lazy="shopImage" alt="" @load="imageLoad" @click="itemClick">
    <div class="goods-info">
      <p>{{goodsItem.title}}</p>
      <span class="price">{{goodsItem.price}}</span>
      <span class="collect">{{goodsItem.cfav}}</span>
    </div>
  </div>
</template>

<script>
export default {
  name: "GoodsListItem",
  props: {
    goodsItem: {
      type: Object,
      default() {
        return {}
      }
    }
  },
  methods: {
    imageLoad() {
      
      if(this.$route.path.indexOf('/home')) {
        this.$bus.$emit('homeItemImageLoad') //监听home中的刷新,另一个解决方法时进行混入（类似类的继承）mixins
      }else if(this.$route.path.indexOf('/detail')) {
        this.$bus.$emit('detailItemImageLoad') //监听detail中的刷新
      }
    },
    itemClick() {
      this.$router.push('/detail/' + this.goodsItem.iid)
      
    }
  },
  computed: {
    shopImage() {
      return this.goodsItem.image || this.goodsItem.show.img
    }
  }

}

</script>
<style scoped>
 .goods-item {
   padding-top: 60px;
    padding-bottom: 40px;
    position: relative;

    width: 48%;
  }

  .goods-item img {
    width: 100%;
    border-radius: 5px;
  }

  .goods-info {
    font-size: 12px;
    position: absolute;
    bottom: 5px;
    left: 0;
    right: 0;
    overflow: hidden;
    text-align: center;
  }

  .goods-info p {
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
    margin-bottom: 3px;
  }

  .goods-info .price {
    color: var(--color-high-text);
    margin-right: 20px;
  }

  .goods-info .collect {
    position: relative;
  }

  .goods-info .collect::before {
    content: '';
    position: absolute;
    left: -15px;
    top: -1px;
    width: 14px;
    height: 14px;
    background: url("~assets/img/common/collect.svg") 0 0/14px 14px;
  }
</style>