<template>
  <ul class="list-group">
    <li v-for="row in value"
        class="list-group-item"
        :class="getRowClassAndContext(row)">
      {{ getRowLabel(row) }}
      <a v-if="hasLink(row)" :href="getRowLink(row)"><i class="fa fa-external-link-square"></i></a>
      <span class="badge" v-if="hasBadge(row)">
        {{ getRowBadge(row) }}
      </span>
    </li>
  </ul>
</template>
<script>
  import {isObject, isUndefined, isFunction, isArray} from 'lodash';
  export default{
    props: {
      field: {
        type: Object,
        default: {}
      },
      value: {
        type: Array,
        default: []
      }
    },
    data: function () {
      var value = this.value;
      return {
        modelValue: value
      }
    },
    watch: {
      value: function (val) {
        var value = val;
        this.$emit('input', objValue);
        this.modelValue = value;
      }
    },
    methods: {
      getRowLabel: function (row) {
        if (this.field.rowLabel)
          return row[this.field.rowLabel]?row[this.field.rowLabel]:'?';
        else
          return '?';
      },
      hasBadge: function (row) {
        if (this.field.rowBadge)
          return (!isUndefined(row[this.field.rowBadge]));
        else
          return false;
      },
      getRowBadge: function (row) {
        if (this.field.rowBadge)
          return (!isUndefined(row[this.field.rowBadge])) ? row[this.field.rowBadge] : '?';
        else
          return '?'
      },
      getRowClassAndContext: function (row) {
        var rowClass = '';
        if (this.field.rowClass && row[this.field.rowClass]) {
          rowClass += row[this.field.rowClass] + ' ';
        }
        if (row[this.field.rowContext]) {
          rowClass += 'list-group-item-' + row[this.field.rowContext] + ' ';
        }
        if (this.field.disabled || row.disabled) {
          rowClass += 'disabled ';
        }
        if (this.field.active || row.active) {
          rowClass += 'active ';
        }
        return rowClass;
      },
      hasLink: function (row) {
        if (this.field.rowLink)
          return (!isUndefined(row[this.field.rowLink]));
        else
          return false;
      },
      getRowLink: function (row) {
        if (this.field.rowLink)
          return (!isUndefined(row[this.field.rowLink])) ? row[this.field.rowLink] : '';
        else
          return ''
      }
    },
    mounted: function () {
      if (!this.value || this.value.length == 0) {
        console.error('VueSchemaForm error @list: No value or model provided!');
      }
    }
  }
</script>
