export { sleep }

function sleep(dur: number) {
  return new Promise(r => setTimeout(r, dur))
}
