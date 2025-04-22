import * as aws from "@pulumi/aws";
import * as eks from "@pulumi/eks";
import * as dotenv from "dotenv";
dotenv.config();

export const provider = new aws.Provider("awsProvider", {
    region: (process.env.AWS_REGION || "ap-south-1") as aws.Region,
    accessKey: process.env.AWS_ACCESS_KEY_ID!,
    secretKey: process.env.AWS_SECRET_ACCESS_KEY!,
});

export { aws, eks };
