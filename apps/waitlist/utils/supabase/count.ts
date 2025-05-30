import { NextResponse } from 'next/server'
import { createClient } from './server'
export async function GET() {
  const supabase = await createClient()
  const { count, error } = await supabase
    .from('waitlist')
    .select('*', { count: 'exact', head: true })

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

}