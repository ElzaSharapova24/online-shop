<template>
    <aside class="filter">
        <form class="filter__form form" action="#" method="get" @submit.prevent="submit">
            <fieldset class="form__block">
                <legend class="form__legend">Цена</legend>
                <label class="form__label form__label--price">
                    <input class="form__input" type="text" name="min-price"
                           v-model.number="currentPriceFrom">
                    <span class="form__value">От</span>
                </label>
                <label class="form__label form__label--price">
                    <input class="form__input" type="text" name="max-price"
                           v-model.number="currentPriceTo">
                    <span class="form__value">До</span>
                </label>
            </fieldset>

            <fieldset class="form__block">
                <legend class="form__legend">Категория</legend>
                <label class="form__label form__label--select" for="category">
                    <select class="form__select" name="category"
                            v-model.number="currentCategoryId">
                        <option value="0">Все категории</option>
                        <option :value="category.id" v-for="category in categories" :key="category.id">
                            {{ category.title }}
                        </option>
                    </select>
                </label>
            </fieldset>

            <fieldset class="form__block">
                <legend class="form__legend">Цвет</legend>
                <ul class="colors">
                    <li class="colors__item" v-for="color in colors" :key="color.id">
                        <label class="colors__label" :for="color.title">
                            <input class="colors__radio sr-only"
                                   type="checkbox"
                                   :id="color.title"
                                   name="color"
                                   :value="color.id"
                                   v-model="colorIds"
                            />
                            <span class="colors__value" :style="{backgroundColor: color.code}"></span>
                        </label>
                    </li>
                </ul>
            </fieldset>

            <fieldset class="form__block">
                <legend class="form__legend">Материал</legend>
                <ul class="check-list">
                    <li class="check-list__item" v-for="material in materials" :key="material.id">
                        <label class="check-list__label" :for="material.title">
                            <input class="check-list__check sr-only"
                                   type="checkbox"
                                   :id="material.title"
                                   name="material"
                                   :value="material.id"
                                   v-model="materialIds"
                            >
                            <span class="check-list__desc">
                    {{material.title}} ({{material.productsCount}})
                  </span>
                        </label>
                    </li>
                </ul>
            </fieldset>

            <fieldset class="form__block">
                <legend class="form__legend">Коллекция</legend>
                <ul class="check-list">
                    <li class="check-list__item" v-for="season in seasons" :key="season.id">
                        <label class="check-list__label" :for="season.title">
                            <input class="check-list__check sr-only"
                                   type="checkbox"
                                   name="collection"
                                   :value="season.id"
                                   :id="season.title"
                                   v-model="seasonIds"
                            >
                            <span class="check-list__desc">
                    {{ season.title }} ({{season.productsCount}})
                  </span>
                        </label>
                    </li>
                </ul>
            </fieldset>

            <button class="filter__submit button button--primery" type="submit">
                Применить
            </button>
            <button class="filter__reset button button--second" type="button"
                    @click.prevent="reset"
                    v-if="showResetButton"
            >
                Сбросить
            </button>
        </form>
    </aside>
</template>

<script>
import axios from 'axios';
import {BASE_API_URL} from "@/config";
export default {
    name: "ProductFilter",
    data() {
        return {
            currentPriceFrom: 0,
            currentPriceTo: 0,
            currentCategoryId: 0,
            currentColor: null,
            colorsData: null,
            materialsData: null,
            seasonsData: null,
            categoriesData: null,
            materialIds: [],
            seasonIds: [],
            colorIds: [],
        }
    },
    methods: {
        submit() {
            this.$emit('update:price-from', this.currentPriceFrom);
            this.$emit('update:price-to', this.currentPriceTo);
            this.$emit('update:category-id', this.currentCategoryId);
            this.$emit('update:material-ids', this.materialIds);
            this.$emit('update:season-ids', this.seasonIds);
            this.$emit('update:color-ids', this.colorIds);
        },

        reset() {
            this.currentPriceFrom = 0;
            this.currentPriceTo = 0;
            this.currentCategoryId = 0;
            this.materialIds = [];
            this.seasonIds = [];
            this.colorIds = [];
            this.submit();
        },
        loadColors: function () {
            axios.get(BASE_API_URL + `/api/colors`)
                .then(response => (this.colorsData = response.data))
        },
        loadMaterials: function () {
            axios.get(BASE_API_URL + `/api/materials`)
                .then(response => (this.materialsData = response.data))
        },
        loadCategories: function () {
            axios.get(BASE_API_URL +`/api/productCategories`)
                .then(response => this.categoriesData = response.data)
        },
        loadSeasons: function () {
            axios.get(BASE_API_URL +`/api/seasons`)
                .then(response => this.seasonsData = response.data)
        }
    },
    computed: {
        categories() {
            return this.categoriesData ? this.categoriesData.items : [];
        },
        colors() {
            return this.colorsData ? this.colorsData.items : [];
        },
        materials() {
            return this.materialsData ? this.materialsData.items : [];
        },
        seasons() {
            return this.seasonsData ? this.seasonsData.items : [];
        },
        showResetButton() {
            return this.currentPriceFrom !== 0
                || this.currentPriceTo !== 0
                || this.currentCategoryId !== 0
                || this.materialIds.length !== 0
                || this.seasonIds.length !== 0
                || this.colorIds.length !== 0;
        },
    },
    watch: {
        page() {
            this.loadColors();
        },
    },
    created() {
        this.loadCategories();
        this.loadColors();
        this.loadMaterials();
        this.loadSeasons();
    }
}
</script>

<style scoped>
    .colors__item {
        margin-bottom: 10px;
    }
    

    .colors__radio:checked ~ .colors__value {
        outline: 2px solid #a2a2a2;
        outline-offset: 3px;
    }


</style>
