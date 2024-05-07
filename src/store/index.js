import { createStore } from 'vuex'
import axios from "axios";
import {BASE_API_URL} from "@/config";

export default createStore({
  state: {
      cartProducts: [],
      userAccessKey: null,

      cartProductsData: [],

      cartLoading: true,
      cartLoadingFailed: false,
      orderInfo: null,
  },
  getters: {
      cartDetailProducts(state) {
          return state.cartProducts.map((item) => {
              const currentItem = state.cartProductsData.find((p) => p.id === item.id);
              if (!currentItem)
                  return null;
              return {
                  ...item,
                  ...currentItem,
                  // product: {
                  //     ...product,
                  //     // image: product.image.file.url,
                  // },

              };
          }).filter(e => e != null);
      },
      cartTotalPrice(state, getters) {
          return getters.cartDetailProducts.reduce(
              (acc, item) => item.price * item.amount + acc,
              0
          );
      },
  },
  mutations: {
      updateOrderInfo(state, orderInfo) {
          state.orderInfo = orderInfo;
      },
      resetCart(state) {
          state.cartProducts = [];
          state.cartProductsData = [];
      },
      updateCartProductAmount(state, { productId, amount }) {
          const item = state.cartProducts.find((item) => item.productId === productId);

          if (item) {
              item.amount = amount;
          }
      },
      deleteCartProduct(state, productId) {
          state.cartProducts = state.cartProducts.filter((item) => item.productId !== productId);
      },
      updateUserAccessKey(state, assessKey) {
          state.userAccessKey = assessKey;
      },
      updateCartProductData(state, items) {
          state.cartProductsData = items;
      },
      setCartLoadingFalse(state) {
          state.cartLoading = false;
      },
      setCartLoadingFailedTrue(state) {
          state.cartLoadingFailed = true;
      },
      syncCartProduct(state) {
          state.cartProducts = state.cartProductsData.map((item) => {
              return {
                  id: item.id,
                  productId: item.product.id,
                  amount: item.quantity,
              };
          });
      },
  },
  actions: {
      loadOrderInfo(context, orderId) {
          return axios
              .get(BASE_API_URL + `/api/orders/` + orderId, {
                  params: {
                      userAccessKey: context.state.userAccessKey,
                  },
              })
              .then((response) => {
                  context.commit("updateOrderInfo", response.data);
              });
      },
      loadCart(context) {
          clearTimeout(this.cartLoadingFailed);
          this.cartLoadingFailed = setTimeout(() => {
              return axios
                  .get(BASE_API_URL + `/api/baskets`, {
                      params: {
                          userAccessKey: context.state.userAccessKey,
                      },
                  })
                  .then((response) => {
                      if (!context.state.userAccessKey) {
                          localStorage.setItem("userAccessKey", response.data.user.accessKey);
                          context.commit("updateUserAccessKey", response.data.user.accessKey);
                      }
                      context.commit("updateCartProductData", response.data.items);
                      context.commit("syncCartProduct");
                  })
                  .catch(() => context.commit("setCartLoadingFailedTrue"))
                  .then(() => context.commit("setCartLoadingFalse"));
          }, 3000);
      },
      addProductCart(context, data) {
          return new Promise((resolve) => setTimeout(resolve, 2000)).then(() => {
              return axios
                  .post(
                      BASE_API_URL + `/api/baskets/products`,
                      data,
                      {
                          params: {
                              userAccessKey: context.state.userAccessKey,
                          },
                      }
                  )
                  .then((response) => {
                      context.commit("updateCartProductData", response.data.items);
                      context.commit("syncCartProduct");
                  });
          });
      },
      updateCartProductAmount(context, { productId, amount }) {
          context.commit("updateCartProductAmount", { productId, amount });
          if (amount < 1) {
              return;
          }
          return axios
              .put(
                  BASE_API_URL + "/api/baskets/products",
                  {
                      basketItemId: productId.toString(),
                      quantity: amount.toString(),
                  },
                  {
                      params: {
                          userAccessKey: context.state.userAccessKey,
                      },
                  }
              )
              .then((response) => {
                  context.commit("updateCartProductData", response.data.items);
                  context.commit("syncCartProduct");
              })
              .catch(() => {
                  context.commit("syncCartProduct");
              });
      },
      deleteCartProduct(context, productId) {
          context.commit("deleteCartProduct", productId);
          return axios
              .delete(BASE_API_URL + `/api/baskets/products`, {
                  params: {
                      userAccessKey: context.state.userAccessKey,
                  },
                  data: {
                      basketItemId: productId.toString(),
                  },
              })
              .then((response) => {
                  context.commit("updateCartProductData", response.data.items);
              });
      },
  },
  modules: {
  }
})
