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
                    <a class="breadcrumbs__link">
                        Оформление заказа
                    </a>
                </li>
            </ul>

            <div class="content__row">
                <h1 class="content__title">
                    Оформление заказа
                </h1>
            </div>
        </div>

        <section class="cart">
            <h2 v-if="formIsSending" class="product__load" v-show="submitOrder"><img class="spinner" src="/img/Spinner-3.gif"></h2>
            <form class="cart__form form" action="#" method="POST" @submit.prevent="submitOrder">
                <div class="cart__field">
                    <div class="cart__data">
                        <BaseFormInput v-model:input="formData.name" type="text" :error="formError.name" title="ФИО" placeholder="Введите ваше полное имя"></BaseFormInput>
                        <BaseFormInput v-model:input="formData.address" type="text" :error="formError.address" title="Адрес доставки" placeholder="Введите ваш адрес"></BaseFormInput>
                        <BaseFormInput v-model:input="formData.phone" type="tel" :error="formError.phone" title="Телефон" placeholder="Введите ваш телефон"></BaseFormInput>
                        <BaseFormInput v-model:input="formData.email" type="email" :error="formError.email" title="Email" placeholder="Введи ваш Email"></BaseFormInput>
                        <BaseFormTextarea title="Комментарий к заказу" v-model:input="formData.comment" :error="formError.comment" placeholder="Ваши пожелания"></BaseFormTextarea>
                    </div>

                    <div class="cart__options">
                        <h3 class="cart__title">Доставка</h3>
                        <ul class="cart__options options">
                            <li class="options__item"
                                v-for="delivery in deliveries"
                                :key="delivery.id"
                            >
                                <label class="options__label">
                                    <input class="options__radio sr-only" type="radio" name="delivery" :value="delivery.id"
                                           v-model="formData.deliveryTypeId" @change="getPayments()">
                                    <span class="options__value">
                                        {{delivery.title}}
                                    </span>
                                </label>
                            </li>
                        </ul>

                        <h3 class="cart__title">Оплата</h3>
                        <ul class="cart__options options">
                            <li class="options__item"
                                v-for="payment in payments"
                                :key="payment.id">
                                <label class="options__label">
                                    <input class="options__radio sr-only" type="radio" name="pay" :value="payment.id"
                                        v-model="formData.paymentTypeId">
                                    <span class="options__value">
                                        {{payment.title}}
                                    </span>
                                </label>
                            </li>
                        </ul>
                    </div>
                </div>

                <div class="cart__block">
                    <ul class="cart__orders" v-for="item in products" :key="item.productId">
                        <li class="cart__order">
                            <h3>{{ item.product.title }}, {{item.amount}} шт.</h3>
                            <b>{{  numberFormat(item.product.price * item.amount) }} ₽</b>
                            <span>Артикул: {{ item.product.id }}</span>
                        </li>
                    </ul>

                    <div class="cart__total">
                        <p>Доставка: <b>{{parseInt(this.currentDelivery.price) ? (this.currentDelivery.price.toString() + ' р.') : 'бесплатно'}}</b></p>
                        <p>Итого: <b>{{$store.state.cartProductsData.length}}</b>
                            {{wordEndingByNumber($store.state.cartProductsData.length)}} на сумму <b>{{ numberFormat(totalPrice + parseInt(this.currentDelivery.price)) }} ₽</b></p>
                    </div>

                    <button class="cart__button button button--primery" type="submit">
                        Оформить заказ
                    </button>
                </div>
                <div class="cart__error form__error-block" v-if="formErrorMessage">
                    <h4>{{ formErrorMessage }}</h4>
                    <p>
                        Похоже произошла ошибка. Попробуйте отправить снова или перезагрузите страницу.
                    </p>
                </div>
            </form>
        </section>
    </main>
</template>

<script>
import BaseFormInput from "@/components/BaseFormInput";
import BaseFormTextarea from "@/components/BaseFormTextarea";
import axios from "axios";
import {BASE_API_URL} from "@/config";
import {mapGetters} from "vuex";
import numberFormat from "@/helpers/numberFormat";
import wordEndingByNumber from "@/helpers/wordEndingByNumber";
export default {
    name: "OrderPage",
    components: {BaseFormTextarea, BaseFormInput},
    data() {
        return {
            formData: {},
            formError: {},
            formErrorMessage: '',
            formIsSending: false,
            deliveries: [],
            payments: [],
        }
    },
    methods: {
        numberFormat,
        wordEndingByNumber,
        getDeliveries() {
            axios
                .get(BASE_API_URL + `/api/deliveries`, {
                    params: {
                        userAccessKey: this.$store.state.userAccessKey,
                    },
                })
                .then(response => {
                    this.deliveries = response.data;
                    this.formData.deliveryTypeId = this.deliveries.length > 0 ? this.deliveries[0].id : null;
                    this.getPayments();
                })
        },
        getPayments() {
            axios
                .get(BASE_API_URL + `/api/payments`, {
                    params: {
                        deliveryTypeId: this.formData.deliveryTypeId,
                        userAccessKey: this.$store.state.userAccessKey,
                    },
                })
                .then(response => {
                    this.payments = response.data;
                    this.formData.paymentTypeId = this.payments.length > 0 ? this.payments[0].id : null;
                })
        },
        submitOrder() {
            this.formError = {};
            this.formErrorMessage = '';
            this.formIsSending = true;
            axios
                .post(BASE_API_URL + `/api/orders`, {...this.formData}, {
                    params: {
                        userAccessKey: this.$store.state.userAccessKey,
                    },
                })
                .then(response => {
                    this.formIsSending = false;
                    this.$store.commit('resetCart');
                    this.$store.commit('updateOrderInfo', response.data);
                    this.$router.push({name: 'orderInfo', params: {id: response.data.id}});
                })
                .catch(error => {
                    this.formIsSending = false;
                    this.formError = error.response.data.error.request || {};
                    this.formErrorMessage = error.response.data.error.message;
                })
        }
    },
    computed: {
        ...mapGetters({products: 'cartDetailProducts', totalPrice: 'cartTotalPrice'}),
        amount: {
            get() {
                return this.item.amount
            },
            set(value) {
                this.$store.dispatch('updateCartProductAmount', {productId: this.item.productId, amount: value});
            },
        },
        currentDelivery() {
            const delivery = this.deliveries.filter(e => e.id === this.formData.deliveryTypeId)[0];
            return delivery || {price: 0};
        }
    },
    mounted() {
        this.getDeliveries();
    }

}
</script>

<style scoped>

</style>
