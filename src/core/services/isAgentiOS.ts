export const isAgentiOS = () => [
  'iPad Simulator',
  'iPhone Simulator',
  'iPod Simulator',
  'iPad',
  'iPhone',
  'iPod'
].includes(navigator.platform)
// iPadOS
|| (navigator.userAgent.includes("Mac") && "ontouchend" in document)
