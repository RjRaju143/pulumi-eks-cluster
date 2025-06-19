import { provider, utils, eks, aws } from "../../config"
import { vpc, privateSubnets, publicSubnets } from "../vpc/vpc"

export const cluster = utils.cluster.publicCluster 
    ? publicSubnets.apply((subnets: aws.ec2.Subnet[]) =>
        new eks.Cluster("cluster", {
            version: utils.cluster.version,
            name: utils.cluster.name,
            vpcId: vpc.id,
            subnetIds: subnets.map(subnet => subnet.id),
            endpointPrivateAccess: false,
            endpointPublicAccess: true,
            skipDefaultNodeGroup: utils.cluster.skipDefaultNodeGroup ?? true,
        }, { provider, dependsOn: vpc })
    )
    : privateSubnets.apply((subnets: aws.ec2.Subnet[]) =>
        new eks.Cluster("cluster", {
            version: utils.cluster.version,
            name: utils.cluster.name,
            vpcId: vpc.id,
            subnetIds: subnets.map(subnet => subnet.id),
            endpointPrivateAccess: true,
            endpointPublicAccess: false,
            skipDefaultNodeGroup: utils.cluster.skipDefaultNodeGroup ?? true,
        }, { provider, dependsOn: vpc })
    );
