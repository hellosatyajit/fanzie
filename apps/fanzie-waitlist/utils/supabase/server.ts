import { createServerClient } from "@supabase/ssr"
import { cookies } from "next/headers"

export async function createClient() {
  try {
    const cookieStore = await cookies()

    // Check if environment variables are available
    const supabaseUrl = process.env.SUPABASE_URL
    const supabaseAnonKey = process.env.SUPABASE_ANON_KEY

    if (!supabaseUrl || !supabaseAnonKey) {
      console.error("Missing Supabase environment variables")
      console.error("SUPABASE_URL:", supabaseUrl ? "Set" : "Missing")
      console.error("SUPABASE_ANON_KEY:", supabaseAnonKey ? "Set" : "Missing")
      throw new Error("Missing Supabase environment variables")
    }

    return createServerClient(supabaseUrl, supabaseAnonKey, {
      cookies: {
        getAll() {
          return cookieStore.getAll()
        },
        setAll(cookiesToSet) {
          try {
            cookiesToSet.forEach(({ name, value, options }) => cookieStore.set(name, value, options))
          } catch (error) {
            // The `setAll` method was called from a Server Component.
            // This can be ignored if you have middleware refreshing
            // user sessions.
            console.warn("Cookie setting failed:", error)
          }
        },
      },
    })
  } catch (error) {
    console.error("Error creating Supabase client:", error)
    throw error
  }
}
