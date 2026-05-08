import { Outlet, NavLink, useNavigate } from 'react-router-dom'
import { LayoutDashboard, Type, Image, History, LogOut, Sparkles } from 'lucide-react'
import { useAuth } from '../../context/AuthContext'

const nav = [
  { to: '/dashboard',       icon: LayoutDashboard, label: 'Dashboard'       },
  { to: '/text-generator',  icon: Type,            label: 'Text Generator'  },
  { to: '/image-generator', icon: Image,           label: 'Image Generator' },
  { to: '/history',         icon: History,         label: 'History'         },
]

export default function Layout() {
  const { user, signOut } = useAuth()
  const navigate = useNavigate()

  const handleSignOut = async () => {
    await signOut()
    navigate('/login')
  }

  const initials = user?.user_metadata?.full_name
    ?.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2) || '?'

  return (
    <div className="flex min-h-screen">
      {/* Sidebar */}
      <aside className="w-64 shrink-0 flex flex-col glass border-r border-white/8 px-4 py-6">
        {/* Logo */}
        <div className="flex items-center gap-2.5 px-2 mb-8">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-brand-400 to-brand-700 flex items-center justify-center">
            <Sparkles size={16} className="text-white" />
          </div>
          <span className="font-display text-lg text-white">ContentAI</span>
        </div>

        {/* Nav */}
        <nav className="flex flex-col gap-1 flex-1">
          {nav.map(({ to, icon: Icon, label }) => (
            <NavLink
              key={to}
              to={to}
              className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}
            >
              <Icon size={18} />
              {label}
            </NavLink>
          ))}
        </nav>

        {/* User */}
        <div className="border-t border-white/8 pt-4 mt-4">
          <div className="flex items-center gap-3 px-2 mb-3">
            <div className="w-8 h-8 rounded-full bg-brand-600 flex items-center justify-center text-xs font-semibold text-white">
              {initials}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-white truncate">
                {user?.user_metadata?.full_name || 'User'}
              </p>
              <p className="text-xs text-white/40 truncate">{user?.email}</p>
            </div>
          </div>
          <button onClick={handleSignOut} className="nav-link w-full text-red-400 hover:text-red-300 hover:bg-red-500/10">
            <LogOut size={16} />
            Sign out
          </button>
        </div>
      </aside>

      {/* Main */}
      <main className="flex-1 overflow-y-auto">
        <div className="max-w-4xl mx-auto px-8 py-10">
          <Outlet />
        </div>
      </main>
    </div>
  )
}
