<template>
    <main class="content container">
        <div class="content__top">
            <ul class="breadcrumbs">
                <li class="breadcrumbs__item">
                    <router-link class="breadcrumbs__link" :to="{name: 'main'}">
                        Каталог
                    </router-link>
                </li>
                <li class="breadcrumbs__item">
                    <router-link class="breadcrumbs__link" :to="{name: 'cart'}">
                        Корзина
                    </router-link>
                </li>
                <li class="breadcrumbs__item">
                    <router-link class="breadcrumbs__link" :to="{name: 'order'}">
                        Оформление заказа
                    </router-link>
                </li>
            </ul>

            <h1 class="content__title">
                Заказ оформлен <span>№ {{this.$store.state.orderInfo.basket.id}}</span>
            </h1>
        </div>

        <section class="cart">
            <form class="cart__form form" action="#" method="POST">
                <div class="cart__field">
                    <p class="cart__message">
                        Благодарим за&nbsp;выбор нашего магазина. На&nbsp;Вашу почту придет письмо с&nbsp;деталями заказа.
                        Наши менеджеры свяжутся с&nbsp;Вами в&nbsp;течение часа для уточнения деталей доставки.
                    </p>

                    <ul class="dictionary">
                        <li class="dictionary__item">
              <span class="dictionary__key">
                Получатель
              </span>
                            <span class="dictionary__value">
                 {{ this.$store.state.orderInfo.name }}
              </span>
                        </li>
                        <li class="dictionary__item">
              <span class="dictionary__key">
                Адрес доставки
              </span>
                            <span class="dictionary__value">
                {{ this.$store.state.orderInfo.address }}
              </span>
                        </li>
                        <li class="dictionary__item">
              <span class="dictionary__key">
                Телефон
              </span>
                            <span class="dictionary__value">
                {{ this.$store.state.orderInfo.phone }}
              </span>
                        </li>
                        <li class="dictionary__item">
              <span class="dictionary__key">
                Email
              </span>
                            <span class="dictionary__value">
                {{ this.$store.state.orderInfo.email }}
              </span>
                        </li>
                        <li class="dictionary__item">
              <span class="dictionary__key">
                Способ оплаты
              </span>
                            <span class="dictionary__value">
                {{ this.$store.state.orderInfo.paymentType }}
              </span>
                        </li>
                    </ul>
                </div>

                <div class="cart__block">
                    <ul class="cart__orders"  v-for="item in this.$store.state.orderInfo.basket.items"
                        :key="item.productId" :item="item">
                        <li class="cart__order">
                            <h3>{{ item.product.title }}, {{item.quantity}} шт.</h3>
                            <b>{{  numberFormat(item.product.price * item.quantity) }} ₽</b>
                            <span>Артикул: {{ item.product.id }}</span>
                        </li>
                    </ul>

                    <div class="cart__total">
                        <p>Доставка: <b>бесплатно</b></p>
                        <p>Итого: <b>{{ this.$store.state.orderInfo.basket.items.length }} </b>
                            {{wordEndingByNumber(this.$store.state.orderInfo.basket.items.length)}} на сумму <b>{{ numberFormat(this.$store.state.orderInfo.totalPrice) }} ₽</b></p>
                    </div>
                </div>
            </form>
        </section>
    </main>
</template>

<script>
import numberFormat from "@/helpers/numberFormat";
import wordEndingByNumber from "@/helpers/wordEndingByNumber";
import {mapGetters} from "vuex";
export default {
    name: "OrderInfoPage",
    methods: {
        numberFormat,
        wordEndingByNumber,
    },
    created() {
        if (this.$store.state.orderInfo && this.$store.state.orderInfo.id === this.$route.params.id){
            return;
        }
        this.$store.dispatch('loadOrderInfo', this.$route.params.id)
    },
    computed: {
        ...mapGetters({products: 'cartDetailProducts', totalPrice: 'cartTotalPrice'}),
    },
}
</script>

<style scoped>

</style>
