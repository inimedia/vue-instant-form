<template>
  <select class="form-control"
          v-model="modelValue"
          :name="field.name"
          :required="field.required"
          :disabled="field.disabled"
          :readonly="field.readonly"
          :placeholder="field.placeholder">
    <option v-if="field.options && field.options.length > 0"
            v-for="option in field.options"
            :value="option[optionValue]">{{ getOptionLabel(option, field) }}</option>
  </select>
</template>
<script>
  import {isObject, isUndefined, isFunction, isArray} from 'lodash';
  export default{
    props: [ 'field', 'value' ],
    data: function () {

      var value = '';
      var optionValue = 'id';

      if (this.field.trackby) {
//        console.log('init trackby');
        var objValue = null;
        if (!this.field.options || !isArray(this.field.options)) {
          this.field.options = [];
        }
        else {
          optionValue = this.field.trackby;

          if (!isObject(this.value)) {
            console.error('SchemaForm Error @FieldSelect: value is not an object! (trackby is activated)')
          }
//          else if (isUndefined(this.value[optionValue])) {
//            console.warn('SchemaForm Error @FieldSelect: value key of '+optionValue+' is undefined!');
//            optionValue = 'id';
//          }
          var keyValue = this.value[optionValue];

          if (!this.field.options || this.field.options.length == 0) {
            value = '';
            objValue = '';
          }
          else {
            value = this.field.options[0][optionValue];
            objValue = this.field.options[0];
          }
          for (var i=0;i<this.field.options.length;i++) {
            if (this.field.options[i][optionValue] == keyValue) {
              value = this.field.options[i][optionValue];
              objValue = this.field.options[i];
              break;
            }
          }
        }
        this.$emit('input', objValue);
      }

      else {
//        console.log('init NON trackby');
        if (!this.field.options || !isArray(this.field.options)) {
          this.field.options = [];
        }
        else {
          if (this.field.optionValue) {
            optionValue = this.field.optionValue;
          }

          if (!this.field.options || this.field.options.length == 0) {
            value = '';
          }
          else {
            value = this.field.options[0][optionValue];
          }
          for (var i=0;i<this.field.options.length;i++) {
            if (this.field.options[i][optionValue] == this.value) {
              value = this.field.options[i][optionValue];
              break;
            }
          }
        }
        this.$emit('input', value);
      }
//      console.log('init data', value, this.value);
      return {
        modelValue: value,
        optionValue: optionValue
      }
    },
    watch: {
      value: function (val) {
        var value = val;
        if (this.field.trackby) {
          var objValue = null;
          if (!this.field.options || !isArray(this.field.options)) {
            this.field.options = [];
          }
          else {
            this.optionValue = this.field.trackby;

            if (!isObject(this.value)) {
              console.error('SchemaForm Error @FieldSelect: value is not an object! (trackby is activated)')
            }
//            else if (isUndefined(this.value[this.optionValue])) {
//              console.warn('SchemaForm Error @FieldSelect: value key of '+this.optionValue+' is undefined!');
//              this.optionValue = 'id';
//            }
            var keyValue = this.value[this.optionValue];

            if (!this.field.options || this.field.options.length == 0) {
              value = '';
              objValue = '';
            }
            else {
              value = this.field.options[0][this.optionValue];
              objValue = this.field.options[0];
            }
            for (var i=0;i<this.field.options.length;i++) {
              if (this.field.options[i][this.optionValue] == keyValue) {
                value = this.field.options[i][this.optionValue];
                objValue = this.field.options[i];
                break;
              }
            }
          }
          this.$emit('input', objValue);
        }

        else {
          if (!this.field.options || !isArray(this.field.options)) {
            this.field.options = [];
          }
          else {
            this.optionValue = 'id';
            if (this.field.optionValue) {
              this.optionValue = this.field.optionValue;
            }

            if (!this.field.options || this.field.options.length == 0) {
              value = '';
            }
            else {
              value = this.field.options[0][this.optionValue];
            }
            for (var i=0;i<this.field.options.length;i++) {
              if (this.field.options[i][this.optionValue] == this.value) {
                value = this.field.options[i][this.optionValue];
                break;
              }
            }
          }
          this.$emit('input', value);
        }
        this.modelValue = value;
      },
      modelValue: function (val) {
        if (this.field.trackby) {
          var objValue = null;
          if (!this.field.options || !isArray(this.field.options)) {
            this.field.options = [];
          }
          else {
            this.optionValue = this.field.trackby;

            if (!this.field.options || this.field.options.length == 0) {
              objValue = '';
            }
            else {
              objValue = this.field.options[0];
            }
            for (var i=0;i<this.field.options.length;i++) {
              if (this.field.options[i][this.optionValue] == val) {
                objValue = this.field.options[i];
                break;
              }
            }
          }
          if (isFunction(this.field.onChanged)) {
            this.field.onChanged(objValue);
          }
          this.$emit('input', objValue);
        }
        else {
          if (isFunction(this.field.onChanged)) {
            this.field.onChanged(val);
          }
          this.$emit('input', val);
        }
      }
    },
    methods: {
      getOptionLabel: function (option, field) {
        if (field.optionCustomLabel && isFunction(field.optionCustomLabel)) {
          return field.optionCustomLabel(option);
        }
        else if (field.optionLabel) {
          return option[field.optionLabel];
        }
        else {
          return option['label']?option['label']:'?';
        }
      }
    },
    mounted: function () {
      if (!this.field.optionValue && !this.field.trackby) {
        console.error('Field Select Warning!!! No optionValue or trackby in select field!');
      }
    }
  }
</script>
