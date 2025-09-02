import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

// Check if Supabase credentials are properly configured
const isSupabaseConfigured = supabaseUrl && supabaseAnonKey && 
  supabaseUrl !== 'YOUR_SUPABASE_URL' && 
  supabaseAnonKey !== 'YOUR_SUPABASE_ANON_KEY' &&
  supabaseUrl.startsWith('https://')

export const supabase = isSupabaseConfigured 
  ? createClient(supabaseUrl, supabaseAnonKey)
  : null

// Database Types
export interface QRCodeRecord {
  id?: string
  type: string
  content: string
  data: Record<string, unknown>
  style: Record<string, unknown>
  image_url?: string
  created_at?: string
  updated_at?: string
  scan_count?: number
  last_scanned?: string
  user_id?: string
}

export interface QRTemplate {
  id?: string
  name: string
  type: string
  description: string
  default_data: Record<string, unknown>
  default_style: Record<string, unknown>
  category: string
  is_popular?: boolean
  created_at?: string
}

export interface QRAnalytics {
  id?: string
  qr_code_id: string
  scan_date: string
  user_agent?: string
  ip_address?: string
  country?: string
  city?: string
  device_type?: string
}

// Database operations
export const dbOperations = {
  // QR Code operations
  async createQRCode(qrCode: Omit<QRCodeRecord, 'id' | 'created_at' | 'updated_at'>, userId?: string) {
    if (!supabase) {
      console.warn('Supabase not configured. QR code not saved to database.')
      return null
    }
    
    const { data, error } = await supabase
      .from('qr_codes')
      .insert([{ ...qrCode, user_id: userId }])
      .select()
      .single()
    
    if (error) throw error
    return data
  },

  async getQRCodes(limit = 10, offset = 0, userId?: string) {
    if (!supabase) {
      console.warn('Supabase not configured. Returning empty array.')
      return []
    }
    
    let query = supabase
      .from('qr_codes')
      .select('*')
      .order('created_at', { ascending: false })
      .range(offset, offset + limit - 1)
    
    // Filter by user_id if provided
    if (userId) {
      query = query.eq('user_id', userId)
    }
    
    const { data, error } = await query
    
    if (error) throw error
    return data
  },

  async updateQRCode(id: string, updates: Partial<QRCodeRecord>, userId?: string) {
    if (!supabase) {
      console.warn('Supabase not configured. QR code not updated.')
      return null
    }
    
    let query = supabase
      .from('qr_codes')
      .update({ ...updates, updated_at: new Date().toISOString() })
      .eq('id', id)
    
    // Add user_id check if provided
    if (userId) {
      query = query.eq('user_id', userId)
    }
    
    const { data, error } = await query.select().single()
    
    if (error) throw error
    return data
  },

  async deleteQRCode(id: string, userId?: string) {
    if (!supabase) {
      console.warn('Supabase not configured. QR code not deleted.')
      return
    }
    
    let query = supabase
      .from('qr_codes')
      .delete()
      .eq('id', id)
    
    // Add user_id check if provided
    if (userId) {
      query = query.eq('user_id', userId)
    }
    
    const { error } = await query
    
    if (error) throw error
  },

  // Template operations
  async getTemplates(category?: string) {
    if (!supabase) {
      console.warn('Supabase not configured. Returning empty templates.')
      return []
    }
    
    let query = supabase
      .from('qr_templates')
      .select('*')
      .order('is_popular', { ascending: false })
    
    if (category) {
      query = query.eq('category', category)
    }
    
    const { data, error } = await query
    if (error) throw error
    return data
  },

  // Analytics operations
  async recordScan(qrCodeId: string, scanData: Partial<QRAnalytics>) {
    if (!supabase) {
      console.warn('Supabase not configured. Scan not recorded.')
      return
    }
    
    // Record the scan
    const { error: analyticsError } = await supabase
      .from('qr_analytics')
      .insert([{ qr_code_id: qrCodeId, scan_date: new Date().toISOString(), ...scanData }])
    
    if (analyticsError) throw analyticsError

    // Update scan count
    const { error: updateError } = await supabase.rpc('increment_scan_count', {
      qr_id: qrCodeId
    })
    
    if (updateError) throw updateError
  },

  async getQRAnalytics(qrCodeId: string, days = 30) {
    if (!supabase) {
      console.warn('Supabase not configured. Returning empty analytics.')
      return []
    }
    
    const startDate = new Date()
    startDate.setDate(startDate.getDate() - days)
    
    const { data, error } = await supabase
      .from('qr_analytics')
      .select('*')
      .eq('qr_code_id', qrCodeId)
      .gte('scan_date', startDate.toISOString())
      .order('scan_date', { ascending: false })
    
    if (error) throw error
    return data
  },

  async getAnalyticsSummary(userId?: string) {
    if (!supabase) {
      console.warn('Supabase not configured. Returning empty analytics summary.')
      return []
    }
    
    let query = supabase
      .from('qr_codes')
      .select(`
        id,
        type,
        scan_count,
        created_at,
        last_scanned
      `)
      .order('scan_count', { ascending: false })
      .limit(10)
    
    // Filter by user_id if provided
    if (userId) {
      query = query.eq('user_id', userId)
    }
    
    const { data, error } = await query
    
    if (error) throw error
    return data
  }
}
