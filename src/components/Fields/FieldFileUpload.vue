<template>
  <div>
  </div>
</template>

<script type="text/template" id="qq-template">
  <div class="qq-uploader-selector qq-uploader qq-gallery" qq-drop-area-text="Drop files here">
    <div class="qq-total-progress-bar-container-selector qq-total-progress-bar-container">
      <div role="progressbar" aria-valuenow="0" aria-valuemin="0" aria-valuemax="100"
           class="qq-total-progress-bar-selector qq-progress-bar qq-total-progress-bar"></div>
    </div>
    <div class="qq-upload-drop-area-selector qq-upload-drop-area" qq-hide-dropzone>
      <span class="qq-upload-drop-area-text-selector"></span>
    </div>
    <div class="qq-upload-button-selector qq-upload-button">
      <div>Upload a file</div>
    </div>
            <span class="qq-drop-processing-selector qq-drop-processing">
                <span>Processing dropped files...</span>
                <span class="qq-drop-processing-spinner-selector qq-drop-processing-spinner"></span>
            </span>
    <ul class="qq-upload-list-selector qq-upload-list" role="region" aria-live="polite"
        aria-relevant="additions removals">
      <li>
        <span role="status" class="qq-upload-status-text-selector qq-upload-status-text"></span>
        <div class="qq-progress-bar-container-selector qq-progress-bar-container">
          <div role="progressbar" aria-valuenow="0" aria-valuemin="0" aria-valuemax="100"
               class="qq-progress-bar-selector qq-progress-bar"></div>
        </div>
        <span class="qq-upload-spinner-selector qq-upload-spinner"></span>
        <div class="qq-thumbnail-wrapper">
          <img class="qq-thumbnail-selector" qq-max-size="120" qq-server-scale>
        </div>
        <button type="button" class="qq-upload-cancel-selector qq-upload-cancel">X</button>
        <button type="button" class="qq-upload-retry-selector qq-upload-retry">
          <span class="qq-btn qq-retry-icon" aria-label="Retry"></span>
          Retry
        </button>

        <div class="qq-file-info">
          <div class="qq-file-name">
            <span class="qq-upload-file-selector qq-upload-file"></span>
            <span class="qq-edit-filename-icon-selector qq-btn qq-edit-filename-icon" aria-label="Edit filename"></span>
          </div>
          <input class="qq-edit-filename-selector qq-edit-filename" tabindex="0" type="text">
          <span class="qq-upload-size-selector qq-upload-size"></span>
          <button type="button" class="qq-btn qq-upload-delete-selector qq-upload-delete">
            <span class="qq-btn qq-delete-icon" aria-label="Delete"></span>
          </button>
          <button type="button" class="qq-btn qq-upload-pause-selector qq-upload-pause">
            <span class="qq-btn qq-pause-icon" aria-label="Pause"></span>
          </button>
          <button type="button" class="qq-btn qq-upload-continue-selector qq-upload-continue">
            <span class="qq-btn qq-continue-icon" aria-label="Continue"></span>
          </button>
        </div>
      </li>
    </ul>

    <dialog class="qq-alert-dialog-selector">
      <div class="qq-dialog-message-selector"></div>
      <div class="qq-dialog-buttons">
        <button type="button" class="qq-cancel-button-selector">Close</button>
      </div>
    </dialog>

    <dialog class="qq-confirm-dialog-selector">
      <div class="qq-dialog-message-selector"></div>
      <div class="qq-dialog-buttons">
        <button type="button" class="qq-cancel-button-selector">No</button>
        <button type="button" class="qq-ok-button-selector">Yes</button>
      </div>
    </dialog>

    <dialog class="qq-prompt-dialog-selector">
      <div class="qq-dialog-message-selector"></div>
      <input type="text">
      <div class="qq-dialog-buttons">
        <button type="button" class="qq-cancel-button-selector">Cancel</button>
        <button type="button" class="qq-ok-button-selector">Ok</button>
      </div>
    </dialog>
  </div>
