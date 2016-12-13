<template>
  <form @submit.prevent="onSubmit()">
    <fieldset>
      <div class="form-group"
           v-for="(field, key) in formSchema"
           v-if="isFieldVisible(field)" :class="{ 'has-error': errorBags[key] }">
        <label class="control-label">{{ field.label }}</label>
        <component v-bind:is="getFieldComponent(field)"
                   :field="field"
                   :name="field.label"
                   v-model="formModel[key]"></component>
        <div class="help-block">
          <h6 v-if="field.help" style="margin: 0">{{ field.help }}</h6>
        </div>
      </div>
      <div class="text-right">
        <button class="btn btn-primary"
                type="submit"
                v-if="formActions.submit"
                :class="formActions.submit.class">
          <i v-if="formActions.submit.icon" :class="formActions.submit.icon"></i>
          {{ formActions.submit.label }}
        </button>
        <button class="btn btn-primary"
                type="button"
                v-if="formActions.reset"
                :class="formActions.reset.class"
                @click.prevent="onReset()">
          <i v-if="formActions.reset.icon" :class="formActions.reset.icon"></i>
          {{ formActions.reset.label }}
        </button>
        <button class="btn btn-primary"
                type="button"
                v-if="formActions.cancel"
                :class="formActions.cancel.class"
                @click.prevent="onCancel()">
          <i v-if="formActions.cancel.icon" :class="formActions.cancel.icon"></i>
          {{ formActions.cancel.label }}
        </button>
      </div>
    </fieldset>
  </form>
</template>
<script>
  // TODO: checkbox, radio, list, two column

  import { forEach, isFunction, isArray, isUndefined } from 'lodash';

  import FieldText from './Fields/FieldText.vue';
  import FieldEmail from './Fields/FieldEmail.vue';
  import FieldNumber from './Fields/FieldNumber.vue';
  import FieldPhoneNumber from './Fields/FieldPhoneNumber.vue';
  import FieldSelect from './Fields/FieldSelect.vue';
  import FieldSelect2 from './Fields/FieldSelect2.vue';
  import FieldDateTimePicker from './Fields/FieldDateTimePicker.vue';
  import FieldCurrency from './Fields/FieldCurrency.vue';
  import FieldAutoComplete from './Fields/FieldAutoComplete.vue';
  import FieldFileUpload from './Fields/FieldFileUpload.vue';
  import FieldMessage from './Fields/FieldMessage.vue';
  import FieldList from './Fields/FieldList.vue';
  import FieldTextarea from './Fields/FieldTextarea.vue';

  export default{
    props: {
      value: {
        type: Object,
        default: null
      },
      formSchema: {
        type: Object
      },
      formOptions: {
        type: Object
      },
      formActions: {
        type: Object
      }
    },
    data: function () {
      var vm = this;
      var formModel = {};
      if (this.value != null) {
        formModel = this.value;
      }
      forEach(this.formSchema, function (schema, key) {
        if (!isUndefined(formModel[key])) {}
        else if (schema.default || schema.default == 0) {
          vm.$set(formModel, key, schema.default);
        }
        else if (schema.type == 'select' || schema.type == 'select2') {
          if (schema.trackby) {
            vm.$set(formModel, key, {});
          }
          else {
            vm.$set(formModel, key, 0);
          }
        }
        else if (schema.type == 'text') {
          vm.$set(formModel, key, '');
        }
        else if (schema.type == 'number') {
          vm.$set(formModel, key, 0);
        }
        else if (schema.type == 'currency') {
          vm.$set(formModel, key, 0.0);
        }
        else if (schema.type == 'phone-number') {
          vm.$set(formModel, key, '0');
        }
        else if (schema.type == 'file-upload') {
          vm.$set(formModel, key, []);
        }
      });
      return {
        formModel: formModel,
        errorBags: {}
      }
    },
    components: {
      'field-text': FieldText,
      'field-email': FieldEmail,
      'field-number': FieldNumber,
      'field-phone-number': FieldPhoneNumber,
      'field-select': FieldSelect,
      'field-select2': FieldSelect2,
      'field-currency': FieldCurrency,
      'field-datetimepicker': FieldDateTimePicker,
      'field-autocomplete': FieldAutoComplete,
      'field-file-upload': FieldFileUpload,
      'field-message': FieldMessage,
      'field-list': FieldList,
      'field-textarea': FieldTextarea
    },
    methods: {
      onSubmit: function () {
        // TODO: Test validator
        var errorBags = {};
        var anyError = false;
        forEach(this.formSchema, function (schema, key) {
          if (schema.validator && isFunction(schema.validator)) {
            var result = schema.validator(this.formModel[key]);
            if(result !== true) {
              errorBags[key] = [ result ];
              anyError = true;
            }
          }
          else if(schema.validator && isArray(schema.validator)) {
            forEach(schema.validator, function (validator) {
              if (isFunction(validator)) {
                var result = validator(this.formModel[key]);
                if(result !== true) {
                  if (errorBags[key]) {
                    errorBags[key].push(result);
                    anyError = true;
                  }
                  else {
                    errorBags[key] = [ result ];
                    anyError = true;
                  }
                }
              }
            });
          }
        });
        if(anyError === true) {
          this.errorBags = errorBags;
          return;
        }

        if (this.formActions.submit && this.formActions.submit.handler && isFunction(this.formActions.submit.handler)) {
          this.formActions.submit.handler(this.formModel);
        }
      },
      onReset: function () {
        if (this.formActions.reset && this.formActions.reset.handler && isFunction(this.formActions.reset.handler)) {
          this.formActions.reset.handler(this.formModel);
        }
      },
      onCancel: function () {
        if (this.formActions.cancel && this.formActions.cancel.handler && isFunction(this.formActions.cancel.handler)) {
          this.formActions.cancel.handler(this.formModel);
        }
      },
      getFieldComponent: function (field) {
        return 'field-' + field.type;
      },
      isFieldVisible: function (field) {
        if (isUndefined(field.visible)) {
          return true;
        }
        else {
          return field.visible;
        }
      },
      reset: function () {
        var vm = this;
        forEach(this.formSchema, function (schema, key) {
          if (schema.default || schema.default == 0) {
            vm.formModel[key] = schema.default;
            console.log('default', schema.default, vm.formModel[key]);
          }
        });
        vm.errorBags = {};
      }
    },
    mounted: function () {
//      if (!window.jQuery || !window.$) {
//        console.error('SchemaForm Error @global: jquery not found. ' +
//          'Get it here: https://jquery.com/download/, please include the js file.');
//      }
    }
  };
</script>
<style>
</style>
