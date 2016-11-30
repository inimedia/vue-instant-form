<template>
  <input type="text" class="form-control"
         v-model="modelValue"
         :name="field.name"
         :required="field.required"
         :disabled="field.disabled"
         :readonly="field.readonly"
         :placeholder="field.placeholder">
</template>
<script>
  import {isFunction, cloneDeep} from 'lodash';
  export default{
    mounted: function () {

      if (!isFunction($(this.$el).autocomplete)) {
        console.error('SchemaForm Error @autocomplete: autocomplete not found. ' +
          'Get it here: https://github.com/devbridge/jQuery-Autocomplete/tree/master/dist, please include the js file.');
        return;
      }

      var lookupOptions = [];

      for (var i=0; i<this.field.options.length; i++) {
        lookupOptions.push({
          data: this.field.options[i],
          value: this.field.options[i]
        });
      }
      var vm = this;
      $(vm.$el).autocomplete({
        lookup: lookupOptions,
        onSelect: function (suggestion) {
          vm.modelValue = suggestion.value;
          vm.$emit('input', vm.modelValue);
        }
      });
    },
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
      },
      modelValue: function (val) {
        this.$emit('input', this.modelValue);
      }
    }
  }
</script>

<style>
  .autocomplete-suggestions {
    border: 1px solid #aaa;
    background: #FFF;
    overflow: auto;
    border-top-left-radius: 3px;
    border-top-right-radius: 3px;
    border-bottom-left-radius: 5px;
    border-bottom-right-radius: 5px;
  }
  .autocomplete-suggestion { padding: 5px 7px; white-space: nowrap; overflow: hidden; }
  .autocomplete-selected { background: #F0F0F0; }
  .autocomplete-suggestions strong { font-weight: normal; color: #3399FF; }
  .autocomplete-group { padding: 2px 5px; }
  .autocomplete-group strong { display: block; border-bottom: 1px solid #000; }
</style>
