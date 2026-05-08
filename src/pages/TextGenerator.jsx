import { useState } from 'react'
import { Type, Sparkles, Copy, RefreshCw, Check } from 'lucide-react'
import { generateText } from '../lib/anthropic'
import { useHistory } from '../hooks/useHistory'

const CONTENT_TYPES = ['Blog post', 'Email', 'Essay', 'Short story', 'Product description', 'Press release', 'LinkedIn post', 'Speech']
const TONES = ['Professional', 'Casual', 'Inspirational', 'Witty', 'Empathetic', 'Bold', 'Academic']
const LENGTHS = [
  { label: 'Short (~150 words)',  value: 300  },
  { label: 'Medium (~400 words)', value: 700  },
  { label: 'Long (~700 words)',   value: 1200 },
]

export default function TextGenerator() {
  const { saveItem } = useHistory()
  const [prompt, setPrompt]       = useState('')
  const [type, setType]           = useState('Blog post')
  const [tone, setTone]           = useState('Professional')
  const [length, setLength]       = useState(LENGTHS[1])
  const [result, setResult]       = useState('')
  const [loading, setLoading]     = useState(false)
  const [error, setError]         = useState('')
  const [copied, setCopied]       = useState(false)

  const handleGenerate = async () => {
    if (!prompt.trim()) return
    setError('')
    setLoading(true)
    setResult('')
    try {
      const system = `You are an expert content writer. Write a ${type} in a ${tone.toLowerCase()} tone. Target: ${length.label}. Be specific, engaging, and high-quality. Return only the content — no preamble or meta-commentary.`
      const text = await generateText(prompt, system, length.value)
      setResult(text)
      await saveItem({ type: 'text', prompt, result: text, metadata: { contentType: type, tone, length: length.label } })
    } catch (err) {
      setError(err.message || 'Generation failed. Check your API key.')
    } finally {
      setLoading(false)
    }
  }

  const handleCopy = () => {
    navigator.clipboard.writeText(result)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  const wordCount = result.trim() ? result.trim().split(/\s+/).length : 0

  return (
    <div className="animate-fade-in">
      <div className="flex items-center gap-3 mb-8">
        <div className="w-10 h-10 rounded-xl bg-violet-500/20 flex items-center justify-center">
          <Type size={20} className="text-violet-400" />
        </div>
        <div>
          <h1 className="font-display text-3xl text-white">Text Generator</h1>
          <p className="text-white/40 text-sm">Powered by Claude AI</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Left — Controls */}
        <div className="space-y-5">
          <div>
            <label className="block text-xs font-medium text-white/50 mb-2 uppercase tracking-wide">Your prompt</label>
            <textarea
              rows={5}
              placeholder="Describe what you want to write…"
              className="input-field resize-none"
              value={prompt}
              onChange={e => setPrompt(e.target.value)}
            />
            <p className="text-right text-xs text-white/20 mt-1">{prompt.length} chars</p>
          </div>

          <div>
            <label className="block text-xs font-medium text-white/50 mb-2 uppercase tracking-wide">Content type</label>
            <div className="flex flex-wrap gap-2">
              {CONTENT_TYPES.map(t => (
                <button key={t} onClick={() => setType(t)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-medium border transition-all ${type === t ? 'bg-brand-500/20 border-brand-500/40 text-brand-300' : 'border-white/10 text-white/40 hover:border-white/20 hover:text-white/70'}`}>
                  {t}
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="block text-xs font-medium text-white/50 mb-2 uppercase tracking-wide">Tone</label>
            <div className="flex flex-wrap gap-2">
              {TONES.map(t => (
                <button key={t} onClick={() => setTone(t)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-medium border transition-all ${tone === t ? 'bg-brand-500/20 border-brand-500/40 text-brand-300' : 'border-white/10 text-white/40 hover:border-white/20 hover:text-white/70'}`}>
                  {t}
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="block text-xs font-medium text-white/50 mb-2 uppercase tracking-wide">Length</label>
            <div className="flex gap-2">
              {LENGTHS.map(l => (
                <button key={l.label} onClick={() => setLength(l)}
                  className={`flex-1 px-3 py-2 rounded-lg text-xs font-medium border transition-all ${length.value === l.value ? 'bg-brand-500/20 border-brand-500/40 text-brand-300' : 'border-white/10 text-white/40 hover:border-white/20 hover:text-white/70'}`}>
                  {l.label}
                </button>
              ))}
            </div>
          </div>

          {error && <p className="text-red-400 text-sm bg-red-500/10 border border-red-500/20 rounded-xl px-4 py-3">{error}</p>}

          <button onClick={handleGenerate} disabled={loading || !prompt.trim()} className="btn-primary w-full flex items-center justify-center gap-2">
            {loading
              ? <><div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" /> Generating…</>
              : <><Sparkles size={16} /> Generate</>
            }
          </button>
        </div>

        {/* Right — Output */}
        <div>
          <div className="flex items-center justify-between mb-2">
            <label className="text-xs font-medium text-white/50 uppercase tracking-wide">Result</label>
            {result && (
              <div className="flex items-center gap-2">
                <span className="text-xs text-white/30">{wordCount} words</span>
                <button onClick={handleCopy} className="btn-ghost flex items-center gap-1.5 py-1.5 px-3 text-xs">
                  {copied ? <><Check size={13} className="text-green-400" /> Copied</> : <><Copy size={13} /> Copy</>}
                </button>
                <button onClick={handleGenerate} disabled={loading} className="btn-ghost flex items-center gap-1.5 py-1.5 px-3 text-xs">
                  <RefreshCw size={13} className={loading ? 'animate-spin' : ''} /> Redo
                </button>
              </div>
            )}
          </div>

          <div className="card min-h-[420px]">
            {loading && (
              <div className="space-y-3">
                {[80, 95, 70, 88, 60].map((w, i) => (
                  <div key={i} className={`h-4 rounded shimmer`} style={{ width: `${w}%` }} />
                ))}
              </div>
            )}
            {!loading && result && (
              <p className="text-white/80 text-sm leading-relaxed whitespace-pre-wrap">{result}</p>
            )}
            {!loading && !result && (
              <div className="h-full flex items-center justify-center text-white/20 text-sm">
                Your generated content will appear here
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
