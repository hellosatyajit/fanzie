"use server"

import { createClient } from "@/utils/supabase/server"

export async function submitEmail(email: string) {
  try {
    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(email)) {
      return {
        success: false,
        error: "Invalid email format",
      }
    }

    // Create Supabase client (now properly awaited)
    const supabase = await createClient()

    // Check if email already exists
    const { data: existingEmail, error: selectError } = await supabase
      .from("waitlist")
      .select("email")
      .eq("email", email)
      .maybeSingle() // Use maybeSingle instead of single to avoid errors when no rows found

    if (selectError) {
      console.error("Error checking existing email:", selectError)
      return {
        success: false,
        error: `Database error: ${selectError.message}`,
      }
    }

    if (existingEmail) {
      // Email already exists
      return {
        success: true,
        isNew: false,
        message: "Email already on waitlist",
      }
    }

    // Insert new email
    const { data, error: insertError } = await supabase
      .from("waitlist")
      .insert([
        {
          email,
          joined_at: new Date().toISOString(),
        },
      ])
      .select()

    if (insertError) {
      console.error("Error inserting email:", insertError)
      return {
        success: false,
        error: `Insert failed: ${insertError.message}`,
      }
    }

    return {
      success: true,
      isNew: true,
      message: "Email added to waitlist",
    }
  } catch (error) {
    console.error("Unexpected error in submitEmail:", error)
    // Log the full error for debugging
    console.error("Full error details:", JSON.stringify(error, null, 2))
    return {
      success: false,
      error: `Unexpected error: ${error instanceof Error ? error.message : "Unknown error"}`,
    }
  }
}

export async function getWaitlistCount() {
  try {
    const supabase = await createClient()

    const { count, error } = await supabase.from("waitlist").select("*", { count: "exact", head: true })

    if (error) {
      console.error("Error getting waitlist count:", error)
      return { count: 57, error: error.message } // Fallback to 57
    }

    return { count: Math.max(count || 0, 57), error: null } // Ensure minimum of 57
  } catch (error) {
    console.error("Unexpected error getting count:", error)
    return { count: 57, error: "Failed to get count" } // Fallback to 57
  }
}
