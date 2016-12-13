# vue-instant-form

> Vue form generator based on JSON schema


## Installation

#### Quick Install
``` bash
# yarn
yarn add vue-instant-form

# npm
npm install --save vue-instant-form
```


## Available Fields

* [Text](#text)
* [Number](#number)
* [Email](#email)
* [Currency](#currency)
* [Phone Number](#phone-number)
* [Select](#select)
* [Select2](#select2)
* [Auto Complete](#auto-complete)
* [Date Time Picker](#date-time-picker)
* [File Upload](#file-upload)
* [List Field](#list)
* [Plain Message](#message)
* [Text Area](#text-area)


## Setup

#### Import Component to your Vue Instance

``` javascript
import VueInstantForm from 'vue-instant-form';

const app = new Vue({
  el: '#app',
  components: {
    'vue-instant-form': VueInstantForm
  },
  data: function () {
    return {
      data: ...,
      schema: ...,
      actions: ...,
      options: ...
    }
  }
});
```

#### Component Usage

``` html
<head>
  <!-- vue-instant-form dependencies -->
  <link rel="stylesheet" href="https://maxcdn.bootstrapcdn.com/bootstrap/3.3.7/css/bootstrap.min.css"
        integrity="sha384-BVYiiSIFeK1dGmJRAkycuHAHRg32OmUcww7on3RYdg4Va+PmSTsz/K68vbdEjh4u" crossorigin="anonymous">
  <link rel="stylesheet" href="https://maxcdn.bootstrapcdn.com/font-awesome/4.7.0/css/font-awesome.min.css">
  <script src="/static/lib/jquery-3.1.1.min.js"></script>
  <script src="/static/lib/bootstrap.min.js"></script>
  <script src="/static/lib/moment.min.js"></script>

  <!-- for specific field dependencies, we recommend you to check out the /static/lib folder -->
</head>

<body>
  <div id="app">
    <vue-instant-form  v-model="data"
                      :form-schema="schema"
                      :form-actions="actions"
                      :form-options="options"
                      ref="InstantForm">
    </vue-instant-form>
  </div>
</body>
```

#### Actions Buttons

There are three standard actions wrapped by buttons: submit, reset, and cancel.
* **Submit action** performs standard form submission action. The handler acts
as callbacks and form data is provided. However, form validation may be written
inside the handler functions.
* **Reset action** performs form reset, which means that all field will be filled
with its default value (if possible).
* **Cancel action** performs form cancel. However, there is no special function
embedded in cancel action. Instead, you may do other things, like close container modal.

``` javascript
actions: {
  submit: {
    name: 'submit', label: 'Submit', icon: 'fa fa-check', class: 'btn btn-primary',
    handler: function (data) {
      console.info('onSubmit', data);
    }
  },
  reset: {
    name: 'reset', label: 'Reset', icon: 'fa fa-check', class: 'btn btn-sm btn-info',
    handler: function () {
      vm.$refs.InstantForm.reset();
    }
  },
  cancel: {
    name: 'cancel', label: 'Cancel', icon: 'fa fa-remove', class: 'btn btn-sm btn-warning',
    handler: function () {
      // close container modal, or do other things
    }
  }
}
```


## Guides

### Text

``` javascript
data: {
  name: 'Steve Job'
},
schema: {
  name: {
    type: 'text',
    label: 'Name',
    placeholder: 'Your full name',
    help: 'Please type your full name',
    onChanged: function (val) {
      console.log('onChanged', val);
    }
  }
}
```

### Number

``` javascript
data: {
  height: 170
},
schema: {
  height: {
    type: 'number',
    label: 'Height',
    min: 0, //optional
    max: 0, //optional
    step: 0.01 //optional
  }
}
```

### Email

``` javascript
data: {
  email: 170
},
schema: {
  email: {
    type: 'email',
    label: 'Email'
  }
}
```

### Currency

``` javascript
data: {
  price: 1000.00
},
schema: {
  price: {
    type: 'currency',
    label: 'Price',
    default: 0, //optional
    min: 0, //optional
    max: 1000000 //optional
  }
}
```

Note: currency field supports only Indonesian Rupiah (Rp.) at the moment and highly utilizes jquery!

### Phone Number

``` javascript
data: {
  phone: 1000.00
},
schema: {
  phone: {
    type: 'phone-number',
    label: 'Phone Number',
    delimiter: '-' //optional
  }
}
```

### Select

Select field may return two kind of value: optionValue, and Object.

**Return optionValue:**

``` javascript
data: {
  gender: 2
},
schema: {
  gender: {
    type: 'select',
    label: 'Gender',
    options: [
      { id: 1, label: 'Male' },
      { id: 2, label: 'Female' }
    ],
    optionValue: 'id', // optional, default is 'id'
    optionLabel: 'label', // optional, default is 'label'
  }
}
```

**Return object:**

``` javascript
data: {
  gender: { id: 1, label: 'Male' }
},
schema: {
  gender: {
    type: 'select',
    label: 'Gender',
    options: [
      { id: 1, label: 'Male' },
      { id: 2, label: 'Female' }
    ],
    trackby: 'id',
    optionLabel: 'label', // optional, default is 'label'
  }
}
```

**Custom label:**

``` javascript
data: {
  gender: 2
},
schema: {
  gender: {
    type: 'select',
    label: 'Gender',
    options: [
      { id: 1, label: 'Male' },
      { id: 2, label: 'Female' }
    ],
    optionCustomLabel: function (option) {
      return option.label + ' - ' + option.id;
    }
  }
}
```

### Select2

_Dependencies: select2 (Get it here: http://select2.github.io)_

Include select2 both js and css files:
``` html
<link rel="stylesheet" href="/static/lib/select2/css/select2.min.css">
<script src="/path/to/select2/js/select2.min.js"></script>
```

Schema definition (similiar with common select field):
``` javascript
data: {
  gender: 2
},
schema: {
  gender: {
    type: 'select2',
    label: 'Gender',
    options: [
      { id: 1, label: 'Male' },
      { id: 2, label: 'Female' }
    ],
    optionCustomLabel: function (option) {
      return option.label + ' - ' + option.id;
    }
  }
}
```

Select2 may return object as common select field do.

### Auto Complete

_Dependencies: jquery autocomplete (Get it here: https://www.devbridge.com/sourcery/components/jquery-autocomplete)_

Include jquery autocomplete js files:
``` html
<script src="/path/to/jquery.autocomplete.min.js"></script>
```

Schema definition:
``` javascript
data: {
  country: 'Indonesia'
},
schema: {
  country: {
    type: 'autocomplete',
    label: 'Country',
    options: [ 'Indonesia', 'Japan' ]
  }
}
```

### Date Time Picker

_Dependencies: bootstrap-datetimepicker, developed by Malot (Get it here: http://www.malot.fr/bootstrap-datetimepicker)_

Include both js and css files:
``` html
<link rel="stylesheet" href="/static/lib/bootstrap-datetimepicker.min.css">
<script src="/static/lib/bootstrap-datetimepicker.min.js"></script>
```

Schema definition:
``` javascript
data: {
  birthday: new Date()
},
schema: {
  birthday: {
    type: 'datetimepicker',
    label: 'Birth Day',
    mode: 'datepicker', // optional, default is 'datepicker'
  }
}
```

Datetimepicker component provides three modes: datepicker, datetimepicker, and timepicker.

### File Upload

_Dependencies: fine-uploader (Get it here: http://fineuploader.com)_

Include both js and css files:
``` html
<link rel="stylesheet" href="/static/lib/fine-uploader/fine-uploader-gallery.min.css">
<script src="/static/lib/fine-uploader/fine-uploader.min.js"></script>
```

Write **qq-template** which is required by fine-uploader.
There are three available template types provided by fine-uploader.
If you aren't satisfied and need more UIs, please refer to http://docs.fineuploader.com/branch/master/features/styling.html for more styling options.
``` html
<!-- gallery style template provided by fine-uploader as default -->
<script type="text/template" id="qq-template">
  <div class="qq-uploader-selector qq-uploader qq-gallery" qq-drop-area-text="Drop files here">
    <div class="qq-total-progress-bar-container-selector qq-total-progress-bar-container">
      <div role="progressbar" aria-valuenow="0" aria-valuemin="0" aria-valuemax="100" class="qq-total-progress-bar-selector qq-progress-bar qq-total-progress-bar"></div>
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
    <ul class="qq-upload-list-selector qq-upload-list" role="region" aria-live="polite" aria-relevant="additions removals">
      <li>
        <span role="status" class="qq-upload-status-text-selector qq-upload-status-text"></span>
        <div class="qq-progress-bar-container-selector qq-progress-bar-container">
          <div role="progressbar" aria-valuenow="0" aria-valuemin="0" aria-valuemax="100" class="qq-progress-bar-selector qq-progress-bar"></div>
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
```

Schema definition:
``` javascript
data: {
  files: [
    {
      id: 1,
      filename: 'avatar_c80a99bd5fd4_128.png',
      uuid: '226a8e3a-2f52-4322-a2d5-a7be28cf50ec',
      filetype: 'image/png'
    }
  ]
},
schema: {
  files: {
    type: 'file-upload',
    label: 'Upload file',
    withDelete: true,
    endpoint: 'http://localhost/fine_uploader',
    itemLimit: 1, // optional, default is unlimited
    help: 'This is help block' //optional
  }
}
```

File upload field requires server endpoint which receive data as POST and DELETE request.
For the details please refers to http://docs.fineuploader.com/branch/master/endpoint_handlers/traditional.html.
However, vue-instant-form already comes with Laravel endpoint example, please check [LaravelController.php](static/backend-examples/LaravelController.php).
Laravel endpoint highly utilize migration and model to realize database table **uploaded_files**
which track all uploaded file, so you can add relation to other object at the back end.

Complete Laravel package (https://github.com/inimedia/foundation) can be installed by running:
```sh
composer require inimedia/foundation
```

### Text Area

``` javascript
data: {
  name: 'Lorem ipsum dolor sit amet...'
},
schema: {
  description: {
    type: 'textarea',
    label: 'Description',
    rows: '5',
    default: '',
    placeholder: 'Please enter your description here',
    onChanged: function (val) {
      console.log('onChanged', val);
    }
  }
}
```


## TODO

* add built in validator
* add two column support as option
* checkbox and radio
* field button
* add docs for message and list field

## Build and Debugging Setup
``` bash
# install dependencies
npm install

# serve with hot reload at localhost:8080
npm run dev

# build for production with minification
npm run build

# run unit tests
npm run unit

# run e2e tests
npm run e2e

# run all tests
npm test
```

For detailed explanation on how things work, checkout the [guide](http://vuejs-templates.github.io/webpack/) and [docs for vue-loader](http://vuejs.github.io/vue-loader).
