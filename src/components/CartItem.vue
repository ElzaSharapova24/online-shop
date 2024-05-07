<template>
    <li class="cart__item product" :key="item.productId">
        <div class="product__pic">
            <img :src="item.color.gallery[0].file.url" width="120" height="120"  :alt="item.product.title">
        </div>
        <h3 class="product__title">
            Размер: {{item.size.title}}
        </h3>
        <p class="product__info product__info--color">
            Цвет: {{item.color.color.title}}
            <span>
                  <i :style="{backgroundColor: item.color.color.code}"></i>
                </span>
        </p>
        <span class="product__code">
               Артикул:  {{ item.product.id }}
              </span>

        <div class="product__counter form__counter">
            <button type="button" aria-label="Убрать один товар"  @click="() => amount--">
                <svg width="10" height="10" fill="currentColor">
                    <use xlink:href="#icon-minus"></use>
                </svg>
            </button>

            <input type="text" v-model.number="amount" name="count">

            <button type="button" aria-label="Добавить один товар" @click="() => amount++">
                <svg width="10" height="10" fill="currentColor">
                    <use xlink:href="#icon-plus"></use>
                </svg>
            </button>
        </div>

        <b class="product__price">
            {{ numberFormat(item.amount * item.product.price) }} ₽
        </b>

        <button class="product__del button-del"
                type="button"
                @click.prevent='deleteCartProduct(item.id)'
                aria-label="Удалить товар из корзины">
            <svg width="20" height="20" fill="currentColor">
                <use xlink:href="#icon-close"></use>
            </svg>
        </button>
    </li>

</template>

<script>
import numberFormat from "@/helpers/numberFormat";
import {mapActions, mapMutations} from "vuex";
export default {
    name: "CartItem",
    props: ['item'],
    computed: {
        amount: {
            get() {
                return this.item.amount
            },
            set(value) {
                this.$store.dispatch('updateCartProductAmount', {productId: this.item.id, amount: value});
            },
        },

    },
    methods: {
        numberFormat,
        ...mapMutations({deleteCartProduct: 'deleteCartProduct'}),
        ...mapActions( ['deleteCartProduct']),
    },
}
</script>

<style scoped>

</style>
