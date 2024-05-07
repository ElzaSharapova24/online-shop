import BaseFormField from '@/components/BaseFormField';

export default {
    components: {
        BaseFormField,
    },
    props:[
        'title',
        'error',
        'placeholder',
    ],
    data() {
        return {
            value: ""
        }
    },
    computed: {
        dataValue: {
            get() {
                return this.value;
            },
            set(value) {
                this.value = value;
                this.$emit('update:input', value);
            }
        }
    },
};
