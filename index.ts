//VPC
import { vpc, igw, publicSubnets, privateSubnets, natGateway, natEip } from "./module/vpc";
export const vpcId = vpc.id;
export const igwId = igw.id;
export const nateip = natEip.id;
export const natGwId = natGateway.id;
export const publicSubnetsIds = publicSubnets.map(subnet => subnet.id);
export const privateSubnetsIds = privateSubnets.map(subnet => subnet.id);

//EKS
import { cluster } from "./module/eks";
export const kubeconfig = cluster.kubeconfig;
export const clusterName = cluster.eksCluster.name;

// NodeGroup
import { nodeGroup, nodeGroupRole, rolePolicyAttachments } from "./module/eks";
export const nodegroup = nodeGroup;
export const nodegroupRole = nodeGroupRole;
export const rolePolicyattachments = rolePolicyAttachments;
