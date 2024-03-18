const k8srm = require('../src');

const main = async () => {
    const manifest = new k8srm.Manifest();

    manifest.add({
        apiVersion: 'v1',
        kind: 'Namespace',
        metadata: {
            name: 'test'
        }
    });
    manifest.add(await k8srm.loadYamlFile('./examples/mysql.yaml'));

    manifest.update(item => {
        if (item.kind != 'Namespace') {
            return {
                metadata: {
                    namespace: 'test'
                }
            };
        }
    });

    manifest.update(item => {
        if (item.kind != 'Namespace') {
            return {
                metadata: {
                    name: `${item.metadata.name}-test`
                }
            };
        }
    });

    manifest.update(item => {
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
    console.log(manifest.yaml);
};

main();