</script>

<script>
  // TODO: add initial file list, and limited file upload

  import {isNumber, isFunction, isArray, replace, split} from 'lodash';
  export default{
    mounted: function () {
      var vm = this;

      if (!qq || !qq.FineUploader) {
        console.error('SchemaForm Error @file-upload: fine-uploader not found. ' +
          'Get it here: http://fineuploader.com/, please include css, js and template files.');
        return;
      }

      vm.uploader = new qq.FineUploader({
        element: vm.$el,
        request: {
          endpoint: vm.field.endpoint
        },
        deleteFile: {
          enabled: !!vm.field.withDelete, // defaults to false
          endpoint: vm.field.endpoint
        },
        callbacks: {
          onComplete: function (id, name, responseJSON) {
//            console.info('uploader onComplete', id, name, responseJSON);
            if (!isArray(vm.modelValue)) {
              vm.modelValue = [];
            }
            vm.modelValue.push(responseJSON.result);
            vm.$emit('input', vm.modelValue);
          },
//          onAllComplete: function (succeeded, failed) {
//            console.info('uploader onAllComplete', succeeded, failed);
//          },
          onDeleteComplete: function (id, xhr, isError) {
//            console.info('uploader onDeleteComplete', id, xhr, isError);
            if (!isArray(vm.modelValue)) {
              vm.modelValue = [];
            }
            var fileObject = JSON.parse(xhr.responseText);
            fileObject = fileObject.result;
            if (fileObject) {
              for (var i=0; i<vm.modelValue.length; i++) {
                if (vm.modelValue[i].id == fileObject.id) {
                  vm.modelValue.splice(i, 1);
                  break;
                }
              }
            }

            vm.$emit('input', vm.modelValue);
          },
          onError: function (id, name, errorReason) {
//            console.warn('uploader onError:', id, name, errorReason);
            if (vm.field.onUploadError) {
              vm.field.onUploadError(id, name, errorReason);
            }
          }
        }
      });

      var initialFiles = [];
      var origin = '';
      var protocol = 'http';
      if (vm.field.origin) {
        origin = vm.field.origin;
        if (origin.indexOf('https') > -1) {
          protocol = 'https';
          origin = replace(origin, 'https:', '');
        }
        else {
          origin = replace(origin, 'http:', '');
        }
        origin = replace(origin, '/', '');
      }
      else {
        origin = vm.field.endpoint;
        if (origin.indexOf('https') > -1) {
          protocol = 'https';
          origin = replace(origin, 'https:', '');
        }
        else {
          origin = replace(origin, 'http:', '');
        }
        origin = replace(origin, '//', '');
        origin = split(origin, '/')[0];
      }
      for (var i=0; i<vm.modelValue.length; i++) {
        var obj = {
          name: vm.modelValue[i].filename,
          uuid: vm.modelValue[i].uuid
        };
        if (vm.modelValue[i].filetype &&
          (vm.modelValue[i].filetype == 'image/jpeg' || vm.modelValue[i].filetype == 'image/png')
        ) {
          obj.thumbnailUrl = protocol + '://' + origin + '/uploads/media/' + vm.modelValue[i].uuid + '/' + vm.modelValue[i].filename;
        }
        initialFiles.push(obj);
      }

      vm.uploader.addInitialFiles(initialFiles);

      if (this.field.itemLimit && isNumber(this.field.itemLimit)) {
        vm.uploader.setItemLimit(this.field.itemLimit);
      }
    },
    props: {
      field: Object,
      value: Array
    },
    data: function () {
      return {
        modelValue: this.value,
        uploader: null
      }
    },
    watch: {
      value: function (val) {
        this.modelValue = val;
      },
      modelValue: function (val) {
        console.log('modelValue changed', val);
        if (isFunction(this.field.onChanged)) {
          this.field.onChanged(this.modelValue);
        }
        this.$emit('input', this.modelValue);
      }
    },
    destroyed: function () {
      $(this.$el).off().select2('destroy')
    }
  }
</script>
