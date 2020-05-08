import * as THREE from 'three';
import { trigger } from './dispatcher';
import { ASSET_TYPE } from '../config/constants';

const noop = () => {};

class AssetManager {
  constructor(options = {}) {
    this.loadingComplete = false;
    this.numLoaded = 0;
    this.numFiles = 0;
    this.loadedItems = [];
  }

  init(manifest, group = null) {
    for (let item of manifest) {
      const { assetType } = item;

      // add item to specified asset group
      if (group) item.group = group;

      switch (assetType) {
        case ASSET_TYPE.IMAGE:
          this.loadImage(item);
          break;

        case ASSET_TYPE.TEXTURE:
          this.loadTexture(item);
          break;

        case ASSET_TYPE.SCRIPT:
          this.loadScript(item);
          break;

        default:
          console.warn(`No asset type found for type ${assetType}`);
      }
    }
    return this;
  }

  getAsset(id) {
    return this.loadedItems.find((item) => item.id === id);
  }

  getGroup(group) {
    return this.loadedItems.filter((item) => item.group === group);
  }

  removeAsset(id) {
    this.loadedItems = this.loadedItems.filter((item) => {
      if (item.id === id) {
        this.dispose(item);
      }
      return item.id !== id;
    });
  }

  removeGroup(group) {
    this.loadedItems = this.loadedItems.filter((item) => {
      if (item.group === group) {
        this.dispose(item);
      }
      return item.group !== group;
    });
  }

  dispose(item) {
    const { assetType, instance } = item;

    switch (assetType) {
      // textures
      case ASSET_TYPE.TEXTURE:
        instance.dispose();
        break;

      // scripts
      case ASSET_TYPE.SCRIPT:
        document.head.removeChild(instance);
        break;

      // no-op
      default:
        noop();
    }
  }

  addToQueue(items, group = null) {
    // add new items
    if (this.loadingComplete) {
      this.numLoaded = 0;
      this.loadingComplete = false;
      this.numFiles = items.length;
    } else {
      this.numFiles += items.length;
    }

    this.init(items, group);
  }

  onFileLoaded(item, instance) {
    this.numLoaded++;
    this.loadedItems.push({
      ...item,
      instance,
    });

    // trigger progress event
    const progress = this.numLoaded / this.numFiles;
    trigger('assets:progress', progress);

    // trigger loading complete event
    if (this.numLoaded >= this.numFiles) {
      this.loadingComplete = true;
      trigger('assets:complete', this.loadedItems);
    }
  }

  loadImage(item) {
    const img = new Image();
    img.onload = () => {
      this.onFileLoaded(item, img);
    };
    img.onerror = (err) => {
      console.warn(`Image ${item.file} could not be loaded`, err);
    };
    img.src = item.file;
  }

  loadTexture(item) {
    if (!this.textureLoader) {
      this.textureLoader = new THREE.TextureLoader();
    }

    const onComplete = (texture) => {
      this.onFileLoaded(item, texture);
    };

    const onError = (err) => {
      console.warn(`Texture ${item.file} could not be loaded`);
    };

    this.textureLoader.load(item.file, onComplete, onError);
  }

  loadScript(item) {
    const load = () => {
      return new Promise((resolve, reject) => {
        let s = document.createElement('script');
        s.src = item.file;
        s.onload = () => {
          resolve(s);
        };
        s.onerror = reject;
        document.head.appendChild(s);
      });
    };

    load(item.file).then((el) => {
      this.onFileLoaded(item, el);
    });
  }
}

const loader = new AssetManager();
export default loader;
