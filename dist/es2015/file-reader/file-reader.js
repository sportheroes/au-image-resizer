var _dec, _dec2, _desc, _value, _class, _descriptor, _descriptor2;

function _initDefineProp(target, property, descriptor, context) {
  if (!descriptor) return;
  Object.defineProperty(target, property, {
    enumerable: descriptor.enumerable,
    configurable: descriptor.configurable,
    writable: descriptor.writable,
    value: descriptor.initializer ? descriptor.initializer.call(context) : void 0
  });
}

function _applyDecoratedDescriptor(target, property, decorators, descriptor, context) {
  var desc = {};
  Object['ke' + 'ys'](descriptor).forEach(function (key) {
    desc[key] = descriptor[key];
  });
  desc.enumerable = !!desc.enumerable;
  desc.configurable = !!desc.configurable;

  if ('value' in desc || desc.initializer) {
    desc.writable = true;
  }

  desc = decorators.slice().reverse().reduce(function (desc, decorator) {
    return decorator(target, property, desc) || desc;
  }, desc);

  if (context && desc.initializer !== void 0) {
    desc.value = desc.initializer ? desc.initializer.call(context) : void 0;
    desc.initializer = undefined;
  }

  if (desc.initializer === void 0) {
    Object['define' + 'Property'](target, property, desc);
    desc = null;
  }

  return desc;
}

function _initializerWarningHelper(descriptor, context) {
  throw new Error('Decorating class property failed. Please ensure that transform-class-properties is enabled.');
}

import { bindable, bindingMode } from 'aurelia-framework';
import EXIF from 'exif-js';

export let FileReaderCustomElement = (_dec = bindable({ defaultBindingMode: bindingMode.twoWay }), _dec2 = bindable({ defaultBindingMode: bindingMode.twoWay }), (_class = class FileReaderCustomElement {
  constructor() {
    _initDefineProp(this, 'file', _descriptor, this);

    _initDefineProp(this, 'infos', _descriptor2, this);
  }

  update(e) {
    const file = e.target.files && e.target.files[0];
    if (!file || !file.type.match('image.*')) return;

    this._loadImage(file).then(image => {
      this.file = image;
      this.fileInput.value = null;
    });
  }

  _loadImage(file) {
    let fileAsUrl;
    return this._readFileAsUrl(file).then(data => {
      fileAsUrl = data;
      return this._readInfos(file, fileAsUrl);
    }).then(infos => {
      this.infos = infos;
      switch (this.infos.exif.Orientation) {
        case 7:
        case 8:
          return this._rotate(fileAsUrl, -90);
        case 3:
          return this._rotate(fileAsUrl, 180);
        case 5:
        case 6:
          return this._rotate(fileAsUrl, 90);
        default:
          return fileAsUrl;
      }
    });
  }

  _readFileAsUrl(file) {
    return new Promise(resolve => {
      const reader = new FileReader();
      reader.onload = e => {
        resolve(e.target.result);
      };
      reader.readAsDataURL(file);
    });
  }

  _readFileAsBinary(file) {
    return new Promise(resolve => {
      const reader = new FileReader();
      reader.onload = e => {
        resolve(e.target.result);
      };
      reader.readAsArrayBuffer(file);
    });
  }

  _readInfos(file, fileAsUrl) {
    const infos = {
      name: file.name,
      size: file.size,
      type: file.type,
      lastModified: file.lastModified
    };
    const img = new Image();
    img.src = fileAsUrl;
    return Promise.all([this._readFileAsBinary(file).then(fileAsBinary => {
      infos.exif = EXIF.readFromBinaryFile(fileAsBinary) || {};
      infos.exif.Orientation = infos.exif.Orientation || 0;
    }), new Promise((resolve, reject) => {
      img.onload = () => {
        infos.width = img.width;
        infos.height = img.height;
        resolve(infos);
      };
      img.onerror = e => resolve(infos);
    })]).then(() => infos);
  }

  _rotate(fileAsUrl, degrees) {
    return new Promise(resolve => {
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');
      const img = new Image();
      img.onload = () => {
        const width = img.width;
        const height = img.height;
        const x = width / 2;
        const y = height / 2;
        canvas.width = width;
        canvas.height = height;

        ctx.translate(x, y);
        ctx.rotate(degrees * Math.PI / 180);
        ctx.drawImage(img, -width / 2, -height / 2, width, height);
        ctx.restore();
        resolve(canvas.toDataURL());
      };
      img.src = fileAsUrl;
    });
  }
}, (_descriptor = _applyDecoratedDescriptor(_class.prototype, 'file', [_dec], {
  enumerable: true,
  initializer: null
}), _descriptor2 = _applyDecoratedDescriptor(_class.prototype, 'infos', [_dec2], {
  enumerable: true,
  initializer: null
})), _class));