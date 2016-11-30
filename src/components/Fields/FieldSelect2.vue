<template>
  <select class="form-control" style="width: 100%; height: 34px;"
          :name="field.name"
          :disabled="field.disabled"
          :readonly="field.readonly"
          :required="field.required"
          :placeholder="field.placeholder">
    <option v-if="field.options && field.options.length > 0"
            v-for="option in field.options"
            :value="option[optionValue]">{{ getOptionLabel(option, field) }}
    </option>
  </select>
</template>
<script>
  import {isFunction, isUndefined, isObject, isArray} from 'lodash';
  export default{
    props: ['field', 'value'],
    mounted: function () {
      var vm = this;
      if (!vm.field.optionValue && !vm.field.trackby) {
        console.error('Field Select Warning!!! No optionValue or trackby provided!');
      }

      // handle select2 not found...
      if (!isFunction($(vm.$el).select2)) {
        console.error('SchemaForm Error @select2: select2 is not found. ' +
          'Get it here: https://select2.github.io, please include both css and js files.');
        return;
      }

      $(vm.$el)
        //init select2
        .select2()
        // emit event on change
        .on('change', function () {
          var value = '';
          var optionValue = '';
          vm.modelValue = $(vm.$el).val();

          if (vm.field.trackby) {
            var objValue = null;
            if (!vm.field.options || !isArray(vm.field.options)) {
              vm.field.options = [];
            }
            else {
              optionValue = vm.field.trackby;

              if (!isObject(vm.value)) {
                console.error('SchemaForm Error @FieldSelect: value is not an object! (trackby is activated)')
              }
//              else if (isUndefined(vm.value[optionValue])) {
//                console.warn('SchemaForm Error @FieldSelect: value key of '+optionValue+' is undefined!');
//                optionValue = 'id';
//              }
              var keyValue = vm.modelValue;

              value = vm.field.options[0][optionValue];
              objValue = vm.field.options[0];
              for (var i=0;i<vm.field.options.length;i++) {
                if (vm.field.options[i][optionValue] == keyValue) {
                  value = vm.field.options[i][optionValue];
                  objValue = vm.field.options[i];
                  break;
                }
              }
            }
            vm.$emit('input', objValue);
          }

          else {
            if (!vm.field.options || !isArray(vm.field.options)) {
              vm.field.options = [];
            }
            else {
              if (vm.field.optionValue) {
                optionValue = vm.field.optionValue;
              }
              value = vm.field.options[0][optionValue];
              for (var i=0;i<vm.field.options.length;i++) {
                if (vm.field.options[i][optionValue] == vm.modelValue) {
                  value = vm.field.options[i][optionValue];
                  break;
                }
              }
            }
            vm.$emit('input', value);
          }
          vm.modelValue = value;

          /*
          var value = '';
          if (!vm.field.options || !isArray(vm.field.options)) {
            vm.field.options = [];
          }
          else {
            var optionValue = 'id';
            if (vm.field.optionValue) {
              optionValue = vm.field.optionValue;
            }
            value = vm.field.options[0][optionValue];
            for (var i = 0; i < vm.field.options.length; i++) {
              if (vm.field.options[i][optionValue] == vm.modelValue) {
                value = vm.field.options[i][optionValue];
                break;
              }
            }
          }
          vm.modelValue = value;
          vm.$emit('input', vm.modelValue)
          */
        });
      $(vm.$el).select2('val', String(vm.modelValue));
    },
    data: function () {
      var value = '';
      var optionValue = '';

      if (this.field.trackby) {
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

          value = this.field.options[0][optionValue];
          objValue = this.field.options[0];
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
        if (!this.field.options || !isArray(this.field.options)) {
          this.field.options = [];
        }
        else {
          if (this.field.optionValue) {
            optionValue = this.field.optionValue;
          }
          value = this.field.options[0][optionValue];
          for (var i=0;i<this.field.options.length;i++) {
            if (this.field.options[i][optionValue] == this.value) {
              value = this.field.options[i][optionValue];
              break;
            }
          }
        }
        this.$emit('input', value);
      }

      /*
      if (!this.field.options || !isArray(this.field.options)) {
        this.field.options = [];
      }
      else {
        var optionValue = 'id';
        if (this.field.optionValue) {
          optionValue = this.field.optionValue;
        }
        value = this.field.options[0][optionValue];
        for (var i = 0; i < this.field.options.length; i++) {
          if (this.field.options[i][optionValue] == this.value) {
            value = this.field.options[i][optionValue];
            break;
          }
        }
      }
      this.$emit('input', value);
      $(this.$el).select2('val', value);
      console.warn('init', value, this.value);
      */
      return {
        modelValue: value,
        optionValue: optionValue
      }
    },
    watch: {
      value: function (val) {
        var value = val;
        var optionValue = this.optionValue;

        if (this.field.trackby) {
          var objValue = null;
          if (!this.field.options || !isArray(this.field.options)) {
            this.field.options = [];
          }
          else {
            optionValue = this.field.trackby;

            if (!isObject(this.value)) {
              console.error('SchemaForm Error @FieldSelect: value is not an object! (trackby is activated)')
            }
            else if (isUndefined(this.value[optionValue])) {
              console.warn('SchemaForm Error @FieldSelect: value key of '+optionValue+' is undefined!');
              optionValue = 'id';
            }
            var keyValue = this.value[optionValue];

            value = this.field.options[0][optionValue];
            objValue = this.field.options[0];
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
          if (!this.field.options || !isArray(this.field.options)) {
            this.field.options = [];
          }
          else {
            if (this.field.optionValue) {
              optionValue = this.field.optionValue;
            }
            value = this.field.options[0][optionValue];
            for (var i=0;i<this.field.options.length;i++) {
              if (this.field.options[i][optionValue] == this.value) {
                value = this.field.options[i][optionValue];
                break;
              }
            }
          }
          this.$emit('input', value);
        }

        this.modelValue = value;
        $(this.$el).select2('val', String(value));
      }
    },
    destroyed: function () {
      $(this.$el).off().select2('destroy')
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
    }
  }
</script>
<style>
  .select2-container .select2-selection--single {
    height: 34px
  }

  .select2-container--default .select2-selection--single .select2-selection__arrow {
    height: 32px
  }

  .select2-container--default .select2-selection--single .select2-selection__rendered {
    line-height: 32px
  }

  .select2-container .select2-selection--multiple {
    height: 34px
  }

  .select2-container--default .select2-selection--multiple .select2-selection__arrow {
    height: 32px
  }

  .select2-container--default .select2-selection--multiple .select2-selection__rendered {
    line-height: 32px
  }

  .select2-container--default .select2-selection--multiple .select2-selection__rendered li {
    line-height: 26px;
    height: 27px;
    margin: 3px;
    padding: 0px 5px;
  }
</style>
