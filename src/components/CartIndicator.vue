<template>
    <router-link class="header__cart" :to="getName"
                 aria-label="Корзина с товарами">
        <svg width="19" height="24">
            <use xlink:href="#icon-cart"></use>
        </svg>
        <span v-if="this.$store.state.cartLoading" class="header__count" aria-label="Количество товаров">
        </span>
        <span v-if="this.$store.state.cartLoading" class="header__count" aria-label="Количество товаров"></span>
        <span v-if="!this.$store.state.cartLoading"
              class="header__count" aria-label="Количество товаров">
            {{$store.state.cartProductsData.length}}
        </span>
    </router-link>
</template>

<script>
import CartPage from "@/pages/CartPage";
export default {
    name: "CartIndicator",
    components: {
        CartPage
    },
    computed: {
        getName() {
            return `/cart`
        }
    }
}
</script>

<style scoped>

</style>
