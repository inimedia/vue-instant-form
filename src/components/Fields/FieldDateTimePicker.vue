<template>
  <div class="input-group date">
    <input type="text" class="form-control" :placeholder="field.placeholder"
           v-model="modelValue"
           :name="field.name"
           :required="field.required"
           :readonly="field.readonly"
           :disabled="field.disabled">
    <span class="input-group-addon"><i class="fa" :class="[ icon ]"></i></span>
  </div>
</template>
<style>
</style>
<script>
  import { isFunction } from 'lodash';

  export default {
    mounted () {
      var vm = this;

      // handle datetimepicker not found...
      if (!isFunction($(vm.$el).datetimepicker)) {
        console.error('SchemaForm Error @datetimepicker: bootstrap-datetimepicker is not defined. ' +
          'Get it here: https://github.com/smalot/bootstrap-datetimepicker, please include both css and js files.');
        return;
      }

      var format = vm.field.format;
      var pickerPosition = vm.field.pickerPosition;
      var minView = vm.field.minView;
      var maxView = vm.field.maxView;
      if (vm.field.mode === 'datepicker') {
        format = 'dd/mm/yyyy';
        minView = 'month';
        maxView = 'decade';
      }
      else if (vm.field.mode === 'timepicker') {
        format = 'hh:ii';
        minView = 'hour';
        maxView = 1;
      }
      else if (vm.field.mode === 'datetimepicker') {
        format = 'dd/mm/yyyy hh:ii';
        minView = 'hour';
        maxView = 'decade';
      }

      if (vm.field.disabled !== true && vm.field.readonly !== true) {
        $(vm.$el).datetimepicker({
            format: format,
            pickerPosition: pickerPosition,
            autoclose: true,
            todayBtn: vm.field.mode !== 'timepicker',
            startView: vm.field.mode !== 'timepicker' ? 'month' : 'day',
            minView: minView,
            maxView: maxView,
            startDate: vm.field.mode !== 'timepicker' ? null : (moment().startOf('day').toDate())
          })
          .on('changeDate', function (ev) {
            vm.$emit('input', ev.date)
          })
      }
    },
    props: {
      placeholder: {
        type: String,
        default: ''
      },
      value: {
        type: Date,
        default: new Date()
      },
      format: {
        type: String,
        default: 'dd/mm/yyyy'
        // default: 'dd/mm/yyyy hh:ii'
      },
      pickerPosition: {
        type: String,
        default: 'bottom-left'
      },
      minView: {
        type: String,
        default: 'month'
      },
      maxView: {
        type: String,
        default: 'decade'
      },
      mode: {
        type: String,
        default: 'datepicker'
      },
      field: {
        type: Object,
        default: {}
      }
    },
    data: function () {
      var val = this.value;
      var icon = 'fa-calendar';
      var format = 'DD/MM/YYYY';
      if (this.mode === 'datepicker') {
        format = 'DD/MM/YYYY'
      }
      else if (this.mode === 'timepicker') {
        format = 'HH:mm';
        icon = 'fa-clock-o'
      }
      else if (this.mode === 'datetimepicker') {
        format = 'DD/MM/YYYY HH:mm'
      }
      if (val === '' || !(val instanceof Date)) {
        this.$emit('input', moment().toDate());
        val = moment().format(format)
      }
      else {
        this.$emit('input', moment(val).toDate());
        val = moment(val).format(format)
      }
      return {
        modelValue: val,
        icon: icon
      }
    },
    watch: {
      value: function (value) {
        var val = value;
        var format = 'DD/MM/YYYY';
        if (this.mode === 'datepicker') {
          format = 'DD/MM/YYYY'
        }
        else if (this.mode === 'timepicker') {
          format = 'HH:mm';
        }
        else if (this.mode === 'datetimepicker') {
          format = 'DD/MM/YYYY HH:mm'
        }
        if (val === '' || !(val instanceof Date)) {
          val = moment().format(format)
        }
        else {
          val = moment(val).format(format)
        }
        this.modelValue = val;
      }
    },
    destroyed: function () {
      $(this.$el).off()
    }
  }
</script>
