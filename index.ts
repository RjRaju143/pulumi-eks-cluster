//VPC
import { aws } from "./config";
import { vpc, igw, publicSubnets, privateSubnets, natGateway, natEip } from "./module/vpc";

export const vpcId = vpc.id;
export const igwId = igw.id;
export const nateip = natEip.id;
export const natGwId = natGateway.id;
export const publicSubnetsIds = publicSubnets.apply((subnets: aws.ec2.Subnet[]) => subnets.map((subnet: aws.ec2.Subnet) => subnet.id));
export const privateSubnetsIds = privateSubnets.apply((subnets: aws.ec2.Subnet[]) => subnets.map((subnet: aws.ec2.Subnet) => subnet.id));

//EKS
import { cluster } from "./module/eks";
export const clusterName = cluster.eksCluster.name;
// export const kubeconfig = cluster.kubeconfig;

// NodeGroup
import { nodeGroup, nodeGroupRole, rolePolicyAttachments } from "./module/eks";
export const nodegroup = nodeGroup;
export const nodegroupRole = nodeGroupRole;
export const rolePolicyattachments = rolePolicyAttachments;
