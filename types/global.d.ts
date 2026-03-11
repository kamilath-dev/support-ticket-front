// declare minimal process globals used by Nuxt
// this file will be picked up by TypeScript automatically

declare const process: {
  client: boolean
  server: boolean
  [key: string]: any
}
