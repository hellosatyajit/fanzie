import { NextResponse } from 'next/server'
import { createClient } from '@/utils/supabase/server'
export async function GET() {
  const supabase = await createClient()
  const { count, error } = await supabase
    .from('waitlist')
    .select('*', { count: 'exact', head: true })
    console.log('Count query executed:', { count, error })
  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  return NextResponse.json({ count })
}