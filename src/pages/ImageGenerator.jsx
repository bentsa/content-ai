import { useState } from 'react'
import { Image, Sparkles, Download, ExternalLink } from 'lucide-react'
import { searchImages } from '../lib/unsplash'
import { generateText } from '../lib/anthropic'
import { useHistory } from '../hooks/useHistory'

const STYLES = ['Photorealistic', 'Cinematic', 'Digital art', 'Oil painting', 'Watercolor', 'Minimalist', 'Abstract', 'Vintage']
const MOODS  = ['Dramatic', 'Calm', 'Energetic', 'Mysterious', 'Joyful', 'Melancholic', 'Epic']

export default function ImageGenerator() {
  const { saveItem } = useHistory()
  const [prompt, setPrompt] = useState('')
  const [style, setStyle]   = useState('Photorealistic')
  const [mood, setMood]     = useState('Dramatic')
  const [count, setCount]   = useState(4)
  const [images, setImages] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError]   = useState('')

  const handleGenerate = async () => {
    if (!prompt.trim()) return
    setError('')
    setLoading(true)
    setImages([])
    try {
      // Use Claude to refine search queries for better Unsplash results
      let queries = [prompt]
      try {
        const system = `Generate ${count} concise Unsplash search queries (2-4 words each) for: "${prompt}", style: ${style}, mood: ${mood}. Return ONLY a JSON array of strings.`
        const raw = await generateText('Generate queries now.', system, 200)
        const parsed = JSON.parse(raw.replace(/```json|```/g, '').trim())
        if (Array.isArray(parsed)) queries = parsed.slice(0, count)
      } catch { /* fall back to raw prompt */ }

      const results = await Promise.all(
        queries.map(q => searchImages(`${q} ${style.toLowerCase()}`, 1).then(imgs => imgs[0]).catch(() => null))
      )
      const valid = results.filter(Boolean)
      setImages(valid)
      await saveItem({
        type: 'image',
        prompt,
        result: JSON.stringify(valid.map(i => i.url)),
        metadata: { style, mood, count },
      })
    } catch (err) {
      setError(err.message || 'Image search failed.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="animate-fade-in">
      <div className="flex items-center gap-3 mb-8">
        <div className="w-10 h-10 rounded-xl bg-pink-500/20 flex items-center justify-center">
          <Image size={20} className="text-pink-400" />
        </div>
        <div>
          <h1 className="font-display text-3xl text-white">Image Generator</h1>
          <p className="text-white/40 text-sm">Curated visuals from Unsplash, refined by AI</p>
        </div>
      </div>

      <div className="space-y-5 mb-8">
        <div>
          <label className="block text-xs font-medium text-white/50 mb-2 uppercase tracking-wide">Describe your image</label>
          <textarea
            rows={3}
            placeholder="A dramatic African savanna at golden hour, silhouettes of acacia trees…"
            className="input-field resize-none"
            value={prompt}
            onChange={e => setPrompt(e.target.value)}
          />
        </div>

        <div className="grid grid-cols-2 gap-5">
          <div>
            <label className="block text-xs font-medium text-white/50 mb-2 uppercase tracking-wide">Style</label>
            <div className="flex flex-wrap gap-2">
              {STYLES.map(s => (
                <button key={s} onClick={() => setStyle(s)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-medium border transition-all ${style === s ? 'bg-pink-500/20 border-pink-500/40 text-pink-300' : 'border-white/10 text-white/40 hover:border-white/20 hover:text-white/70'}`}>
                  {s}
                </button>
              ))}
            </div>
          </div>
          <div>
            <label className="block text-xs font-medium text-white/50 mb-2 uppercase tracking-wide">Mood</label>
            <div className="flex flex-wrap gap-2">
              {MOODS.map(m => (
                <button key={m} onClick={() => setMood(m)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-medium border transition-all ${mood === m ? 'bg-pink-500/20 border-pink-500/40 text-pink-300' : 'border-white/10 text-white/40 hover:border-white/20 hover:text-white/70'}`}>
                  {m}
                </button>
              ))}
            </div>
          </div>
        </div>

        <div className="flex items-center gap-4">
          <label className="text-xs font-medium text-white/50 uppercase tracking-wide">Count:</label>
          {[2, 4, 6].map(n => (
            <button key={n} onClick={() => setCount(n)}
              className={`w-9 h-9 rounded-lg text-sm font-medium border transition-all ${count === n ? 'bg-pink-500/20 border-pink-500/40 text-pink-300' : 'border-white/10 text-white/40 hover:border-white/20 hover:text-white/70'}`}>
              {n}
            </button>
          ))}
        </div>

        {error && <p className="text-red-400 text-sm bg-red-500/10 border border-red-500/20 rounded-xl px-4 py-3">{error}</p>}

        <button onClick={handleGenerate} disabled={loading || !prompt.trim()} className="btn-primary flex items-center gap-2">
          {loading
            ? <><div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" /> Searching…</>
            : <><Sparkles size={16} /> Generate Images</>
          }
        </button>
      </div>

      {/* Results grid */}
      {(loading || images.length > 0) && (
        <div className={`grid gap-4 ${count === 2 ? 'grid-cols-2' : count === 4 ? 'grid-cols-2' : 'grid-cols-3'}`}>
          {loading
            ? Array.from({ length: count }).map((_, i) => (
                <div key={i} className="aspect-video rounded-2xl shimmer" />
              ))
            : images.map((img, i) => (
                <div key={i} className="group relative aspect-video rounded-2xl overflow-hidden border border-white/10">
                  <img src={img.url} alt={`result ${i+1}`} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" loading="lazy" />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-200 flex items-end p-3 gap-2">
                    <a href={img.url} target="_blank" rel="noreferrer"
                      className="flex items-center gap-1 bg-white/10 backdrop-blur border border-white/20 text-white text-xs px-3 py-1.5 rounded-lg hover:bg-white/20 transition-colors">
                      <Download size={12} /> Save
                    </a>
                    <a href={img.link} target="_blank" rel="noreferrer"
                      className="flex items-center gap-1 bg-white/10 backdrop-blur border border-white/20 text-white text-xs px-3 py-1.5 rounded-lg hover:bg-white/20 transition-colors">
                      <ExternalLink size={12} /> Source
                    </a>
                  </div>
                  {img.author && (
                    <div className="absolute top-2 right-2 text-xs text-white/50 bg-black/40 backdrop-blur px-2 py-1 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity">
                      📷 {img.author}
                    </div>
                  )}
                </div>
              ))
          }
        </div>
      )}

      {!loading && images.length === 0 && (
        <div className="card text-center py-16">
          <Image size={40} className="text-white/10 mx-auto mb-3" />
          <p className="text-white/20 text-sm">Your generated images will appear here</p>
        </div>
      )}
    </div>
  )
}
