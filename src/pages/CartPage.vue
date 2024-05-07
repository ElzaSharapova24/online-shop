<template>
    <main class="content container">
        <div class="content__top">
            <ul class="breadcrumbs">
                <li class="breadcrumbs__item">
                    <router-link to="/" class="breadcrumbs__link">
                        Каталог
                    </router-link>
                </li>
                <li class="breadcrumbs__item">
                    <a class="breadcrumbs__link">
                        Корзина
                    </a>
                </li>
            </ul>

            <div class="content__row">
                <h1 class="content__title">
                    Корзина
                </h1>
                <span class="content__info">
                 {{$store.state.cartProductsData.length}}
        </span>
            </div>
        </div>
        <h2 class="product__load" v-if="this.$store.state.cartLoading"><img class="spinner" src="/img/Spinner-3.gif"></h2>
        <h2 class="product__load-fail" v-if="this.$store.state.cartLoadingFailed">Произошла ошибка при загрузке товаров<button class="btn" @click.prevent="this.$store.state.loadCart">Попробовать еще раз</button></h2>
        <section class="cart">
            <form class="cart__form form" action="#" method="POST">
                <div class="cart__field">
                    <ul class="cart__list">
                        <cart-item  v-for="item in products"
                                    :key="item.productId.toString() + '+' + item.size.id.toString() + '+' + item.color.color.id"
                                    :item="item"/>
                    </ul>
                </div>

                <div class="cart__block">
                    <p class="cart__desc">
                        Мы&nbsp;посчитаем стоимость доставки на&nbsp;следующем этапе
                    </p>
                    <p class="cart__price">
                        Итого: <span>{{ numberFormat(totalPrice) }} ₽</span>
                    </p>

                    <router-link :to="{name: 'order'}"
                        v-if="$store.state.cartProductsData.length > 0" tag="button"
                        class="cart__button button button--primery" type="submit">
                        Оформить заказ
                    </router-link>
                </div>
            </form>
        </section>
    </main>
</template>

<script>
import CartItem from "@/components/CartItem";
import numberFormat from "@/helpers/numberFormat";
import {mapGetters} from "vuex";
export default {
    name: "CartPage",
    components: {CartItem},
    methods: {
        numberFormat,

    },
    computed: {
        ...mapGetters({products: 'cartDetailProducts', totalPrice: 'cartTotalPrice'}),
    },
}
</script>

<style scoped>
.product__load {
    position: relative;
}
    .spinner {
       position: absolute;
        left: 30%;
    }
</style>
