import {getLogger, ResourceError} from '../core/utils';
import {headers} from '../core/api';

const log = getLogger('auth/resource');

export async function getToken(server, user) {
  const url = `${server.url}/api/auth/session?username=${user.username}&password=${user.password}`;
  log(`getToken ${url}`);
  let ok;
  let json = await fetch(url, {method: 'GET', headers })
    .then(res => {
      console.log(res);
      ok = res.ok;
      return res.json();
    });
  if (ok) {
    console.log(json.token);
    return json.token;
  } else {
    throw new ResourceError(`Authentication failed`, json.issue);
  }
};
