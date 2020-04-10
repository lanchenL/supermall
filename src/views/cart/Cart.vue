<template>
  <div class="cart">
    <nav-bar class="nav-bar">
      <div slot="center">购物车({{cartLength}})</div>
    </nav-bar>
    <cart-list></cart-list>
    <cart-bottom-bar></cart-bottom-bar>
  </div>
</template>

<script>
import NavBar from 'components/common/navbar/NavBar'
import CartList from './childComs/CartList'
import CartBottomBar  from './childComs/CartBottomBar'

import {mapGetters} from 'vuex'
export default {
  name: "Cart",
  components: {
    NavBar,
    CartList,
    CartBottomBar
  },
 
  computed: {
    // cartLength() {
      // return this.$store.getters.cartLength
      
    // }
    ...mapGetters(['cartLength'])
  }

}

</script>
<style scoped>
.cart {
  height: 100vh;
}
.nav-bar {
  background-color: var(--color-tint);
  color: #ffffff;
}
</style>