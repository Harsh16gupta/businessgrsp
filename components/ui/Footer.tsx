import Link from 'next/link'
import { 
  IconBriefcase, 
  IconUserPlus, 
  IconBook, 
  IconHelp, 
  IconFileDescription, 
  IconUsers, 
  IconBuilding, 
  IconBrandTwitter, 
  IconBrandLinkedin, 
  IconBrandInstagram, 
  IconBrandFacebook 
} from '@tabler/icons-react'

export default function Footer() {
  const currentYear = new Date().getFullYear()

  return (
    <footer className="bg-background border-t border-border">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-12">
          {/* Company Info - Takes more space */}
          <div className="lg:col-span-3">
            <Link href="/" className="flex items-center space-x-2 mb-6">
              <div className="w-12 h-12 bg-gradient-to-br from-blue-600 to-blue-700 rounded-xl flex items-center justify-center">
                <span className="text-white font-bold text-xl">G</span>
              </div>
              <span className="text-2xl font-bold text-foreground">GRSP</span>
            </Link>
            <p className="text-muted-foreground mb-6 text-base leading-relaxed max-w-md">
              Your trusted partner for professional services. 
              Connecting you with verified professionals for all your service needs.
            </p>
            <div className="flex space-x-3 sm:space-x-4">
              <a 
                href="https://www.facebook.com/people/GRS/61565027341787/?rdid=pYvlIvCUNQhBK3QJ&share_url=https%3A%2F%2Fwww.facebook.com%2Fshare%2F1G7H7s1m3t%2F" 
                className="w-8 h-8 sm:w-10 sm:h-10 bg-muted hover:bg-blue-100 dark:hover:bg-blue-900/30 rounded-full flex items-center justify-center transition-all duration-200 hover:scale-105"
                aria-label="Facebook"
              >
                <IconBrandFacebook className="w-4 h-4 sm:w-5 sm:h-5 text-muted-foreground hover:text-blue-600" />
              </a>
              <a 
                href="" 
                className="w-8 h-8 sm:w-10 sm:h-10 bg-muted hover:bg-blue-100 dark:hover:bg-blue-900/30 rounded-full flex items-center justify-center transition-all duration-200 hover:scale-105"
                aria-label="Twitter"
              >
                <IconBrandTwitter className="w-4 h-4 sm:w-5 sm:h-5 text-muted-foreground hover:text-blue-400" />
              </a>
              <a 
                href="https://www.instagram.com/grs.vacancy/?utm_source=qr&igsh=aGNqaWVlZ25weXVu#" 
                className="w-8 h-8 sm:w-10 sm:h-10 bg-muted hover:bg-pink-100 dark:hover:bg-pink-900/30 rounded-full flex items-center justify-center transition-all duration-200 hover:scale-105"
                aria-label="Instagram"
              >
                <IconBrandInstagram className="w-4 h-4 sm:w-5 sm:h-5 text-muted-foreground hover:text-pink-600" />
              </a>
              <a 
                href="https://www.linkedin.com/company/yanaca/" 
                className="w-8 h-8 sm:w-10 sm:h-10 bg-muted hover:bg-blue-100 dark:hover:bg-blue-900/30 rounded-full flex items-center justify-center transition-all duration-200 hover:scale-105"
                aria-label="LinkedIn"
              >
                <IconBrandLinkedin className="w-4 h-4 sm:w-5 sm:h-5 text-muted-foreground hover:text-blue-700" />
              </a>
            </div>
          </div>

          {/* All Links Section - Equal spacing */}
          <div className="lg:col-span-2">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
              {/* For Workers */}
              <div>
                <h3 className="font-semibold text-lg text-foreground mb-4 flex items-center gap-2">
                  <IconBriefcase className="w-5 h-5" />
                  For Workers
                </h3>
                <ul className="space-y-3">
                  <li>
                    <Link href="/workers/find-work" className="text-base text-muted-foreground hover:text-foreground transition-colors duration-200 flex items-center gap-2">
                      <IconBriefcase className="w-4 h-4" />
                      Find Work
                    </Link>
                  </li>
                  <li>
                    <Link href="/workers/create-profile" className="text-base text-muted-foreground hover:text-foreground transition-colors duration-200 flex items-center gap-2">
                      <IconUserPlus className="w-4 h-4" />
                      Create Profile
                    </Link>
                  </li>
                  <li>
                    <Link href="/workers/resources" className="text-base text-muted-foreground hover:text-foreground transition-colors duration-200 flex items-center gap-2">
                      <IconBook className="w-4 h-4" />
                      Resources
                    </Link>
                  </li>
                  <li>
                    <Link href="/workers/faq" className="text-base text-muted-foreground hover:text-foreground transition-colors duration-200 flex items-center gap-2">
                      <IconHelp className="w-4 h-4" />
                      Worker FAQ
                    </Link>
                  </li>
                </ul>
              </div>

              {/* For Businesses */}
              <div>
                <h3 className="font-semibold text-lg text-foreground mb-4 flex items-center gap-2">
                  <IconBuilding className="w-5 h-5" />
                  For Businesses
                </h3>
                <ul className="space-y-3">
                  <li>
                    <Link href="/business/post-job" className="text-base text-muted-foreground hover:text-foreground transition-colors duration-200 flex items-center gap-2">
                      <IconFileDescription className="w-4 h-4" />
                      Post a Job
                    </Link>
                  </li>
                  <li>
                    <Link href="/business/find-workers" className="text-base text-muted-foreground hover:text-foreground transition-colors duration-200 flex items-center gap-2">
                      <IconUsers className="w-4 h-4" />
                      Find Workers
                    </Link>
                  </li>
                  <li>
                    <Link href="/business/resources" className="text-base text-muted-foreground hover:text-foreground transition-colors duration-200 flex items-center gap-2">
                      <IconBook className="w-4 h-4" />
                      Resources
                    </Link>
                  </li>
                  <li>
                    <Link href="/business/faq" className="text-base text-muted-foreground hover:text-foreground transition-colors duration-200 flex items-center gap-2">
                      <IconHelp className="w-4 h-4" />
                      Business FAQ
                    </Link>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Section */}
        <div className="border-t border-border mt-8 pt-8 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-muted-foreground text-base">
            &copy; {currentYear} GRSP. All rights reserved.
          </p>
          <div className="flex gap-6 text-base text-muted-foreground">
            <Link href="/privacy" className="hover:text-foreground transition-colors duration-200">
              Privacy Policy
            </Link>
            <Link href="/terms" className="hover:text-foreground transition-colors duration-200">
              Terms of Service
            </Link>
            <Link href="/cookies" className="hover:text-foreground transition-colors duration-200">
              Cookie Policy
            </Link>
          </div>
        </div>
      </div>
    </footer>
  )
}