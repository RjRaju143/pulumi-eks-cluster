#!/bin/bash

set -e

STACK_NAME="dev"
PROJECT_DIR=$PWD
export PULUMI_CONFIG_PASSPHRASE=1234
export PULUMI_K8S_DELETE_UNREACHABLE=true

create_stack() {
    echo "Creating resources with Pulumi..."
    cd $PROJECT_DIR

    # pulumi login file://.
    pulumi login s3://iac-eks-cluster/pulumi/eks-cluster/
    pulumi up --stack $STACK_NAME
    unset PULUMI_CONFIG_PASSPHRASE
    echo "Pulumi stack created successfully!"
}

delete_stack() {
    echo "Deleting resources with Pulumi..."
    cd $PROJECT_DIR

    pulumi destroy --stack $STACK_NAME
    pulumi stack rm $STACK_NAME
    unset PULUMI_CONFIG_PASSPHRASE
    echo "Pulumi stack deleted successfully!"
}

echo "Pulumi Operations Menu:"
echo "1. Initialize/create Pulumi-managed infrastructure"
echo "2. Destroy Pulumi-managed infrastructure"
echo "3. pulumi cancel"

read -p "Enter your option (1, 2, 3): " OPTION

case "$OPTION" in
    1)
        create_stack
        ;;
    2)
        delete_stack
        ;;
    3)
        pulumi cancel
        ;;
    *)
        echo "Error: Unknown option '$OPTION'. Please enter either 1 or 2."
        exit 1
        ;;
esac



# pulumi stack output kubeconfig > kubeconfig.yml
# KUBECONFIG=./kubeconfig.yml kubectl get nodes

