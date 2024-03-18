const k8srm = require('../src');

const main = async () => {
    const manifest = new k8srm.Manifest();

    // Add inline resource
    manifest.add({
        apiVersion: 'v1',
        kind: 'Namespace',
        metadata: {
            name: 'test'
        }
    });

    // Load whole YAML file
    manifest.add(await k8srm.loadYamlFile('./examples/mysql.yaml'));

    // Apply namespace name to all non-namespace resources
    manifest.update(item => {
        if (item.kind != 'Namespace') {
            return {
                metadata: {
                    namespace: 'test'
                }
            };
        }
    });

    // Change the name of all non-namespace resources
    manifest.update(item => {
        if (item.kind != 'Namespace') {
            return {
                metadata: {
                    name: `${item.metadata.name}-test`
                }
            };
        }
    });

    // Use proper labels for all resources
    manifest.update(_ => {
        namespace = manifest.get('Namespace', 'test').metadata.name;
        return {
            metadata: {
                labels: {
                    app: null,
                    "app.kubernetes.io/name": 'mysql',
                    "app.kubernetes.io/instance": `mysql-${namespace}`
                }
            }
        };
    });

    // Print YAML output to stdout
    console.log(manifest.yaml);
};

main();
