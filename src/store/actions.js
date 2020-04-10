import {ADD_COUNTER, ADD_TO_CART} from './mutation-types'
export default  {
  addCart(context, payload){
    return new Promise((resolve, reject) => {
      let oldProduct = null
      for(let item of context.state.cartList) {
        if(item.iid === payload.iid) {
          oldProduct = item
        }
      }
      if(oldProduct) {
        // oldProduct.count += 1 添加数量
        context.commit(ADD_COUNTER, oldProduct)
        resolve('数量加一')
      }else {
        payload.count = 1
        // context.state.cartList.push(payload) 添加商品
        context.commit(ADD_TO_CART, payload)
        resolve('物品加一')
      }
    })
   
  }
}