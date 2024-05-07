<template>
    <main class="content container">
        <div class="content__top">
            <div class="content__row">
                <h1 class="content__title">
                    Каталог
                </h1>
            </div>
        </div>

        <div class="content__catalog">
            <product-filter
                v-model:price-from="filterPriceFrom"
                v-model:price-to="filterPriceTo"
                v-model:category-id="filterCategoryId"
                v-model:material-ids="materialIds"
                v-model:season-ids="seasonIds"
                v-model:color-ids="colorIds"
            />

            <section class="catalog">
                <h2 class="product__load" v-show="productLoading">
                    <img class="spinner" src="/img/Spinner-3.gif" />
                </h2>
                <h2 class="product__load-fail" v-show="productsLoadingFailed">
                    Произошла ошибка при загрузке товаров
                    <button class="btn" @click.prevent="loadProducts">
                        Попробовать еще раз
                    </button>
                </h2>

                <product-list :products="products"/>
                <base-pagination
                    @paginate="(n) => (this.page = n)"
                    :page="page"
                    :count="countProducts"
                    :per-page="productsPerPage"
                />
            </section>
        </div>
    </main>
</template>

<script>
import ProductFilter from "@/components/ProductFilter";
import ProductList from "@/components/ProductList";
import BasePagination from "@/components/BasePagination";
import axios from "axios";
import {BASE_API_URL} from "@/config";
export default {
    name: "MainPage",
    components: {BasePagination, ProductFilter, ProductList},
    data() {
        return {
            filterPriceFrom: 0,
            filterPriceTo: 0,
            filterCategoryId: 0,

            page: 1,
            productsPerPage: 12,

            productsData: null,

            productLoading: false,
            productsLoadingFailed: false,
            materialIds: [],
            seasonIds: [],
            colorIds: [],
        };
    },
    computed: {
        products() {
            return this.productsData
                ? this.productsData.items
                : [];
        },
        countProducts() {
            return this.productsData ? this.productsData.pagination.total : 0;
        },
    },
    methods: {
        loadProducts: function () {
            this.productLoading = true;
            this.productsLoadingFailed = false;
            clearTimeout(this.loadProductsTimer);
            this.loadProductsTimer = setTimeout(() => {
                return axios
                    .get(BASE_API_URL + `/api/products`, {
                        params: {
                            page: this.page,
                            limit: this.productsPerPage,
                            categoryId: this.filterCategoryId,
                            minPrice: this.filterPriceFrom,
                            maxPrice: this.filterPriceTo,
                            materialIds: this.materialIds,
                            seasonIds: this.seasonIds,
                            colorIds: this.colorIds,
                        },
                    })
                    .then((response) => (this.productsData = response.data))
                    .catch(() => (this.productsLoadingFailed = true))
                    .then(() => (this.productLoading = false));
            }, 1000);
        }
    },
    watch: {
        page() {
            this.loadProducts();
        },
        filterCategoryId() {
            this.loadProducts();
        },
        filterPriceFrom() {
            this.loadProducts();
        },
        filterPriceTo() {
            this.loadProducts();
        },
        materialIds() {
            this.loadProducts();
        },
        seasonIds() {
            this.loadProducts();
        },
        colorIds() {
            this.loadProducts();
        },
    },
    created() {
        this.loadProducts();
    },
}
</script>

<style scoped>
    .product__load {
        margin-left: auto;
        margin-right: auto;
    }

    .btn {
        padding: 10px 15px;
        background-color: #e02d71;
        border: none;
        color: #150c26;
        font-size: 15px;
        transition: background .3s ease-in-out, linear .3s;
    }

    .btn:hover {
        background: rgb(224,45,113);
        background: radial-gradient(circle, rgba(224,45,113,1) 0%, rgba(252,70,107,1) 100%);
    }

    .spinner {
        width: 150px;
        height: 150px;
    }
</style>
