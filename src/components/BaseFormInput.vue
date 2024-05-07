<template>
    <base-form-field :title="title" :error="error">
        <input class="form__input" v-model="dataValue" :type="type" name="name" :placeholder="placeholder">
    </base-form-field>
</template>

<script>
import BaseFormField from "@/components/BaseFormField";
import FormFieldMixin from "@/mixins/formFieldMixin";
export default {
    name: "BaseFormInput",
    components: {BaseFormField},
    props: {
        type: {
            default: 'text'
        }
    },
    mixins: [FormFieldMixin]
}
</script>

<style scoped>

</style>
