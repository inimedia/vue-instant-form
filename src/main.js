import Vue from 'vue';
import VueSchemaForm from './components/VueSchemaForm.vue';
import VueSchemaFormValidator from './validator';

VueSchemaFormValidator.info();

new Vue({
  el: '#app',
  data: function () {
    var vm = this;
    return {
      formData: {
        satuan: {id: 2, nama: 'ml'},
        // satuan2: { id: 2, nama: 'ml' },
        harga_satuan: '10100',
        list: [
          {id: 0, nama: 'Zak', class: ''},
          {id: 1, nama: 'Zakz', context: 'success'},
          {id: 2, nama: 'Zaks', disabled: true, link: 'http://www.google.com'},
          {id: 3, nama: 'Zaks', active: true, link: 'http://www.google.com' }
        ]
      },
      schema: {
        email: {
          type: 'email',
          label: 'Email',
          placeholder: 'Your email',
          help: 'This is help block',
        },
        message: {
          type: 'message',
          label: 'Apakah Anda yakin menghapus standar harga bahan ini?'
        },
        list: {
          type: 'list',
          label: 'Apakah Anda yakin menghapus standar harga bahan ini?',
          rowLabel: 'nama',
          rowBadge: 'id',
          rowClass: 'class',
          rowContext: 'context',
          rowLink: 'link'
        },
        nama_bahan: {
          type: 'text',
          label: 'Nama Bahan',
          default: 'OK',
          placeholder: 'Nama bahan',
          visible: true,
          disabled: false,
          readonly: false,
          required: true,
          help: 'This is help block',
          validator: null,
          buttons: [],
          onChanged: function (val) {
            console.log('onChanged nama_bahan', val, vm.schema);
          }
        },
        satuan: {
          type: 'select',
          label: 'Satuan',
          // default: 1,
          visible: true,
          disabled: false,
          readonly: false,
          required: true,
          options: [
            {id: 0, nama: 'Zak'},
            {id: 1, nama: 'M3'},
            {id: 2, nama: 'ml'},
          ],
          trackby: 'id',
          optionValue: 'id',
          optionLabel: 'nama',
          // optionCustomLabel: function (option) {
          //   return option.nama + ' - ' + option.id;
          // },
          help: 'This is help block',
          validator: null,
          buttons: []
        },
        satuan2: {
          type: 'select2',
          label: 'Satuan 2',
          // default: 1,
          visible: true,
          disabled: false,
          readonly: false,
          required: true,
          // multiple: true,
          options: [
            {id: 0, nama: 'Zak'},
            {id: 1, nama: 'M3'},
            {id: 2, nama: 'ml'},
          ],
          trackby: 'id',
          // optionValue: 'id',
          optionLabel: 'nama',
          optionCustomLabel: function (option) {
            return option.nama + ' - ' + option.id;
          },
          help: 'This is help block',
          validator: null,
          buttons: []
        },
        negara: {
          label: 'Negara',
          type: 'autocomplete',
          options: ['Indonesia', 'Zimbabwe'],
        },
        harga_satuan: {
          type: 'number',
          label: 'Harga Satuan',
          default: 0,
          step: 0.01,
          min: 0,
          visible: true,
          disabled: false,
          readonly: false,
          required: true,
          options: null,
          help: 'This is help block',
          validator: null,
          buttons: []
        },
        harga_total: {
          type: 'currency',
          label: 'Harga Total',
          // default: 2000.00,
          default: 0,
          min: 0,
          max: 100000,
          visible: true,
          disabled: false,
          readonly: false,
          required: true,
          options: null,
          help: 'This is help block',
          validator: null,
          buttons: []
        },
        telepon: {
          type: 'phone-number',
          label: 'Telepon',
        },
        tanggal: {
          type: 'datetimepicker',
          label: 'Tanggal',
          default: new Date(),
          mode: 'datepicker',
          required: true,
          // readonly: true,
          // disabled: true,
          help: 'This is help block',
        },
        files: {
          type: 'file-upload',
          label: 'Upload file',
          required: true,
          itemLimit: 1,
          // default: [
          //   {
          //     filename: 'avatar_c80a99bd5fd4_128.png',
          //     uuid: '226a8e3a-2f52-4322-a2d5-a7be28cf50ec',
          //     filetype: 'image/png'
          //   }
          // ],
          withDelete: true,
          endpoint: 'http://posweb.localhost/fine_uploader',
          onUploadError: function (id, name, errorReason) {
            console.warn('uploader onError:', id, name, errorReason);
          },
          // readonly: true,
          // disabled: true,
          help: 'This is help block',
        }
      },
      actions: {
        submit: {
          name: 'submit', label: 'Submit', icon: 'fa fa-check', class: 'btn btn-primary',
          handler: function (data) {
            console.info('onSubmit', JSON.stringify(data.files), JSON.stringify(data.satuan));
          }
        },
        reset: {
          name: 'reset', label: 'Reset', icon: 'fa fa-check', class: 'btn btn-sm btn-info',
          handler: function () {
            vm.$refs.SchemaForm.reset();
          }
        },
        cancel: {
          name: 'cancel', label: 'Cancel', icon: 'fa fa-remove', class: 'btn btn-sm btn-warning'
        }
      },
      options: {}
    }
  },
  methods: {
    experimentButtonClicked: function () {
      // this.schema.nama_bahan.readonly = !this.schema.nama_bahan.readonly;
      // this.formData.nama_bahan += 's';
      // this.formData.satuan++;
      // this.formData.satuan2++;
      console.log(this.formData);
    }
  },
  components: {VueSchemaForm}
});
