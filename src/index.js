const k8s = require('@kubernetes/client-node');
const fs = require('node:fs').promises;
const _ = require('lodash');

async function loadYamlFile(file) {
  yamlString = await fs.readFile(file);
  return k8s.loadAllYaml(yamlString);
}

async function dumpYaml(yamlObject) {
  return k8s.dumpYaml(yamlObject);
}

function removeNulls(obj) {
  return _.transform(obj, (result, value, key) => {
    if (_.isObject(value)) {
      value = removeNulls(value);
    }
    if (value !== null) {
      result[key] = value;
    }
  });
}

class Manifest {
  constructor() {
    this._manifest = [];
  }

  get yaml() {
    return k8s.dumpYaml(this._manifest);
  }

  get(kind, name) {
    return _.find(this._manifest, item => {
      if (kind == item.kind && item.metadata.name == name) {
        return item;
      }
    });
  }

  add(obj) {
    if (Array.isArray(obj)) {
      this._manifest = [...this._manifest, ...obj];

    } else if (typeof obj === 'object' && obj !== null) {
      this._manifest.push(obj);

    } else {
      throw new TypeError(`Method add does not accept ${typeof obj}!`);
    };
  }

  update(fn) {
    this._manifest = this._manifest.map(item => {
      let newItem = fn(item);
      if (newItem) {
        return removeNulls(_.merge({}, item, newItem));
      } else {
        return item;
      }
    });
  }

  remove(fn) {
    this._manifest = this._manifest.reduce((acc, item) => {
      if (!fn(item)) {
        acc.push(item);
      }
      return acc;
    }, []);
  }
}

module.exports = {
  loadYamlFile,
  dumpYaml,
  Manifest
};
