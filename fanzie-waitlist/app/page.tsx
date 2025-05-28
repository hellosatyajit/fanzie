"use client"

import React from "react"
import { useState, useEffect, useRef } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { motion, AnimatePresence } from "framer-motion"
import {
  CheckCircle,
  DollarSign,
  MessageSquare,
  LayoutDashboard,
  Users,
  Gavel,
  Eye,
  Zap,
  Lock,
  Heart,
  Calendar,
  UserPlus,
  AlertCircle,
  Crown,
} from "lucide-react"
import { Alert, AlertDescription } from "@/components/ui/alert"
import type { SVGProps } from "react"
import { submitEmail, getWaitlistCount } from "@/actions/waitlist"

export default function WaitlistPage() {
  const [email, setEmail] = useState("")
  const [showSuccess, setShowSuccess] = useState(false)
  const [showError, setShowError] = useState(false)
  const [errorMessage, setErrorMessage] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [activeFeatureIndex, setActiveFeatureIndex] = useState(0)
  const [count, setCount] = useState(0) 
  const [targetCount, setTargetCount] = useState(57)
  const [isPaused, setIsPaused] = useState(false)
  const intervalRef = useRef<NodeJS.Timeout | null>(null)

  // Founder as Service - Premium feature
  const founderService = {
    icon: Crown,
    title: "Founders as Service",
    description: "Any query or problem, even small? Just a call away from you."}
   useEffect(() => {
    async function fetchCount() {
      try {
        const res = await fetch('/api/waitlist-count')
        console.log('Fetching waitlist count from API:', res)
        const data = await res.json()
        if (res.ok) {
          setTargetCount(data.count+57)
        } else {
          console.error('Error:', data.error)
        }
      } catch (err) {
        console.error('Fetch failed:', err)
      }
    }

    fetchCount()
  }, [])
  // Regular features (without Founder as Service)
  const features = [
    {
      icon: DollarSign,
      title: "Fair Revenue",
      description: "Keep a bigger share of your earnings, because you deserve it.",
    },
    {
      icon: MessageSquare,
      title: "AI-Managed Messaging",
      description: "Send unlimited voice and text. Stay connected with fans through AI.",
    },
    {
      icon: LayoutDashboard,
      title: "Easy Model Management",
      description: "Manage multiple models from a single dashboard.",
    },
    {
      icon: Users,
      title: "Collaboration Made Easy",
      description: "Partner up with other creators with our seamless collaboration feature.",
    },
    {
      icon: Gavel,
      title: "Bidding",
      description: "Let your fans bid for exclusive content, making them a part of your creative process.",
    },
    {
      icon: Eye,
      title: "Pay Per View",
      description: "Offer your content on a per-view basis, giving you full control over access and monetization.",
    },
    {
      icon: Zap,
      title: "Instant Visibility",
      description: "Stand out from day one with exclusive features.",
    },
    {
      icon: Lock,
      title: "Full Control",
      description: "You own your content and how it's shared.",
    },
    {
      icon: Heart,
      title: "The Right Community",
      description: "A space built just for AI creators.",
    },
  ]

  // Load initial count from database
  useEffect(() => {
    const loadCount = async () => {
      const result = await getWaitlistCount()
      setTargetCount(result.count)
    }
    loadCount()
  }, [])

  // Animate counter to target count
  useEffect(() => {
    if (count < targetCount) {
      const timer = setTimeout(() => {
        setCount((prevCount) => prevCount + 1)
      }, 50) // Faster animation for larger numbers
      return () => clearTimeout(timer)
    }
  }, [count, targetCount])

  // Auto-rotate features
  useEffect(() => {
    if (!isPaused) {
      intervalRef.current = setInterval(() => {
        setActiveFeatureIndex((prev) => (prev === features.length - 1 ? 0 : prev + 1))
      }, 5000) // Change every 5 seconds
    }

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current)
      }
    }
  }, [isPaused, features.length])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (email && !isSubmitting) {
      setIsSubmitting(true)
      setShowError(false)
      setErrorMessage("")

      try {
        // Submit email to Supabase via server action
        const result = await submitEmail(email)

        if (result.success) {
          setShowSuccess(true)
          setEmail("")

          // If it's a new signup, update the count
          if (result.isNew) {
            // Get updated count from database
            const countResult = await getWaitlistCount()
            setTargetCount(countResult.count)
          }

          // Hide success message after 5 seconds
          setTimeout(() => {
            setShowSuccess(false)
          }, 5000)
        } else {
          // Handle error
          console.error("Error submitting email:", result.error)
          setErrorMessage(result.error || "Failed to join waitlist")
          setShowError(true)

          // Hide error message after 5 seconds
          setTimeout(() => {
            setShowError(false)
          }, 5000)
        }
      } catch (error) {
        console.error("Error submitting email:", error)
        setErrorMessage("An unexpected error occurred. Please try again.")
        setShowError(true)

        // Hide error message after 5 seconds
        setTimeout(() => {
          setShowError(false)
        }, 5000)
      } finally {
        setIsSubmitting(false)
      }
    }
  }

  const openCalendar = () => {
    window.open("https://cal.com/fanzie/15min", "_blank")
  }

  const nextFeature = () => {
    setActiveFeatureIndex((prev) => (prev === features.length - 1 ? 0 : prev + 1))
  }

  const prevFeature = () => {
    setActiveFeatureIndex((prev) => (prev === 0 ? features.length - 1 : prev - 1))
  }

  return (
    <div className="relative flex min-h-screen flex-col items-center justify-center overflow-hidden bg-gradient-to-br from-gray-900 via-black to-gray-900 text-white">
      {/* Decorative elements */}
      <div className="absolute left-0 top-0 h-96 w-96 rounded-full bg-rose-500/10 blur-3xl"></div>
      <div className="absolute bottom-0 right-0 h-96 w-96 rounded-full bg-rose-500/20 blur-3xl"></div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="container relative mx-auto flex max-w-7xl flex-col items-center px-4 py-16 text-center"
      >
        <motion.div
          initial={{ scale: 0.9 }}
          animate={{ scale: 1 }}
          transition={{
            duration: 0.5,
            type: "spring",
            stiffness: 100,
          }}
        >
          <h1 className="mb-2 text-5xl font-extrabold tracking-tight sm:text-6xl">
            <span className="bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent">fan</span>
            <span className="bg-gradient-to-r from-rose-400 to-rose-600 bg-clip-text text-transparent">zie</span>
          </h1>
          <div className="mb-8 h-1 w-24 bg-gradient-to-r from-rose-400 to-rose-600 mx-auto rounded-full"></div>
        </motion.div>

        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3, duration: 0.8 }}
          className="mb-8 text-xl font-light text-gray-300"
        >
          Lovely Home for AI creators
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5, duration: 0.8 }}
          className="mb-2 w-full max-w-md mx-auto space-y-4"
        >
          <AnimatePresence>
            {showSuccess && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                transition={{ duration: 0.3 }}
              >
                <Alert className="border-rose-500/20 bg-rose-500/10 text-rose-200">
                  <CheckCircle className="h-4 w-4 text-rose-400" />
                  <AlertDescription>
                    Thank you for joining our waitlist! We'll notify you when we launch.
                  </AlertDescription>
                </Alert>
              </motion.div>
            )}
            {showError && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                transition={{ duration: 0.3 }}
              >
                <Alert className="border-red-500/20 bg-red-500/10 text-red-200">
                  <AlertCircle className="h-4 w-4 text-red-400" />
                  <AlertDescription>{errorMessage}</AlertDescription>
                </Alert>
              </motion.div>
            )}
          </AnimatePresence>

          <form onSubmit={handleSubmit} className="relative w-full">
            <Input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter your email"
              className="pr-32 border-gray-800 bg-gray-900/60 backdrop-blur-sm text-white placeholder:text-gray-500 focus-visible:ring-rose-500 h-12"
              required
              disabled={isSubmitting}
            />
            <Button
              type="submit"
              className="absolute right-1 top-1 bg-gradient-to-r from-rose-500 to-rose-600 text-white hover:from-rose-600 hover:to-rose-700 shadow-lg shadow-rose-500/20 h-10"
              disabled={isSubmitting}
            >
              {isSubmitting ? "Joining..." : "Join Waitlist"}
            </Button>
          </form>
          <p className="text-xs text-gray-400">We respect your privacy. No spam, ever.</p>
        </motion.div>

        {/* Beautiful onboarding counter - now connected to database */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.55, duration: 0.5 }}
          className="my-4"
        >
          <div className="inline-flex items-center gap-2 bg-gradient-to-r from-rose-500/10 to-rose-600/10 backdrop-blur-sm px-4 py-2 rounded-full border border-rose-500/20">
            <div className="relative h-6 w-6 flex items-center justify-center">
              <motion.div
                className="absolute inset-0 bg-rose-500/20 rounded-full"
                animate={{
                  scale: [1, 1.2, 1],
                }}
                transition={{
                  duration: 2,
                  repeat: Number.POSITIVE_INFINITY,
                  repeatType: "loop",
                }}
              />
              <UserPlus className="h-3 w-3 text-rose-400 relative z-10" />
            </div>
            <motion.span
              className="text-sm font-medium bg-gradient-to-r from-white to-rose-300 bg-clip-text text-transparent"
              animate={{ opacity: [0.7, 1, 0.7] }}
              transition={{ duration: 3, repeat: Number.POSITIVE_INFINITY }}
            >
              {count} creators onboard
            </motion.span>
          </div>
        </motion.div>

        {/* Creator Benefits Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.7, duration: 0.8 }}
          className="w-full mb-12"
        >
          <h2 className="text-3xl font-bold mb-12 bg-gradient-to-r from-white to-rose-300 bg-clip-text text-transparent text-center">
            Creator Benefits
          </h2>

          {/* Regular Features Grid - Below Founder as Service */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
            {features.map((feature, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 50, rotate: Math.random() * 10 - 5 }}
                animate={{ opacity: 1, y: 0, rotate: 0 }}
                transition={{
                  delay:  0.1,
                  duration: 0.2,
                  type: "spring",
                  stiffness: 100,
                }}
                whileHover={{
                  scale: 1.05,
                  rotate: Math.random() * 6 - 3,
                  y: -10,
                  transition: { duration: 0.2 },
                }}
                className={`
                  relative group cursor-pointer
                  ${index % 3 === 0 ? "lg:translate-y-4" : ""}
                  ${index % 3 === 1 ? "lg:-translate-y-2" : ""}
                  ${index % 3 === 2 ? "lg:translate-y-6" : ""}
                `}
              >
                <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-gray-800/40 to-gray-900/60 backdrop-blur-sm border border-gray-700/50 p-6 h-full">
                  {/* Animated background gradient */}
                  <div className="absolute inset-0 bg-gradient-to-br from-rose-500/5 to-purple-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

                  {/* Floating particles effect */}
                  <div className="absolute inset-0 overflow-hidden">
                    {[...Array(3)].map((_, i) => (
                      <motion.div
                        key={i}
                        className="absolute w-1 h-1 bg-rose-400/30 rounded-full"
                        animate={{
                          x: [0, 100, 0],
                          y: [0, -50, 0],
                          opacity: [0, 1, 0],
                        }}
                        transition={{
                          duration: 3 + i,
                          repeat: Number.POSITIVE_INFINITY,
                          delay: i * 0.2,
                        }}
                        style={{
                          left: `${20 + i * 30}%`,
                          top: `${60 + i * 10}%`,
                        }}
                      />
                    ))}
                  </div>

                  {/* Icon with crazy hover effect */}
                  <motion.div
                    className="relative mb-4 flex justify-center"
                    whileHover={{
                      rotate: 360,
                      scale: 1.2,
                    }}
                    transition={{ duration: 0.6, type: "spring" }}
                  >
                    <div className="relative">
                      <motion.div
                        className="absolute inset-0 bg-rose-500/20 rounded-full blur-xl"
                        animate={{
                          scale: [1, 1.2, 1],
                          opacity: [0.3, 0.6, 0.3],
                        }}
                        transition={{
                          duration: 2,
                          repeat: Number.POSITIVE_INFINITY,
                          delay: index * 0.2,
                        }}
                      />
                      <div className="relative h-16 w-16 rounded-full bg-gradient-to-br from-rose-500/20 to-purple-500/20 flex items-center justify-center border border-rose-500/30">
                        {React.createElement(feature.icon, {
                          className: "h-8 w-8 text-rose-400 group-hover:text-rose-300 transition-colors duration-300",
                        })}
                      </div>
                    </div>
                  </motion.div>

                  {/* Title with gradient effect */}
                  <motion.h3
                    className="text-xl font-bold mb-3 text-center bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent group-hover:from-rose-200 group-hover:to-white transition-all duration-300"
                    whileHover={{ scale: 1.05 }}
                  >
                    {feature.title}
                  </motion.h3>

                  {/* Description */}
                  <p className="text-sm text-gray-400 text-center leading-relaxed group-hover:text-gray-300 transition-colors duration-300">
                    {feature.description}
                  </p>

                  {/* Animated border */}
                  <div
                    className="absolute inset-0 rounded-2xl border-2 border-transparent bg-gradient-to-r from-rose-500/0 via-rose-500/50 to-rose-500/0 opacity-0 group-hover:opacity-100 transition-opacity duration-500"
                    style={{
                      background: "linear-gradient(90deg, transparent, rgba(244, 63, 94, 0.3), transparent)",
                      mask: "linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)",
                      maskComposite: "xor",
                      WebkitMask: "linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)",
                      WebkitMaskComposite: "xor",
                      padding: "2px",
                    }}
                  />
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>
        
        {/* Premium Founder as Service Card - Top Center */}
          <motion.div
            initial={{ opacity: 0, y: 30, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{
              delay: 0.8,
              duration: 0.8,
              type: "spring",
              stiffness: 100,
            }}
            className="flex justify-center mb-8"
          >
            <motion.div
              whileHover={{
                scale: 1.05,
                y: -5,
                transition: { duration: 0.3 },
              }}
              className="relative group cursor-pointer max-w-md w-full"
            >
              <div className="relative overflow-clip rounded-3xl bg-gradient-to-br from-gray-800/60 to-gray-900/80 backdrop-blur-sm border-2 border-rose-500/30 p-8 shadow-2xl shadow-rose-500/10">
                {/* Premium glow effect */}
                <div className="absolute inset-0 bg-gradient-to-br from-rose-500/10 to-purple-500/10 opacity-100 group-hover:opacity-100 transition-opacity duration-500" />

                {/* Enhanced floating particles */}
                <div className="absolute inset-0 overflow-hidden">
                  {[...Array(5)].map((_, i) => (
                    <motion.div
                      key={i}
                      className="absolute w-2 h-2 bg-rose-400/40 rounded-full"
                      animate={{
                        x: [0, 150, 0],
                        y: [0, -80, 0],
                        opacity: [0, 1, 0],
                        scale: [0.5, 1, 0.5],
                      }}
                      transition={{
                        duration: 4 + i,
                        repeat: Number.POSITIVE_INFINITY,
                        delay: i * 0.8,
                      }}
                      style={{
                        left: `${10 + i * 20}%`,
                        top: `${70 + i * 5}%`,
                      }}
                    />
                  ))}
                </div>

                {/* Premium icon */}
                <motion.div
                  className="relative mb-6 flex justify-center"
                  whileHover={{
                    rotate: 360,
                    scale: 1.3,
                  }}
                  transition={{ duration: 0.8, type: "spring" }}
                >
                  <div className="relative">
                    <motion.div
                      className="absolute inset-0 bg-rose-500/30 rounded-full blur-2xl"
                      animate={{
                        scale: [1, 1.4, 1],
                        opacity: [0.4, 0.8, 0.4],
                      }}
                      transition={{
                        duration: 3,
                        repeat: Number.POSITIVE_INFINITY,
                      }}
                    />
                    <div className="relative h-20 w-20 rounded-full bg-gradient-to-br from-rose-500/30 to-purple-500/30 flex items-center justify-center border-2 border-rose-500/50 shadow-lg">
                      <Crown className="h-10 w-10 text-rose-400 group-hover:text-rose-300 transition-colors duration-300" />
                    </div>
                  </div>
                </motion.div>

                {/* Premium title */}
                <motion.h3
                  className="text-2xl font-bold mb-4 text-center bg-gradient-to-r from-white to-rose-200 bg-clip-text text-transparent group-hover:from-rose-100 group-hover:to-white transition-all duration-300"
                  whileHover={{ scale: 1.05 }}
                >
                  {founderService.title}
                </motion.h3>

                {/* Premium description */}
                <p className="text-base text-gray-300 text-center leading-relaxed group-hover:text-gray-200 transition-colors duration-300">
                  {founderService.description}
                </p>

                {/* Enhanced animated border */}
                <motion.div
                  className="absolute inset-0 rounded-3xl"
                  style={{
                    background: "linear-gradient(90deg, transparent, rgba(244, 63, 94, 0.5), transparent)",
                    mask: "linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)",
                    maskComposite: "xor",
                    WebkitMask: "linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)",
                    WebkitMaskComposite: "xor", 
                  }}
                  animate={{
                    background: [
                      "linear-gradient(90deg, transparent, rgba(244, 63, 94, 0.5), transparent)",
                      "linear-gradient(180deg, transparent, rgba(244, 63, 94, 0.5), transparent)",
                      "linear-gradient(270deg, transparent, rgba(244, 63, 94, 0.5), transparent)",
                      "linear-gradient(360deg, transparent, rgba(244, 63, 94, 0.5), transparent)",
                    ],
                  }}
                  transition={{
                    duration: 4,
                    repeat: Number.POSITIVE_INFINITY,
                  }}
                />
              </div>
            </motion.div>
          </motion.div>

        {/* Let's have a meet link - moved below creator benefits */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.5, duration: 0.5 }}
          className="mb-12"
        >
          <Button
            variant="link"
            onClick={openCalendar}
            className="text-rose-400 hover:text-rose-300 flex items-center gap-2 text-lg"
          >
            <Calendar className="h-5 w-5" />
            Let's have a meet
          </Button>
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.0, duration: 0.8 }}
          className="mt-auto"
        >
          <p className="text-sm font-medium uppercase tracking-widest bg-gradient-to-r from-rose-400 to-rose-600 bg-clip-text text-transparent mb-6">
            Launching soon to empower AI creators
          </p>

          {/* Social Media Links */}
          <div className="flex items-center justify-center gap-6 mt-4">
            <a
              href="https://www.instagram.com/fanzie.loves"
              target="_blank"
              rel="noopener noreferrer"
              className="text-gray-400 hover:text-rose-400 transition-colors"
            >
              <Instagram className="h-5 w-5" />
              <span className="sr-only">Instagram</span>
            </a>
            <a
              href="https://x.com/Fanziehq"
              target="_blank"
              rel="noopener noreferrer"
              className="text-gray-400 hover:text-rose-400 transition-colors"
            >
              <XLogoNew className="h-5 w-5" />
              <span className="sr-only">X</span>
            </a>
            <a
              href="https://www.tiktok.com/@fanziehq"
              target="_blank"
              rel="noopener noreferrer"
              className="text-gray-400 hover:text-rose-400 transition-colors"
            >
              <TikTok className="h-5 w-5" />
              <span className="sr-only">TikTok</span>
            </a>
          </div>
        </motion.div>
      </motion.div>
    </div>
  )
}

