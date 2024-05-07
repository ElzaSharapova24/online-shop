<template>
    <ul class="catalog__pagination pagination">
        <li class="pagination__item">
            <button class="pagination__link pagination__link--arrow"
                    :class="{'pagination__link--disabled': page === 1}"
                    aria-label="Предыдущая страница"
                    :disabled="page === 1"
                    @click.prevent = "paginate(this.page - 1)"
            >
                <svg width="8" height="14" fill="currentColor">
                    <use xlink:href="#icon-arrow-left"></use>
                </svg>
            </button>
        </li>
        <li class="pagination__item">
            <a class="pagination__link"
               href="#"
               v-for="pageNumber in getArray" :key="pageNumber"
               :class="{ 'pagination__link--current': pageNumber === page }"
               @click.prevent="paginate(pageNumber)"
            >
                {{ pageNumber }}
            </a>
        </li>
        <li class="pagination__item">
            <button class="pagination__link pagination__link--arrow" href="#"
                    :class="{'pagination__link--disabled': page === pages}"
               aria-label="Следующая страница"
               :disabled="page === pages"
               @click.prevent="paginate(this.page + 1)"
            >
                <svg width="8" height="14" fill="currentColor">
                    <use xlink:href="#icon-arrow-right"></use>
                </svg>
            </button>
        </li>
    </ul>
</template>

<script>
export default {
    name: "BasePagination",
    props: ['page', 'count', 'perPage'],
    computed: {
        pages() {
            return Math.ceil(this.count / this.perPage);
        },
        getArray() {
            const array = [];
            for (let i = 1; i <= this.pages; i += 1) {
                array.push(i);
            }
            return array;
        }
    },
    methods: {
        paginate(n) {
            this.$emit('paginate', n)
        }
    }
}
</script>

<style scoped>

</style>
