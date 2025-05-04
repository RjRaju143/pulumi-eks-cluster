//VPC
import { vpc, igw, publicSubnets, privateSubnets, natGateway, natEip } from "./module/vpc";
export const vpcId = vpc.id;
export const igwId = igw.id;
export const nateip = natEip.id;
export const natGwId = natGateway.id;
export const publicSubnetsIds = publicSubnets.map(subnet => subnet.id);
export const privateSubnetsIds = privateSubnets.map(subnet => subnet.id);

//// Upload SSH Keys
import { sshKey } from "./module/sshkey"
export const sshkey = sshKey.keyName;

//// OpenVPN Instance in Public Subnet 
import { eip, instance, securityGroup } from "./module/openvpn"
export const OpenVpnIP = eip;
export const OpenVpnInstance = instance;
export const OpenVpnSecurityGroup = securityGroup;

// //EKS
import { cluster } from "./module/eks";
export const clusterName = cluster.eksCluster.name;
// export const kubeconfig = cluster.kubeconfig;

// NodeGroup
import { nodeGroup, nodeGroupRole, rolePolicyAttachments } from "./module/eks";
export const nodegroup = nodeGroup;
export const nodegroupRole = nodeGroupRole;
export const rolePolicyattachments = rolePolicyAttachments;
