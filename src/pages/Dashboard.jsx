import { Link } from 'react-router-dom'
import { Type, Image, History, ArrowRight, Zap, TrendingUp, Clock } from 'lucide-react'
import { useAuth } from '../context/AuthContext'
import { useHistory } from '../hooks/useHistory'

const quickActions = [
  { to: '/text-generator',  icon: Type,   label: 'Text Generator',   desc: 'Blog posts, emails, essays & more', color: 'from-violet-500 to-purple-700' },
  { to: '/image-generator', icon: Image,  label: 'Image Generator',  desc: 'Stunning visuals from your words',  color: 'from-pink-500 to-rose-700' },
  { to: '/history',         icon: History, label: 'History',          desc: 'All your past generations',         color: 'from-amber-500 to-orange-700' },
]

export default function Dashboard() {
  const { user } = useAuth()
  const { history } = useHistory()

  const name = user?.user_metadata?.full_name?.split(' ')[0] || 'there'
  const textCount  = history.filter(h => h.type === 'text').length
  const imageCount = history.filter(h => h.type === 'image').length

  return (
    <div className="animate-fade-in">
      {/* Header */}
      <div className="mb-10">
        <h1 className="font-display text-4xl text-white mb-2">
          Hey, {name} 👋
        </h1>
        <p className="text-white/50">What are we creating today?</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-4 mb-10">
        {[
          { icon: Type,        label: 'Texts generated',  value: textCount  },
          { icon: Image,       label: 'Images generated', value: imageCount },
          { icon: TrendingUp,  label: 'Total generations', value: history.length },
        ].map(({ icon: Icon, label, value }) => (
          <div key={label} className="card text-center">
            <Icon size={20} className="text-brand-400 mx-auto mb-2" />
            <div className="text-3xl font-semibold text-white mb-0.5">{value}</div>
            <div className="text-xs text-white/40">{label}</div>
          </div>
        ))}
      </div>

      {/* Quick actions */}
      <h2 className="text-sm font-semibold text-white/50 uppercase tracking-widest mb-4">
        Quick actions
      </h2>
      <div className="grid grid-cols-1 gap-3 mb-10">
        {quickActions.map(({ to, icon: Icon, label, desc, color }) => (
          <Link key={to} to={to} className="card group flex items-center gap-5 hover:border-white/20 no-underline">
            <div className={`w-11 h-11 rounded-xl bg-gradient-to-br ${color} flex items-center justify-center shrink-0`}>
              <Icon size={20} className="text-white" />
            </div>
            <div className="flex-1 min-w-0">
              <div className="text-white font-medium text-sm">{label}</div>
              <div className="text-white/40 text-xs mt-0.5">{desc}</div>
            </div>
            <ArrowRight size={16} className="text-white/20 group-hover:text-white/50 group-hover:translate-x-1 transition-all" />
          </Link>
        ))}
      </div>

      {/* Recent */}
      {history.length > 0 && (
        <>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-sm font-semibold text-white/50 uppercase tracking-widest">Recent</h2>
            <Link to="/history" className="text-xs text-brand-400 hover:text-brand-300">View all →</Link>
          </div>
          <div className="flex flex-col gap-2">
            {history.slice(0, 4).map(item => (
              <div key={item.id} className="card py-3 px-4 flex items-center gap-3">
                <div className={`w-7 h-7 rounded-lg flex items-center justify-center ${item.type === 'text' ? 'bg-violet-500/20' : 'bg-pink-500/20'}`}>
                  {item.type === 'text'
                    ? <Type size={13} className="text-violet-400" />
                    : <Image size={13} className="text-pink-400" />
                  }
                </div>
                <p className="flex-1 text-sm text-white/70 truncate">{item.prompt}</p>
                <span className="flex items-center gap-1 text-xs text-white/30 shrink-0">
                  <Clock size={11} />
                  {new Date(item.created_at).toLocaleDateString()}
                </span>
              </div>
            ))}
          </div>
        </>
      )}

      {history.length === 0 && (
        <div className="card text-center py-12">
          <Zap size={32} className="text-brand-500/40 mx-auto mb-3" />
          <p className="text-white/30 text-sm">No generations yet — pick an action above to get started!</p>
        </div>
      )}
    </div>
  )
}
