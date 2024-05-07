<template>
    <ul class="catalog__list">
        <product-item
            v-for='product in products'
            :product="product"
            :key="product.id"
        />
    </ul>
</template>

<script>
import ProductItem from "@/components/ProductItem";
export default {
    name: "ProductList",
    components: {ProductItem},
    props: ['products']
}
</script>

<style scoped>

</style>
