/**
 * https://github.com/sgmeyer/auth0-node-jwks-rs256/blob/master/src/lib/JwksClient.js#L7-L28
 **/
import * as request from "request";

export class JwksClient {
    private options: any;

    constructor(options) {
        this.options = {strictSsl: true, ...options};
    }

    async getJwks(): Promise<any[]> {
        return new Promise((resolve, reject) => {
            request({
                uri: this.options.jwksUri,
                json: true
            }, (error, response) => {
                if (error) {
                    reject(error)
                }
                resolve(response.body.keys)
            });
        })
    }

    /**
     * https://github.com/sgmeyer/auth0-node-jwks-rs256/blob/master/src/lib/JwksClient.js#L30-L58
     **/
    async getSigningKeys(): Promise<any[]> {
        const keys = await this.getJwks();

        if (!keys || !keys.length) {
            throw new Error('The JWKS endpoint did not contain any keys');
        }

        const signingKeys = keys
            .filter(key => key.use === 'sig' // JWK property `use` determines the JWK is for signing
                && key.kty === 'RSA' // We are only supporting RSA (RS256)
                && key.kid           // The `kid` must be present to be useful for later
                && ((key.x5c && key.x5c.length) || (key.n && key.e)) // Has useful public keys
            ).map(key => {
                return {kid: key.kid, nbf: key.nbf, publicKey: this.certToPEM(key.x5c[0])};
            });

        // If at least one signing key doesn't exist we have a problem... Kaboom.
        if (!signingKeys.length) {
            throw new Error('The JWKS endpoint did not contain any signing keys');
        }

        // Returns all of the available signing keys.
        return signingKeys as any[];
    };


    async getSigningKey(kid): Promise<string> {
        const keys = await this.getSigningKeys();

        const signingKey = keys.find(key => key.kid === kid);

        if (!signingKey) {
            var error = new Error(`Unable to find a signing key that matches '${kid}'`);
            throw error;
        }

        return signingKey
    }

    certToPEM(cert) {
        cert = cert.match(/.{1,64}/g).join('\n');
        cert = `-----BEGIN CERTIFICATE-----\n${cert}\n-----END CERTIFICATE-----\n`;
        return cert;
    }
}
