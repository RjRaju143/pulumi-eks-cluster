const { aws, provider, utils } = require("../../config");
const fs = require('fs');
const path = require('path');

// __dirname is already available in CommonJS, no need for fileURLToPath
const publicKeyPath = path.resolve(__dirname, '../../config/ssh-keys/id_rsa.pub');

// Read the public key file content
const publicKeyContent = fs.readFileSync(publicKeyPath, 'utf8');

// Create the SSH Key Pair
export const sshKey = new aws.ec2.KeyPair("dev-cluster-key", {
    keyName: utils.sshkey.openvpn.name,
    publicKey: publicKeyContent,
}, { provider });

