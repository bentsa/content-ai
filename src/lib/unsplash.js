const UNSPLASH_KEY = import.meta.env.VITE_UNSPLASH_ACCESS_KEY

/**
 * Search Unsplash for high-quality images
 * @param {string} query
 * @param {number} count
 * @returns {Promise<Array<{url: string, thumb: string, author: string, link: string}>>}
 */
export async function searchImages(query, count = 4) {
  if (!UNSPLASH_KEY) {
    // Fallback to source.unsplash.com (no key needed, lower quality)
    return Array.from({ length: count }, (_, i) => ({
      url: `https://source.unsplash.com/featured/800x600/?${encodeURIComponent(query)}&sig=${i + Date.now()}`,
      thumb: `https://source.unsplash.com/featured/400x300/?${encodeURIComponent(query)}&sig=${i + Date.now()}`,
      author: 'Unsplash',
      link: 'https://unsplash.com',
    }))
  }

  const res = await fetch(
    `https://api.unsplash.com/search/photos?query=${encodeURIComponent(query)}&per_page=${count}&orientation=landscape`,
    { headers: { Authorization: `Client-ID ${UNSPLASH_KEY}` } }
  )

  if (!res.ok) throw new Error('Unsplash API error')

  const data = await res.json()
  return data.results.map(photo => ({
    url: photo.urls.regular,
    thumb: photo.urls.small,
    author: photo.user.name,
    link: photo.links.html,
  }))
}