// Instagram icon
function Instagram(props: SVGProps<SVGSVGElement>) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      {...props}
    >
      <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
      <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
      <line x1="17.5" y1="6.5" x2="17.51" y2="6.5" />
    </svg>
  )
}

// More realistic X logo (formerly Twitter)
function XLogoNew(props: SVGProps<SVGSVGElement>) {
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" {...props}>
      <path
        d="M18.901 1.153h3.68l-8.04 9.19L24 22.846h-7.406l-5.8-7.584-6.638 7.584H.474l8.6-9.83L0 1.154h7.594l5.243 6.932L18.901 1.153ZM17.61 20.644h2.039L6.486 3.24H4.298L17.61 20.644Z"
        fill="currentColor"
      />
    </svg>
  )
}

// TikTok icon
function TikTok(props: SVGProps<SVGSVGElement>) {
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" {...props}>
      <path
        d="M16.6 5.82C15.9165 5.03962 15.5397 4.03743 15.54 3H12.45V16.5C12.4262 17.0179 12.2369 17.5163 11.9059 17.9146C11.5749 18.3129 11.1229 18.5914 10.62 18.7C10.3676 18.7584 10.1049 18.7661 9.84961 18.7228C9.59432 18.6796 9.35118 18.5861 9.13476 18.4477C8.91833 18.3093 8.73317 18.1286 8.59033 17.9155C8.44748 17.7025 8.35 17.4616 8.3046 17.21C8.25921 16.9584 8.26686 16.6995 8.32705 16.4517C8.38724 16.2038 8.49858 15.9726 8.65458 15.7718C8.81058 15.571 9.00798 15.4051 9.23458 15.2851C9.46118 15.1652 9.71168 15.0937 9.96998 15.075C10.2283 15.0563 10.4879 15.0908 10.73 15.176C11.0377 15.2793 11.3148 15.4513 11.54 15.676V12.571C11.2057 12.4995 10.8638 12.4695 10.5222 12.4815C10.1806 12.4935 9.84279 12.5475 9.51998 12.642C8.91128 12.8293 8.34941 13.1371 7.86998 13.547C7.39055 13.9568 7.00581 14.4599 6.73998 15.026C6.47414 15.5921 6.33357 16.2075 6.32998 16.832C6.32639 17.4566 6.45985 18.0736 6.71998 18.643C6.91946 19.0874 7.19483 19.4937 7.53498 19.843C7.87513 20.1922 8.27397 20.4783 8.71498 20.689C9.15599 20.8997 9.63257 21.0323 10.12 21.08C10.6074 21.1277 11.0992 21.1009 11.58 21C12.5088 20.7929 13.3531 20.3061 13.9932 19.6059C14.6333 18.9057 15.0382 18.0262 15.15 17.089C15.1585 17.0087 15.1585 16.9279 15.15 16.847V9.112C16.2338 9.91779 17.5238 10.3926 18.86 10.476V7.386C18.3056 7.38099 17.7581 7.26999 17.2502 7.05194C16.7423 6.83389 16.2851 6.51425 15.91 6.112L16.6 5.82Z"
        fill="currentColor"
      />
    </svg>
  )
}
