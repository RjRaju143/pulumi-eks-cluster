
//// const zones = aws.getAvailabilityZones({ state: "available" });
///// Then use zones.then(z => z.names[0]) to pick one.

export const utils = {
    AWS_REGION: process.env.AWS_REGION || "ap-south-1",
    ENVIRONMENT: process.env.ENVIRONMENT || "dev",
    cluster: {
        name: `${process.env.ENVIRONMENT}-eks-cluster`,
        version: "1.32",
        endpointPrivateAccess: true,
        endpointPublicAccess: false,
        skipDefaultNodeGroup: true,
    },
    vpc: {
        cidrBlock: "10.0.0.0/16",
        enableDnsSupport: true,
        enableDnsHostnames: true,
        tags: { Name: "main-vpc" }
    },
    subnets: {
        public: [
            { cidrBlock: "10.0.1.0/24", az: "a", name: "public-subnet-1" },
            { cidrBlock: "10.0.2.0/24", az: "b", name: "public-subnet-2" }
        ],
        private: [
            { cidrBlock: "10.0.3.0/24", az: "a", name: "private-subnet-1" },
            { cidrBlock: "10.0.4.0/24", az: "b", name: "private-subnet-2" }
        ]
    },
    eip: {
        // vpc: true, // depricated
        domain: "vpc",
    },
    natGateway: {
        subnetId: "public-subnet-1", // Will reference public subnet later
        tags: { Name: "nat-gw" }
    },
    routeTables: {
        public: {
            routes: [{ cidrBlock: "0.0.0.0/0" }],
            tags: { Name: "public-rt" }
        },
        private: {
            routes: [{ cidrBlock: "0.0.0.0/0" }],
            tags: { Name: "private-rt" }
        }
    },
    openvpnEc2: {
        amiId: "ami-01614d815cf856337",
        instanceName: "OpenVpn",
        vpnServerPorts: [1194, 443, 80, 22, 943],
        instanceType: "t2.small",
    },
    sshkey : {
        openvpn: {
            name: "open-vpn"
        },eksNodeGroup:{
            name: "dev-cluster"
        }
    }
};
