import { useState, useEffect } from 'react'
import { supabase } from '../lib/supabase'
import type { AirQualityData } from '../types/airQuality'

export const useAirQuality = (tableName: string = 'air_quality') => {
  const [data, setData] = useState<AirQualityData | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    // Safety check
    if (!supabase) {
      console.error('❌ Supabase client is not available')
      setError('Supabase client not initialized')
      setLoading(false)
      return
    }

    // Fetch initial data
    const fetchInitialData = async () => {
      try {
        const { data: initialData, error: fetchError } = await supabase
          .from(tableName)
          .select('*')
          .order('created_at', { ascending: false })
          .limit(1)

        if (fetchError) {
          console.error('Supabase fetch error:', fetchError)
          // Check if it's a table not found error
          if (fetchError.code === 'PGRST116' || fetchError.message?.includes('relation') || fetchError.message?.includes('does not exist')) {
            setError(`Table "${tableName}" not found. Please run the SQL setup script in Supabase.`)
          } else {
            setError(fetchError.message || 'Failed to fetch data')
          }
          setLoading(false)
          return
        }

        if (initialData && initialData.length > 0) {
          setData(initialData[0] as AirQualityData)
        } else {
          // No data found, but no error
          setData(null)
        }
        setLoading(false)
      } catch (err) {
        console.error('Error fetching initial data:', err)
        setError(err instanceof Error ? err.message : 'Failed to fetch data')
        setLoading(false)
      }
    }

    fetchInitialData()

    // Set up real-time subscription
    let channel: ReturnType<typeof supabase.channel> | null = null
    
    try {
      channel = supabase
        .channel('air-quality-changes')
        .on(
          'postgres_changes',
          {
            event: '*', // Listen to all changes (INSERT, UPDATE, DELETE)
            schema: 'public',
            table: tableName,
          },
          (payload) => {
            console.log('Real-time update received:', payload)
            try {
              if (payload.eventType === 'INSERT' || payload.eventType === 'UPDATE') {
                setData(payload.new as AirQualityData)
              }
            } catch (err) {
              console.error('Error processing real-time update:', err)
            }
          }
        )
        .subscribe()
    } catch (err) {
      console.error('Error setting up real-time subscription:', err)
      // Don't crash the app if real-time fails
    }

    // Cleanup subscription on unmount
    return () => {
      if (channel) {
        try {
          supabase.removeChannel(channel)
        } catch (err) {
          console.error('Error removing channel:', err)
        }
      }
    }
  }, [tableName])

  return { data, loading, error }
}

