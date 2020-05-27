/**
 * https://github.com/sgmeyer/auth0-node-jwks-rs256/blob/master/src/lib/JwksClient.js#L7-L28
 **/
import request from 'request';
// import { JwksError, SigningKeyNotFoundError } from './errors';

// import { certToPEM } from './utils';

export class JwksClient {
    private options: any;
    constructor(options) {
        this.options = { strictSsl: true, ...options };
    }

    getJwks(cb) {
        request({
            uri: this.options.jwksUri,
            strictSsl: this.options.strictSsl,
            json: true
        }, (err, res) => {
            if (err || res.statusCode < 200 || res.statusCode >= 300) {
                if (res) {
                    return cb(new Error(res.body && (res.body.message || res.body) || res.statusMessage || `Http Error ${res.statusCode}`));
                }
                return cb(err);
            }

            var jwks = res.body.keys;
            return cb(null, jwks);
        });
    }

    /**
     * https://github.com/sgmeyer/auth0-node-jwks-rs256/blob/master/src/lib/JwksClient.js#L30-L58
     **/
    getSigningKeys(cb) {
        const callback = (err, keys) => {
            if (err) {
                return cb(err);
            }

            if (!keys || !keys.length) {
                return cb(new Error('The JWKS endpoint did not contain any keys'));
            }

            const signingKeys = keys
                .filter(key => key.use === 'sig' // JWK property `use` determines the JWK is for signing
                    && key.kty === 'RSA' // We are only supporting RSA (RS256)
                    && key.kid           // The `kid` must be present to be useful for later
                    && ((key.x5c && key.x5c.length) || (key.n && key.e)) // Has useful public keys
                ).map(key => {
                    return { kid: key.kid, nbf: key.nbf, publicKey: this.certToPEM(key.x5c[0]) };
                });

            // If at least one signing key doesn't exist we have a problem... Kaboom.
            if (!signingKeys.length) {
                return cb(new Error('The JWKS endpoint did not contain any signing keys'));
            }

            // Returns all of the available signing keys.
            return cb(null, signingKeys);
        };

        this.getJwks(callback);
    }

    getSigningKey = (kid, cb) => {
        const callback = (err, keys) => {
            if (err) {
                return cb(err);
            }

            const signingKey = keys.find(key => key.kid === kid);

            if (!signingKey) {
                var error = new Error(`Unable to find a signing key that matches '${kid}'`);
                return cb(error);
            }

            return cb(null, signingKey)
        };

        this.getSigningKeys(callback);
    }

    certToPEM(cert) {
        cert = cert.match(/.{1,64}/g).join('\n');
        cert = `-----BEGIN CERTIFICATE-----\n${cert}\n-----END CERTIFICATE-----\n`;
        return cert;
    }
}
