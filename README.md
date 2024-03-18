# Kubernetes Resource Manager

Simple and low maintenance k8s resource manager that Kustomize should have been.


## Usage

Check example file:

```javascript
$ cat ./examples/yaml.js
```

Generate YAML:

```shell
$ node ./examples/yaml.js
```

Apply with kubectl:

```shell
$ node ./examples/yaml.js | kubectl apply -f -
```


## To-Do

- Helm chart fetch and evaluate
- Add GitHub Action Workflow
- Package to npmjs


## Inspired by kubenix

Made for situations when you can't use Nix.
