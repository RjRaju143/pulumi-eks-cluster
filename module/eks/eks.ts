import { provider, utils, eks } from "../../config"
import { vpc, privateSubnets } from "../vpc/vpc"

export const cluster = privateSubnets.apply(subnets =>
    new eks.Cluster("cluster", {
        version: utils.cluster.version,
        name: utils.cluster.name,
        vpcId: vpc.id,
        subnetIds: subnets.map(subnet => subnet.id),
        endpointPrivateAccess: utils.cluster.endpointPrivateAccess ?? false,
        endpointPublicAccess: utils.cluster.endpointPublicAccess ?? true,
        skipDefaultNodeGroup: utils.cluster.skipDefaultNodeGroup ?? true,
    }, { provider, dependsOn: vpc })
);
