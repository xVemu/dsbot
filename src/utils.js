export const fetchJson = url => fetch(url).then(res => res.json())

export async function runCatching(fn) {
  try {
    return [undefined, await fn]
  } catch (e) {
    return [e, {}]
  }
}
