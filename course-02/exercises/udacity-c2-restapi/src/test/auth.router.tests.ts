import {AuthRouter, comparePasswords, generateJWT, generatePassword} from '../controllers/v0/users/routes/auth.router';

import { expect } from 'chai';
import 'mocha';
import {User} from '../controllers/v0/users/models/User';

describe('generate and validate password', () => {

  it('should generate and validate password', async () => {
    const hashedPassword = await generatePassword('mypass');

    const compare = await comparePasswords('mypass', hashedPassword);
    expect(compare).to.equal(true);
  });

});

describe('jwt token', () => {

  it('should generate jwt token', () => {
    const user = {id: 123, email: 'asdf@example.com'};
    const jwt = generateJWT(<User> user);

    console.log('jwt: ' + jwt);
    expect(jwt.length > 0).to.equal(true);
  });
});
