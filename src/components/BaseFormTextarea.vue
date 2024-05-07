<template>
    <base-form-field>
        <textarea class="form__input form__input--area" name="comments"
                  v-model="dataValue" :placeholder="placeholder" ></textarea>
    </base-form-field>
</template>

<script>
import BaseFormField from "@/components/BaseFormField";
import FormFieldMixin from "@/mixins/formFieldMixin";
export default {
    name: "BaseFormTextarea",
    components: {BaseFormField},
    mixins: [FormFieldMixin]
}
</script>

<style scoped>

</style>
