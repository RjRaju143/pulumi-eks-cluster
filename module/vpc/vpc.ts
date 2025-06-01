import { aws, provider, utils } from "../../config";

// 1. VPC
export const vpc = new aws.ec2.Vpc("main-vpc", utils.vpc, { provider });

// 2. Internet Gateway
export const igw = new aws.ec2.InternetGateway("igw", {
    vpcId: vpc.id,
    tags: { Name: "main-igw" }
}, { provider });

// 3. Public Subnets
export const publicSubnets = utils.subnets.apply(subnets =>
    subnets.public.map(subnet =>
        new aws.ec2.Subnet(subnet.name, {
            vpcId: vpc.id,
            cidrBlock: subnet.cidrBlock,
            availabilityZone: subnet.az,  // Already full AZ name like "ap-south-1a"
            mapPublicIpOnLaunch: true,
            tags: { Name: subnet.name },
        }, { provider })
    )
);

// 4. Private Subnets
export const privateSubnets = utils.subnets.apply(subnets =>
    subnets.private.map(subnet =>
        new aws.ec2.Subnet(subnet.name, {
            vpcId: vpc.id,
            cidrBlock: subnet.cidrBlock,
            availabilityZone: subnet.az,  // Already full AZ name
            tags: { Name: subnet.name },
        }, { provider })
    )
);

// 5. Elastic IP for NAT
export const natEip = new aws.ec2.Eip("nat-eip", utils.eip, { provider });

// 6. NAT Gateway
export const natGateway = new aws.ec2.NatGateway("nat-gw", {
    subnetId: publicSubnets[0].id, // Reference to the first public subnet
    allocationId: natEip.id,
    tags: utils.natGateway.tags
}, { provider });

// 7. Public Route Table
const publicRouteTable = new aws.ec2.RouteTable("public-rt", {
    vpcId: vpc.id,
    // routes: utils.routeTables.public.routes, /// config
    routes: [{
        cidrBlock: utils.routeTables.public.routes[0].cidrBlock,
        gatewayId: igw.id, // <-- dynamic reference
    }],
    tags: utils.routeTables.public.tags,
}, { provider });

// 8. Public Subnet Associations
new aws.ec2.RouteTableAssociation("public-rt-assoc-1", {
    subnetId: publicSubnets[0].id,
    routeTableId: publicRouteTable.id
}, { provider });

new aws.ec2.RouteTableAssociation("public-rt-assoc-2", {
    subnetId: publicSubnets[1].id,
    routeTableId: publicRouteTable.id
}, { provider });

// 9. Private Route Table
const privateRouteTable = new aws.ec2.RouteTable("private-rt", {
    vpcId: vpc.id,
    // routes: utils.routeTables.private.routes,
    routes: [{
        cidrBlock: utils.routeTables.private.routes[0].cidrBlock,
        natGatewayId: natGateway.id, // <-- dynamic reference
    }],
    tags: utils.routeTables.private.tags
}, { provider });

// 10. Private Subnet Associations
new aws.ec2.RouteTableAssociation("private-rt-assoc-1", {
    subnetId: privateSubnets[0].id,
    routeTableId: privateRouteTable.id
}, { provider });

new aws.ec2.RouteTableAssociation("private-rt-assoc-2", {
    subnetId: privateSubnets[1].id,
    routeTableId: privateRouteTable.id
}, { provider });
