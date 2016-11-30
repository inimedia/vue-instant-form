<template>
  <input type="text" class="form-control"
         v-model="modelValue"
         :name="field.name"
         :required="field.required"
         :disabled="field.disabled"
         :readonly="field.readonly"
         @keyup="valueChanged"
         :placeholder="field.placeholder">
</template>
<script>
  import {isFunction, forEach, replace, debounce} from 'lodash';

  var phoneNumberConditioner = function (val) {
//    console.log('phoneNumberConditioner', val);
    val = replace(val, /[a-zA-Z\s&\/\\#+\-()$~%'":*./?<>{}]/g, '');
    var splitted = val.match(/.{1,3}/g);
    if (splitted) {
      val = '';
      for (var i=0; i<splitted.length; i++) {
        val += splitted[i];
        if (i < splitted.length-1) {
          val += '-';
        }
      }
    }
    else {
      val = '0';
    }
//    console.warn('return', val);
    return val;
  };

  var parsePhoneNumber = function (str) {
//    console.log('parsePhoneNumber', str);
    str = replace(str, /[a-zA-Z\s&\/\\#+()\-$~%'":*./?<>{}]/g, '');
//    console.warn('return', str);
    return str;
  };

  export default{
    props: [ 'field', 'value' ],
    data: function () {
      var vm = this;
      var value = 0;
      if (!this.value && this.field.default) {
        value = this.field.default;
      }
      else {
        value = this.value;
      }
      if (this.field.min && value < this.field.min) {
        value = this.field.min;
      }
      else if (this.field.max && value > this.field.max) {
        value = this.field.max;
      }
      this.$emit('input', value);

      return {
        modelValue: phoneNumberConditioner(value)
      }
    },
    watch: {
      value: function (val) {
        var value = val;
        if (!this.value && this.field.default) {
          value = this.field.default;
        }
        else {
          value = this.value;
        }
        if (this.field.min && value < this.field.min) {
          value = this.field.min;
        }
        else if (this.field.max && value > this.field.max) {
          value = this.field.max;
        }
        this.modelValue = phoneNumberConditioner(value);
      }
    },
    methods: {
      valueChanged: debounce(function () {
        var val = parsePhoneNumber(this.modelValue);

        if (this.field.min && val < this.field.min) {
          val = this.field.min;
        }
        else if (this.field.max && val > this.field.max) {
          val = this.field.max;
        }

        if (isFunction(this.field.onChanged)) {
          this.field.onChanged(val);
        }

        this.$emit('input', val);
        this.modelValue = phoneNumberConditioner(val);
      }, 100)
    },
    mounted: function () {}
  }
</script>
