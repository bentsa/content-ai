import { useState, useEffect, useCallback } from 'react'
import { supabase } from '../lib/supabase'
import { useAuth } from '../context/AuthContext'

/**
 * Hook to manage generation history in Supabase.
 *
 * Supabase table: content_history
 * Columns:
 *   id          uuid (default: gen_random_uuid())
 *   user_id     uuid references auth.users(id)
 *   type        text  -- 'text' | 'image'
 *   prompt      text
 *   result      text  -- generated text OR image URL(s) as JSON string
 *   metadata    jsonb -- extra info (tone, style, platform, etc.)
 *   created_at  timestamptz (default: now())
 */
export function useHistory() {
  const { user } = useAuth()
  const [history, setHistory] = useState([])
  const [loading, setLoading] = useState(false)

  const fetchHistory = useCallback(async () => {
    if (!user) return
    setLoading(true)
    const { data, error } = await supabase
      .from('content_history')
      .select('*')
      .eq('user_id', user.id)
      .order('created_at', { ascending: false })
      .limit(50)

    if (!error) setHistory(data || [])
    setLoading(false)
  }, [user])

  useEffect(() => { fetchHistory() }, [fetchHistory])

  const saveItem = async ({ type, prompt, result, metadata = {} }) => {
    if (!user) return
    const { data, error } = await supabase
      .from('content_history')
      .insert({ user_id: user.id, type, prompt, result, metadata })
      .select()
      .single()

    if (!error) setHistory(prev => [data, ...prev])
  }

  const deleteItem = async (id) => {
    await supabase.from('content_history').delete().eq('id', id)
    setHistory(prev => prev.filter(h => h.id !== id))
  }

  const clearAll = async () => {
    if (!user) return
    await supabase.from('content_history').delete().eq('user_id', user.id)
    setHistory([])
  }

  return { history, loading, saveItem, deleteItem, clearAll, refetch: fetchHistory }
}
