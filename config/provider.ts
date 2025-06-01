import * as aws from "@pulumi/aws";
import * as eks from "@pulumi/eks";
import * as pulumi from "@pulumi/pulumi";

import { utils } from "./utils"

export const provider = new aws.Provider("awsProvider", {
    region: (utils.AWS_REGION) as aws.Region,
    accessKey: utils.AWS_ACCESS_KEY_ID,
    secretKey: utils.AWS_SECRET_ACCESS_KEY,
});

export { aws, eks, pulumi };
