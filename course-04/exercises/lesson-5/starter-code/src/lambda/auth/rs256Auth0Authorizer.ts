
import { CustomAuthorizerEvent, CustomAuthorizerResult } from 'aws-lambda'
import 'source-map-support/register'
import {JwtToken} from "../../auth/JwtToken";
import {verify, VerifyOptions} from "jsonwebtoken";

const certificate = `-----BEGIN CERTIFICATE-----
MIIDDTCCAfWgAwIBAgIJe+3ibzR2exEoMA0GCSqGSIb3DQEBCwUAMCQxIjAgBgNV
BAMTGWRldi1qeXYyd2Q2NC5ldS5hdXRoMC5jb20wHhcNMjAwNTE1MDc1MTQ5WhcN
MzQwMTIyMDc1MTQ5WjAkMSIwIAYDVQQDExlkZXYtanl2MndkNjQuZXUuYXV0aDAu
Y29tMIIBIjANBgkqhkiG9w0BAQEFAAOCAQ8AMIIBCgKCAQEAlhDO9U1kbVYZ8osY
/9hrXEsIHmCI+RrcQTuUth8YE+PMsYgtM1zhFjA8I4OCd6Rf7LhBo3zT20o/tlxa
mP88V8jdx31IhGziLQ5y2GFKP7erm+dFn5EcMiXGilBKyWGjWk0fSxUheeuHc2qD
p92wh3MnVg+WPMSY8iADxAK92VlT0xXcG9qBS/8mu8mS0bTZkteRXgX+S7rQAwKh
DfOHj6EKA39/HIW/XZovR0Kw07GmOQVlsBH0SXDsSZIjntTF+mtF9eZUBNXaGGNj
g2kSLvgJ55ZkzxumD+iTHt0iMKmbQiwRcDL4HGh2+nKRcdrTqnioEpGP4oH0sQcT
8hidRwIDAQABo0IwQDAPBgNVHRMBAf8EBTADAQH/MB0GA1UdDgQWBBTnLPgzlE8X
AR7lk4pUC+IO1tR8SDAOBgNVHQ8BAf8EBAMCAoQwDQYJKoZIhvcNAQELBQADggEB
AIOn/TzzVIK3HRd/bkbNsU5sOVI+vuwEnZtKcGUctmskPx8AK9sMCCr6b+kWsSV6
yWczPAeaCgEpjbVh5F+rJ1hzm0aZPPsXZtIsY1pOetKEgfmtPJ1LyOWvI+SV26R8
J7A/yAV5xqLQM2L6b8XxvXNcH5TwxVg1/4cMRodrfoDZ+dKDScApOqm+ekb0veje
n/FSXvNlJCPs3desCHW5ZGc3yDicNMJRZY0qLdtQ63G1+Ov5aN+CVRFbUUUQwtMY
4jXkM4S9/kgLGx99UU/hlJT822xbllYpOkJU60VjB/jkcGox57SHDIr+O09ZuZP0
ugJeIaSRFs8MJnxRWF7f+rY=
-----END CERTIFICATE-----`
// const certificate = process.env.AUTH_0_CERTIFICATE.replace(/\\n/gm, '\n');
console.log('env1: ' + process.env.AUTH_0_CERTIFICATE)
console.log('env2: ' + process.env.AUTH_0_CERTIFICATE.replace(/\\n/gm, '\n'))
console.log('cert: ' + certificate)

export const handler = async (event: CustomAuthorizerEvent): Promise<CustomAuthorizerResult> => {
  try {
    const decodedToken = verifyToken(
        event.authorizationToken,
        certificate,
        { algorithms: ['RS256'] }
    )
    console.log('User was authorized', decodedToken)

    return {
      principalId: decodedToken.sub,
      policyDocument: {
        Version: '2012-10-17',
        Statement: [
          {
            Action: 'execute-api:Invoke',
            Effect: 'Allow',
            Resource: '*'
          }
        ]
      }
    }
  } catch (e) {
    console.log('User was not authorized', e.message)

    return {
      principalId: 'user',
      policyDocument: {
        Version: '2012-10-17',
        Statement: [
          {
            Action: 'execute-api:Invoke',
            Effect: 'Deny',
            Resource: '*'
          }
        ]
      }
    }
  }
}

function verifyToken(authHeader: string, certificate: string, options: VerifyOptions): JwtToken {
  if (!authHeader)
    throw new Error('No authentication header')

  if (!authHeader.toLowerCase().startsWith('bearer '))
    throw new Error('Invalid authentication header')

  const split = authHeader.split(' ')
  const token = split[1]

  return verify(token, certificate, options) as JwtToken
}
