<template>
    <main class="content container" v-if="product">
        <div class="content__top">
            <ul class="breadcrumbs">
                <li class="breadcrumbs__item">
                    <router-link class="breadcrumbs__link" to="/">
                        Каталог
                    </router-link>
                </li>
                <li class="breadcrumbs__item">
                    <router-link class="breadcrumbs__link" to="/">
                        {{ category.title }}
                    </router-link>
                </li>
                <li class="breadcrumbs__item">
                    <a class="breadcrumbs__link">
                        {{ product.title }}
                    </a>
                </li>
            </ul>
        </div>

        <section class="item">
            <div class="item__pics pics">
                <div class="pics__wrapper">
                    <img width="570" height="570" :src="imageUrl" alt="Название товара">
                </div>
                <ul class="pics__list" v-if="imageUrl">
                    <li class="pics__item" v-for="item in this.currentColor.gallery">
                        <a href="" class="pics__link pics__link--current">
                            <img width="98" height="98" :src="item.file.url" alt="Название товара">
                        </a>
                    </li>
                </ul>
            </div>

            <div class="item__info">
<!--                <span class="item__code">{{ product.id }}</span>-->
                <h2 class="item__title">
                    {{ product.title }}
                </h2>
                <div class="item__form">
                    <form class="form" action="#" method="POST" @submit.prevent="addToCart">
                        <div class="item__row item__row--center">
                            <div class="form__counter">
                                <button type="button" aria-label="Убрать один товар" @click="productsAmount--" :disabled="productsAmount === 1">
                                    <svg width="12" height="12" fill="currentColor">
                                        <use xlink:href="#icon-minus"></use>
                                    </svg>
                                </button>

                                <input type="text" :value="productsAmount" disabled name="count">

                                <button type="button" aria-label="Добавить один товар" @click="productsAmount++">
                                    <svg width="12" height="12" fill="currentColor">
                                        <use xlink:href="#icon-plus"></use>
                                    </svg>
                                </button>
                            </div>

                            <b class="item__price">
                                {{numberFormat(product.price * productsAmount) }} ₽
                            </b>
                        </div>

                        <div class="item__row">
                            <fieldset class="form__block">
                                <legend class="form__legend">Цвет</legend>
                                <ul class="colors colors--black">
                                    <li class="colors__item" v-for="color in product.colors" :key="color.id">
                                        <label class="colors__label" :id="color.color.title + product.id">
                                            <input class="colors__radio sr-only"
                                                   type="radio" name="color-item"
                                                   :value="color"
                                                   :id="color.color.title + product.id"
                                                   v-model="currentColor"
                                            >
                                            <span class="colors__value" :style="{backgroundColor: color.color.code}">
                      </span>
                                        </label>
                                    </li>
                                </ul>
                            </fieldset>


                            <fieldset class="form__block">
                                <legend class="form__legend">Размер</legend>
                                <label class="form__label form__label--small form__label--select">
                                    <select class="form__select" type="text" name="category" v-model="currentSize">
                                        <option :value="size.id" v-for="size in product.sizes">{{size.title}}</option>
                                    </select>
                                </label>
                            </fieldset>
                        </div>

                        <button class="item__button button button--primery" type="submit" :disabled="productAddSending">
                            В корзину
                        </button>
                        <h2 v-show="productAdded">Товар успешно добавлен в корзину!</h2>
                        <h2 class="add__cart" v-show="productAddSending">Добавляем товар в корзину<img class="spinner" src="/img/Spinner-3.gif"></h2>
                    </form>
                </div>
            </div>

            <div class="item__desc">
                <ul class="tabs">
                    <li class="tabs__item">
                        <a :class="'tabs__link' + (this.isDelivery ? '' : ' tabs__link--current')" @click.prevent="this.isDelivery = false;">
                            Информация о товаре
                        </a>
                    </li>
                    <li class="tabs__item">
                        <a :class="'tabs__link' + (this.isDelivery ? ' tabs__link--current' : '')" @click.prevent="this.isDelivery = true;">
                            Доставка и возврат
                        </a>
                    </li>
                </ul>
                <product-info v-if="!isDelivery"/>
                <product-delivery-and-return v-if="isDelivery"/>
            </div>
        </section>
    </main>
</template>

<script>
import numberFormat from "@/helpers/numberFormat";
import ProductInfo from "@/components/ProductInfo";
import ProductDeliveryAndReturn from "@/components/ProductDeliveryAndReturn";
import axios from "axios";
import {BASE_API_URL} from "@/config";
import {mapActions} from "vuex";
export default {
    name: "ProductPage",
    components: {ProductDeliveryAndReturn, ProductInfo},
    data() {
        return {
            productData: null,
            productLoading: false,
            productLoadingFailed: false,

            productsAmount: 1,

            productAdded: false,
            productAddSending: false,
            currentColor: null,
            currentSize: null,
            isDelivery: false,
        }
    },
    props: ['pageParams'],
    computed: {
        product() {
            return this.productData;
        },
        category() {
            return this.productData.category;
        },
        imageUrl() {
            if (this.currentColor && this.currentColor.gallery) {
                return this.currentColor.gallery[0].file.url;
            }
            return null;
        },
    },

    methods: {
        numberFormat,

        ...mapActions(['addProductCart']),

        addToCart() {
            this.productAdded = false;
            this.productAddSending = true;


            this.addProductCart({
                productId: this.product.id.toString(),
                colorId: this.currentColor.color.id.toString(),
                sizeId: this.currentSize.toString(),
                quantity: this.productsAmount.toString()
            })
                .then(() => {
                    this.productAdded = true;
                    this.productAddSending = false;
                    setTimeout(() => {
                        this.$router.push({name: 'main'});
                    }, 500);

                });
        },


        loadProducts() {
            this.productLoading = true;
            this.productLoadingFailed = false;
            return axios
                .get(BASE_API_URL +`/api/products/` + this.$route.params.id)
                .then(response => {
                    this.productData = response.data;
                    this.setDefaults();
                })
                .catch(() =>  this.productLoadingFailed = true)
                .then(() =>  this.productLoading = false);
        },
        setDefaults() {
            this.currentColor = this.productData ? this.productData.colors.filter(e => e.gallery)[0] : null;
            this.currentSize = this.productData ? this.productData.sizes[0].id : null;
        }
    },
    created() {
        this.loadProducts()
    },
    watch: {
        '$route.params.id'() {
            this.loadProducts()
        }
    }

}
</script>

<style scoped>
    .add__cart {
        display: flex;
        align-items: center;
    }

    .spinner {
        width: 40px;
        height: 40px;
    }
</style>
