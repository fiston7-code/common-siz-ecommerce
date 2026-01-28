import { MetadataRoute } from 'next'

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: '*',
        allow: '/',
        disallow: [
          '/admin/',
          '/api/',
          '/checkout/',
          '/order-confirmation/',
          '/test-connection/',
          '/test-fetch/',
        ],
      },
    ],
    sitemap: 'https://comon-siz.com/sitemap.xml',
  }
}