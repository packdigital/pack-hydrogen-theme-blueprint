export function parseJSON(json: any) {
  try {
    if (String(json).includes('__proto__')) return JSON.parse(json, noproto);
    return JSON.parse(json);
  } catch (error) {
    console.error('parseJSON:error:', error);
    return null;
  }
}
function noproto(k: string, v: string) {
  if (k !== '__proto__') return v;
}
