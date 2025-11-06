'use client'
import Link from 'next/link'
import { Button } from '@/components/ui/Button'
import { useEffect, useState } from 'react'

interface BeforeInstallPromptEvent extends Event {
  readonly platforms: string[]
  readonly userChoice: Promise<{ outcome: "accepted" | "dismissed"; platform: string }>
  prompt(): Promise<void>
}

export default function Hero() {
  const [isMounted, setIsMounted] = useState(false)
  // PWA Installation States
  const [deferredPrompt, setDeferredPrompt] = useState<BeforeInstallPromptEvent | null>(null)
  const [isIOS, setIsIOS] = useState(false)
  const [isStandalone, setIsStandalone] = useState(false)
  const [showInstallButton, setShowInstallButton] = useState(false)
  const [isSupportedBrowser, setIsSupportedBrowser] = useState(true)

  useEffect(() => {
    setIsMounted(true)
    
    // Check if we're in a browser environment
    if (typeof window !== 'undefined') {
      // PWA Installation Detection
      const isIos = /iPad|iPhone|iPod/.test(navigator.userAgent);
      const isStandalone = window.matchMedia('(display-mode: standalone)').matches;
      
      setIsIOS(isIos);
      setIsStandalone(isStandalone);

      // Check for PWA support
      const isPwaSupported = 'BeforeInstallPromptEvent' in window || isIos;
      setIsSupportedBrowser(isPwaSupported);

      const handler = (e: Event) => {
        const promptEvent = e as BeforeInstallPromptEvent
        e.preventDefault?.()
        setDeferredPrompt(promptEvent)
        setShowInstallButton(true)
      }

      // Only add event listener if PWA is supported
      if ('BeforeInstallPromptEvent' in window) {
        window.addEventListener("beforeinstallprompt", handler)
      }
      
      return () => {
        if ('BeforeInstallPromptEvent' in window) {
          window.removeEventListener("beforeinstallprompt", handler)
        }
      }
    }
  }, [])

  const handleInstall = async () => {
    if (!deferredPrompt) return
    try {
      await deferredPrompt.prompt()
      const { outcome } = await deferredPrompt.userChoice
      if (outcome === "accepted") {
        console.log("Business PWA installed")
        setShowInstallButton(false)
      }
    } catch (error) {
      console.error("Business installation failed:", error)
    }
  }

  const handleIOSInstall = () => {
    alert('To install GRSWorker Business:\n\n1. Tap the Share button (⎋)\n2. Scroll down and tap "Add to Home Screen"\n3. Tap "Add" in the top right')
  }

  // For unsupported browsers, provide a proper download link
  const handleUnsupportedBrowser = () => {
    // Instead of showing an alert, provide actual download options
    const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
    
    if (isMobile) {
      alert('For the best experience, please use Chrome, Edge, or Safari and follow the installation prompts.');
    } else {
      // For desktop unsupported browsers, you can redirect to app stores or show alternatives
      alert('PWA installation is not supported in your browser. Please use Chrome, Edge, or Safari for the best experience.');
    }
  }

  // Prevent default behavior for download buttons
  const handleDownloadClick = (e: React.MouseEvent) => {
    e.preventDefault();
    
    if (isStandalone) {
      return; // Do nothing if already installed
    } else if (showInstallButton && deferredPrompt) {
      handleInstall();
    } else if (isIOS) {
      handleIOSInstall();
    } else {
      handleUnsupportedBrowser();
    }
  }

  // Dynamic Download Button - FIXED VERSION
  const downloadButton = isStandalone ? (
    <Button 
      variant="outline"
      size="lg"
      className="bg-green-600 text-white hover:bg-green-700 font-semibold text-base md:text-lg px-6 md:px-8 py-3 md:py-4 rounded-lg transition-colors duration-200 border-green-600 cursor-default"
      disabled
    >
      Business App Installed
    </Button>
  ) : showInstallButton ? (
    <Button 
      onClick={handleDownloadClick}
      variant="outline"
      size="lg"
      className="bg-white text-blue-600 hover:bg-gray-100 font-semibold text-base md:text-lg px-6 md:px-8 py-3 md:py-4 rounded-lg transition-colors duration-200 border-white"
    >
      Install Business App
    </Button>
  ) : isIOS ? (
    <Button 
      onClick={handleDownloadClick}
      variant="outline"
      size="lg"
      className="bg-white text-blue-600 hover:bg-gray-100 font-semibold text-base md:text-lg px-6 md:px-8 py-3 md:py-4 rounded-lg transition-colors duration-200 border-white"
    >
      Add Business App
    </Button>
  ) : (
    <Button 
      onClick={handleDownloadClick}
      variant="outline"
      size="lg"
      className="bg-white text-blue-600 hover:bg-gray-100 font-semibold text-base md:text-lg px-6 md:px-8 py-3 md:py-4 rounded-lg transition-colors duration-200 border-white"
    >
      Download Business App
    </Button>
  );

  // Don't render until mounted to avoid hydration issues
  if (!isMounted) {
    return (
      <section className="bg-gradient-to-r from-blue-600 to-blue-800 dark:from-blue-900 dark:to-blue-950 text-white py-16 md:py-20">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-4xl mx-auto text-center">
            {/* Loading skeleton */}
            <div className="animate-pulse">
              <div className="h-12 bg-blue-500/30 rounded-lg mb-4 mx-auto max-w-md"></div>
              <div className="h-6 bg-blue-500/30 rounded mb-6 mx-auto max-w-2xl"></div>
              <div className="flex justify-center gap-4">
                <div className="h-12 bg-blue-500/30 rounded-lg w-32"></div>
                <div className="h-12 bg-blue-500/30 rounded-lg w-32"></div>
              </div>
            </div>
          </div>
        </div>
      </section>
    )
  }

  return (
    <section className="bg-gradient-to-r from-blue-600 to-blue-800 dark:from-blue-900 dark:to-blue-950 text-white py-16 md:py-20">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold mb-4 md:mb-6 leading-tight">
            Trusted Professionals
            <span className="block text-orange-400 dark:text-orange-300">At Your Doorstep</span>
          </h1>
          <p className="text-base sm:text-lg md:text-xl lg:text-2xl mb-6 md:mb-8 text-blue-100 dark:text-blue-200">
            Book reliable home services, delivered by verified professionals
          </p>
          <div className="flex flex-col sm:flex-row gap-3 md:gap-4 justify-center">
            <Button 
              size="lg"
              className="bg-orange-500 hover:bg-orange-600 text-white font-semibold text-base md:text-lg px-6 md:px-8 py-3 md:py-4 rounded-lg transition-colors duration-200"
            >
              <Link href="/services">
                Book a Service
              </Link>
            </Button>
            {downloadButton}
          </div>

          {/* iOS Instructions */}
          {isIOS && !isStandalone && (
            <div className="mt-4 text-sm text-blue-200 bg-blue-700/30 rounded-lg p-3 max-w-md mx-auto">
              <p className="font-medium">📱 Add Business App to Home Screen</p>
              <p className="text-xs mt-1">
                Tap Share <span className="font-bold">⎋</span> → "Add to Home Screen"
              </p>
            </div>
          )}
        </div>
      </div>
    </section>
  )
}