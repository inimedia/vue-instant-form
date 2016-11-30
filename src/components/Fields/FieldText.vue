<template>
  <input type="text" class="form-control"
         v-model="modelValue"
         @change="modelValueChanged"
         :name="field.name"
         :required="field.required"
         :disabled="field.disabled"
         :readonly="field.readonly"
         :placeholder="field.placeholder">
</template>
<script>
  import {isFunction} from 'lodash';
  export default{
    props: {
      field: Object,
      value: String
    },
    data: function () {
      return {
        modelValue: this.value
      }
    },
    watch: {
      value: function (val) {
        this.modelValue = val;
      }
    },
    methods: {
      modelValueChanged: function () {
        if (isFunction(this.field.onChanged)) {
          this.field.onChanged(this.modelValue);
        }
        this.$emit('input', this.modelValue);
      }
    }
  }
</script>
