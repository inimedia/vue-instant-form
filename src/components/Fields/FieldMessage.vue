<template>
  <div></div>
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
    }
  }
</script>
