<template>
    <header class="header container">
        <div class="header__wrapper">
            <span class="header__info">Каталог</span>

            <div class="header__logo">
                <img src="img/svg/logo-moire.svg" alt="Логотип интернет магазина Moire" width="116" height="34">
            </div>

            <a class="header__tel" href="tel:8 800 600 90 09">
                8 800 600 90 09
            </a>

            <a class="header__cart" href="cart.html" aria-label="Корзина с товарами">
                <svg width="19" height="24">
                    <use xlink:href="#icon-cart"></use>
                </svg>
                <span class="header__count" aria-label="Количество товаров">3</span>
            </a>
        </div>
    </header>
</template>

<script>
export default {
    name: "MainHeader"
}
</script>

<style scoped>

</style>
