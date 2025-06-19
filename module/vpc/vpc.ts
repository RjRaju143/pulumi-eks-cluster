import { aws, provider, utils } from "../../config";
import { SubnetConfig, Subnets } from "./ types"

export const vpc = new aws.ec2.Vpc("main-vpc", utils.vpc, { provider });

export const igw = new aws.ec2.InternetGateway("igw", {
    vpcId: vpc.id,
    tags: { Name: "main-igw" }
}, { provider });

export const publicSubnets = utils.subnets.apply((subnets: Subnets) =>
    subnets.public.map((subnet: SubnetConfig) =>
        new aws.ec2.Subnet(subnet.name, {
            vpcId: vpc.id,
            cidrBlock: subnet.cidrBlock,
            availabilityZone: subnet.az,
            mapPublicIpOnLaunch: true,
            tags: { Name: subnet.name },
        }, { provider })
    )
);

export const privateSubnets = utils.subnets.apply((subnets: Subnets) =>
    subnets.private.map((subnet:SubnetConfig) =>
        new aws.ec2.Subnet(subnet.name, {
            vpcId: vpc.id,
            cidrBlock: subnet.cidrBlock,
            availabilityZone: subnet.az,
            tags: { Name: subnet.name },
        }, { provider })
    )
);

export const natEip = new aws.ec2.Eip("nat-eip", utils.eip, { provider });

export const natGateway = new aws.ec2.NatGateway("nat-gw", {
    subnetId: publicSubnets[0].id,
    allocationId: natEip.id,
    tags: utils.natGateway.tags
}, { provider });

const publicRouteTable = new aws.ec2.RouteTable("public-rt", {
    vpcId: vpc.id,
    routes: [{
        cidrBlock: utils.routeTables.public.routes[0].cidrBlock,
        gatewayId: igw.id,
    }],
    tags: utils.routeTables.public.tags,
}, { provider });

new aws.ec2.RouteTableAssociation("public-rt-assoc-1", {
    subnetId: publicSubnets[0].id,
    routeTableId: publicRouteTable.id
}, { provider });

new aws.ec2.RouteTableAssociation("public-rt-assoc-2", {
    subnetId: publicSubnets[1].id,
    routeTableId: publicRouteTable.id
}, { provider });

const privateRouteTable = new aws.ec2.RouteTable("private-rt", {
    vpcId: vpc.id,
    routes: [{
        cidrBlock: utils.routeTables.private.routes[0].cidrBlock,
        natGatewayId: natGateway.id,
    }],
    tags: utils.routeTables.private.tags
}, { provider });

new aws.ec2.RouteTableAssociation("private-rt-assoc-1", {
    subnetId: privateSubnets[0].id,
    routeTableId: privateRouteTable.id
}, { provider });

new aws.ec2.RouteTableAssociation("private-rt-assoc-2", {
    subnetId: privateSubnets[1].id,
    routeTableId: privateRouteTable.id
}, { provider });
