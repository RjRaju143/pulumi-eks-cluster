import { utils, aws, provider } from "../../config";
import { privateSubnets, publicSubnets } from "../vpc"
import { cluster } from "./eks"

export const nodeGroupRole = new aws.iam.Role("nodeGroupRole", {
    name: "eks-node-group-example",
    assumeRolePolicy: JSON.stringify({
        Version: "2012-10-17",
        Statement: [{
            Effect: "Allow",
            Action: "sts:AssumeRole",
            Principal: {
                Service: "ec2.amazonaws.com",
            },
        }],
    }),
}, { provider, dependsOn: cluster });

const policies = [
    "arn:aws:iam::aws:policy/AmazonEKSWorkerNodePolicy",
    "arn:aws:iam::aws:policy/AmazonEKS_CNI_Policy",
    "arn:aws:iam::aws:policy/AmazonEC2ContainerRegistryReadOnly",
];

export const rolePolicyAttachments = policies.map((policyArn, index) =>
    new aws.iam.RolePolicyAttachment(`nodeGroupPolicy-${index}`, {
        role: nodeGroupRole.name,
        policyArn,
    }, { provider, dependsOn: cluster })
);

export const nodeGroup = new aws.eks.NodeGroup("eksNodeGroup", {
    clusterName: cluster.eksCluster.name,
    nodeGroupName: `${utils.cluster.name}-node-group`,
    nodeRoleArn: nodeGroupRole.arn,
    subnetIds: (utils.cluster.publicCluster ? publicSubnets : privateSubnets).apply((subnets: aws.ec2.Subnet[]) => subnets.map(subnet => subnet.id)),
    // diskSize: 30,
    tags: {
        Name: `${utils.cluster.name}-node-group`,
        Environment: utils.ENVIRONMENT as string,
    },
    scalingConfig: {
        desiredSize: 1,
        maxSize: 2,
        minSize: 1,
    },
    updateConfig: {
        maxUnavailable: 1,
    },
}, {
    provider,
    dependsOn: rolePolicyAttachments,
})

