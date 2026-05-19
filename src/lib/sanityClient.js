import { createClient } from '@sanity/client'
import imageUrlBuilder from '@sanity/image-url'

export const client = createClient({
  projectId: 'hvcy42nf',
  dataset: 'production',
  apiVersion: '2026-05-06',
  useCdn: true,
})

const builder = imageUrlBuilder(client)

export function urlFor(source) {
  return builder.image(source)
}