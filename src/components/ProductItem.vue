<template>
    <li class="catalog__item">
        <router-link class="catalog__pic" :to="getLink">
            <img class="img" :src="imageUrl" :alt="product.title">
        </router-link>

        <h3 class="catalog__title">
            <a href="#">
                {{ product.title }}
            </a>
        </h3>

        <span class="catalog__price">
              {{ numberFormat(product.price) }} ₽
            </span>

        <ul class="colors colors--black">
            <li class="colors__item" v-for="color in product.colors" :key="color.id">
                <label class="colors__label" :id="color.color.title + product.id">
                    <input class="colors__radio sr-only" :id="color.color.title + product.id" type="radio" v-model="currentColor" :value="color">
                    <span class="colors__value" :style="{backgroundColor: color.color.code}">
                  </span>
                </label>
            </li>
        </ul>
    </li>
</template>

<script>
import numberFormat from "@/helpers/numberFormat";
import ProductFilter from "@/components/ProductFilter";
export default {
    name: "ProductItem",
    components: {
        ProductFilter
    },
    props: ['product'],
    data() {
        return {
            ProductFilter,
            currentColor: this.product.colors.filter(e => e.gallery)[0]
        };
    },
    computed: {
        getLink() {
            return `/product/${this.product.id}`
        },
        imageUrl() {
            if (this.currentColor.gallery) {
                return this.currentColor.gallery[0].file.url;
            }
            return null;
        },
    },
    methods: {
        numberFormat,
    },

}
</script>

<style scoped>
    .img {
        outline: 1px solid #cacaca;
        transition: outline-color .4s ease-in-out;
    }

    .img:hover {
        outline: 2px solid #e02d71;;
    }
</style>
