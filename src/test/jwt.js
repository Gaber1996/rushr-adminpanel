/** A fake (unsigned) JWT whose payload is `claims` — enough for code that only reads claims. */
export function fakeJwt(claims) {
  const encode = (obj) =>
    btoa(JSON.stringify(obj)).replace(/=+$/, '').replace(/\+/g, '-').replace(/\//g, '_')
  return `${encode({ alg: 'none', typ: 'JWT' })}.${encode(claims)}.signature`
}
