<template>
  <input type="number" class="form-control"
         v-model="modelValue"
         :step="field.step"
         :min="field.min"
         :max="field.max"
         :name="field.name"
         :required="field.required"
         :disabled="field.disabled"
         :readonly="field.readonly"
         :placeholder="field.placeholder">
</template>
<script>
  import {isFunction} from 'lodash';
  export default{
    props: [ 'field', 'value' ],
    data: function () {
      var value = 0;
      if (!this.value && this.field.default) {
        value = parseFloat(this.field.default);
      }
      else {
        value = parseFloat(this.value);
      }
      if (this.field.min && value < this.field.min) {
        value = this.field.min;
      }
      else if (this.field.max && value > this.field.max) {
        value = this.field.max;
      }
      this.$emit('input', value);
      return {
        modelValue: value
      }
    },
    watch: {
      value: function (val) {
        var value = val;
        if (!this.value && this.field.default) {
          value = parseFloat(this.field.default);
        }
        else {
          value = parseFloat(this.value);
        }
        if (this.field.min && value < this.field.min) {
          value = this.field.min;
        }
        else if (this.field.max && value > this.field.max) {
          value = this.field.max;
        }
        this.modelValue = value;
      },
      modelValue: function (val) {
        if (isFunction(this.field.onChanged)) {
          this.field.onChanged(val);
        }
        this.$emit('input', val);
      }
    },
    mounted: function () {
//      console.log('mounted', this.modelValue, this.value);
    }
  }
</script>
