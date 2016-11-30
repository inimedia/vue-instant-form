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
  import {isNumber, isFunction, trimStart, floor, round, split, replace, debounce} from 'lodash';

  var currencyConditioner = function (val, kurs) {
//    console.log('currencyConditioner', val, kurs);
    if (!isNumber(val)) {
      val = parseFloat(val);
    }
    var nonDecimal = floor(val);
    var valDecimal = trimStart(String(round(val - nonDecimal, 2)), '0.');
    if (valDecimal.length == 1) {
      valDecimal += '0';
    }
    else if (valDecimal.length == 0) {
      valDecimal += '00';
    }

    if (nonDecimal == 0) {
      val = '0,' + valDecimal;
    }
    else {
      val = ',' + valDecimal;
//    console.log('middle', nonDecimal, valDecimal);
      while (nonDecimal > 0) {
        var mod = String(nonDecimal%1000);
        nonDecimal = floor(nonDecimal/1000);
//      console.log('while', nonDecimal, mod, mod.length);
        if (nonDecimal > 0) {
          switch(mod.length) {
            case 0: mod = '000'; break;
            case 1: mod = '00' + mod; break;
            case 2: mod = '0' + mod; break;
          }
          val = '.' + mod + val;
        } else {
          val = mod + val;
        }
      }
    }

    if (kurs) {
      val = kurs + ' ' + val;
    }
//    console.log('return', val);
    return val;
  };

  var parseCurrency = function (str) {
//    console.log('parseCurrency', str);
    if (isNumber(str)) {
      return str;
    }
    // trim unused chars
    str = replace(str, /[a-zA-Z\s&\/\\#+()$~%'":*?<>{}]/g, '');
    var splitedValue = split(str, ',');
    var valDecimal = '0.';
    if (splitedValue.length >= 2) {
      valDecimal += splitedValue[splitedValue.length-1];
      valDecimal = floor(parseFloat(valDecimal), 2);
      str = str.substring(0, str.indexOf(',' + splitedValue[splitedValue.length-1]));
    }
    else {
      valDecimal = 0;
    }
    var nonDecimal = floor(replace(str, /[.,]/g, ''));
//    console.log('return', nonDecimal + valDecimal);
    return nonDecimal + valDecimal
  };

  export default{
    props: [ 'field', 'value' ],
    data: function () {
      var vm = this;
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
        modelValue: currencyConditioner(value, 'Rp.')
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
        this.modelValue = currencyConditioner(value, 'Rp.');
      }
    },
    methods: {
      valueChanged: debounce(function () {
        var val = parseCurrency(this.modelValue);

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
        this.modelValue = currencyConditioner(val, 'Rp.');
      }, 300)
    },
    mounted: function () {}
  }
</script>
