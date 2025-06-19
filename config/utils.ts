import { aws, pulumi } from "./provider";

import dotenv from "dotenv"
dotenv.config()

const AWS_REGION = process.env.AWS_REGION;
const ENVIRONMENT = process.env.ENVIRONMENT || 'dev';
const AWS_ACCESS_KEY_ID = process.env.AWS_ACCESS_KEY_ID;
const AWS_SECRET_ACCESS_KEY = process.env.AWS_SECRET_ACCESS_KEY;

const zones = aws.getAvailabilityZones({ state: "available" });
console.log(zones)

export const utils = {
    AWS_REGION,
    ENVIRONMENT,
    AWS_ACCESS_KEY_ID,
    AWS_SECRET_ACCESS_KEY,
    cluster: {
        name: `${ENVIRONMENT}-eks-cluster`,
        version: "1.33",
        publicCluster: true, // Set to false for private cluster
        endpointPrivateAccess: false,
        endpointPublicAccess: true,
        skipDefaultNodeGroup: true,
    },
    vpc: {
        cidrBlock: "10.0.0.0/16",
        enableDnsSupport: true,
        enableDnsHostnames: true,
        tags: { Name: "main-vpc" },
    },
    subnets: pulumi.output(zones).apply(z => ({
        public: [
            { cidrBlock: "10.0.1.0/24", az: z.names[0], name: "public-subnet-1" },
            { cidrBlock: "10.0.2.0/24", az: z.names[1], name: "public-subnet-2" },
        ],
        private: [
            { cidrBlock: "10.0.3.0/24", az: z.names[0], name: "private-subnet-1" },
            { cidrBlock: "10.0.4.0/24", az: z.names[1], name: "private-subnet-2" },
        ],
    })),
    eip: {
        domain: "vpc",
    },
    natGateway: {
        subnetId: "public-subnet-1",
        tags: { Name: "nat-gw" },
    },
    routeTables: {
        public: {
            routes: [{ cidrBlock: "0.0.0.0/0" }],
            tags: { Name: "public-rt" },
        },
        private: {
            routes: [{ cidrBlock: "0.0.0.0/0" }],
            tags: { Name: "private-rt" },
        },
    },
    openvpnEc2: {
        amiId: "ami-01614d815cf856337",
        instanceName: "OpenVpn",
        vpnServerPorts: [1194, 443, 80, 22, 943],
        instanceType: "t2.small",
    },
    sshkey: {
        openvpn: { name: "open-vpn" },
        eksNodeGroup: { name: "dev-cluster" },
    },
};
