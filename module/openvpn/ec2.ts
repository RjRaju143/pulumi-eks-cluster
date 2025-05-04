import { aws, provider, utils } from "../../config";
import { publicSubnets, vpc } from "../vpc"

export const securityGroup = new aws.ec2.SecurityGroup(`${utils.openvpnEc2.instanceName}-sg`, {
    name: `${utils.openvpnEc2.instanceName}-security-group`,
    description: `Allow VPN traffic for ${utils.openvpnEc2.instanceName}`,
    vpcId: vpc.id,
    ingress: utils.openvpnEc2.vpnServerPorts.map((port) => ({
        fromPort: port,
        toPort: port,
        protocol: "tcp",
        cidrBlocks: ["0.0.0.0/0"],
    })),
    egress: [{
        fromPort: 0,
        toPort: 0,
        protocol: "-1",
        cidrBlocks: ["0.0.0.0/0"],
    }],
}, { provider, dependsOn: vpc });

export const instance = new aws.ec2.Instance(`${utils.openvpnEc2.instanceName}-instance`, {
    ami: utils.openvpnEc2.amiId,
    instanceType: utils.openvpnEc2.instanceType,
    keyName: utils.sshkey.openvpn.name,
    subnetId: publicSubnets[0].id,
    vpcSecurityGroupIds: [securityGroup.id],
    tags: {
        Name: utils.openvpnEc2.instanceName,
        Environment: utils.ENVIRONMENT,
    },
}, { provider, dependsOn: publicSubnets });

export const eip = new aws.ec2.Eip(`${utils.openvpnEc2.instanceName}-eip`, {
    instance: instance.id,
    // vpc: true, /// depricated
    domain: utils.eip.domain || "vpc",
}, { provider, dependsOn: publicSubnets });
