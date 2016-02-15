import { merge } from 'lodash';
import schema from '../../src/schema';

export const identifier = 'cubedro@github.org';
export const password = 'P@ssW0rd!';
export const seed = 'possible decide orphan produce pumpkin until ' +
  'peace rapid economy exercise violin among';
export const entropy = '9aa2bf846ecf0f630f96ed16acbe9a7479a6de86fbf7bca';
export const resultToken = 'cdabfe8bce1d1ce64f025fc7099ae38d0bc8ae7e364246b11a9b53448715f333d0aed' +
  '056babd64504e8c7f16534928baa6268d369e167cdc8c02f21586092c11416b56b5ec4b56ffa77739a5552e934187f' +
  '6577819fef2f52c231f30b6f75472f8015dcdf6d43e81bdb31cb0a9e67b2860000ad0282c56d15ae195aea6fa0d1c2' +
  '12184edb4459ce313382e4f4a88a8a0df99619fdf85adfb252de85a160965aa8dd6fa854e9bd9958b8fded87597fd2' +
  '6e481b3e71cc9ea950829e902c4b357e55848b60063d488d9d5126e95310416d220c7b654476b59af70363fbd0469b' +
  '1609af7350dbf54e08079aa2bf846ecf0f630f96ed16acbe9a7479a6de86fbf7bca';
export const generatedIdentity = merge(schema, { identifier, token: resultToken });
export const secret = '6e481b3e71cc9ea950829e902c4b357e55848b60063d488d9d5126e95310416d220c7b6544' +
  '76b59af70363fbd0469b';
export const address = '6c16477d5b02df0d51f9b8494c0f3a59be014940';
