import { useState } from 'react'
import { History as HistoryIcon, Type, Image, Trash2, Clock, Search, AlertTriangle } from 'lucide-react'
import { useHistory } from '../hooks/useHistory'

export default function History() {
  const { history, loading, deleteItem, clearAll } = useHistory()
  const [filter, setFilter]   = useState('all')
  const [search, setSearch]   = useState('')
  const [confirm, setConfirm] = useState(false)

  const filtered = history.filter(h => {
    if (filter !== 'all' && h.type !== filter) return false
    if (search && !h.prompt.toLowerCase().includes(search.toLowerCase())) return false
    return true
  })

  const handleClearAll = async () => {
    if (!confirm) { setConfirm(true); return }
    await clearAll()
    setConfirm(false)
  }

  return (
    <div className="animate-fade-in">
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-amber-500/20 flex items-center justify-center">
            <HistoryIcon size={20} className="text-amber-400" />
          </div>
          <div>
            <h1 className="font-display text-3xl text-white">History</h1>
            <p className="text-white/40 text-sm">{history.length} total generations</p>
          </div>
        </div>
        {history.length > 0 && (
          <button onClick={handleClearAll}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-medium border transition-all ${confirm ? 'bg-red-500/20 border-red-500/40 text-red-400' : 'border-white/10 text-white/40 hover:border-red-500/30 hover:text-red-400'}`}>
            {confirm ? <><AlertTriangle size={13} /> Confirm clear all</> : <><Trash2 size={13} /> Clear all</>}
          </button>
        )}
      </div>

      {/* Filters */}
      <div className="flex items-center gap-3 mb-6">
        <div className="relative flex-1 max-w-xs">
          <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-white/30" />
          <input className="input-field pl-9 py-2 text-sm" placeholder="Search prompts…" value={search} onChange={e => setSearch(e.target.value)} />
        </div>
        {['all', 'text', 'image'].map(f => (
          <button key={f} onClick={() => setFilter(f)}
            className={`px-4 py-2 rounded-xl text-xs font-medium border capitalize transition-all ${filter === f ? 'bg-brand-500/20 border-brand-500/40 text-brand-300' : 'border-white/10 text-white/40 hover:border-white/20 hover:text-white/60'}`}>
            {f === 'all' ? 'All' : f === 'text' ? '✏️ Text' : '🖼 Images'}
          </button>
        ))}
      </div>

      {/* List */}
      {loading && (
        <div className="space-y-3">
          {Array.from({ length: 5 }).map((_, i) => <div key={i} className="h-20 rounded-2xl shimmer" />)}
        </div>
      )}

      {!loading && filtered.length === 0 && (
        <div className="card text-center py-16">
          <HistoryIcon size={40} className="text-white/10 mx-auto mb-3" />
          <p className="text-white/20 text-sm">
            {history.length === 0 ? 'No generations yet. Start creating!' : 'No results match your filter.'}
          </p>
        </div>
      )}

      {!loading && filtered.length > 0 && (
        <div className="space-y-3">
          {filtered.map(item => (
            <div key={item.id} className="card flex gap-4 items-start py-4">
              <div className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 ${item.type === 'text' ? 'bg-violet-500/20' : 'bg-pink-500/20'}`}>
                {item.type === 'text'
                  ? <Type size={16} className="text-violet-400" />
                  : <Image size={16} className="text-pink-400" />
                }
              </div>

              <div className="flex-1 min-w-0">
                <p className="text-white/80 text-sm font-medium truncate">{item.prompt}</p>
                <div className="flex items-center gap-3 mt-1">
                  <span className="text-xs text-white/30 capitalize">{item.metadata?.contentType || item.type}</span>
                  {item.metadata?.tone && <span className="text-xs text-white/20">· {item.metadata.tone}</span>}
                  <span className="flex items-center gap-1 text-xs text-white/20">
                    <Clock size={10} />
                    {new Date(item.created_at).toLocaleString()}
                  </span>
                </div>

                {/* Preview */}
                {item.type === 'text' && item.result && (
                  <p className="text-white/30 text-xs mt-2 line-clamp-2 leading-relaxed">{item.result}</p>
                )}
                {item.type === 'image' && item.result && (() => {
                  try {
                    const urls = JSON.parse(item.result)
                    return (
                      <div className="flex gap-2 mt-2">
                        {urls.slice(0, 3).map((url, i) => (
                          <img key={i} src={url} alt="" className="w-14 h-10 object-cover rounded-lg opacity-60" />
                        ))}
                      </div>
                    )
                  } catch { return null }
                })()}
              </div>

              <button onClick={() => deleteItem(item.id)}
                className="shrink-0 w-8 h-8 rounded-lg border border-white/10 flex items-center justify-center text-white/20 hover:text-red-400 hover:border-red-500/30 transition-all">
                <Trash2 size={13} />
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
