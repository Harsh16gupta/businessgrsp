'use client'

import { motion } from 'framer-motion'

export default function Footer() {
  const currentYear = new Date().getFullYear()

  const footerSections = [
    {
      title: "For Workers",
      links: [
        { name: "Find Work", href: "#" },
        { name: "Create Profile", href: "#" },
        { name: "Worker Resources", href: "#" },
      ]
    },
    {
      title: "For Businesses",
      links: [
        { name: "Post a Job", href: "#" },
        { name: "Find Workers", href: "#" },
        { name: "Enterprise Solutions", href: "#" },
      ]
    },
    {
      title: "Company",
      links: [
        { name: "About Us", href: "#" },
        { name: "Testimonials", href: "#" },
        { name: "Contact Us", href: "#" },
      ]
    }
  ]

  return (
    <footer className="relative bg-gradient-to-br from-blue-600 via-slate-600 to-blue-800 overflow-hidden">
      {/* Animated gradient background */}
      <motion.div 
        className="absolute inset-0"
        animate={{
          background: [
            'linear-gradient(135deg, #2563eb 0%, #475569 50%, #1e40af 100%)',
            'linear-gradient(135deg, #1e40af 0%, #475569 50%, #2563eb 100%)',
            'linear-gradient(135deg, #2563eb 0%, #475569 50%, #1e40af 100%)',
          ],
        }}
        transition={{ duration: 8, repeat: Infinity }}
      />
      
      {/* Blurred light effects */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-20 -right-20 w-60 h-60 bg-blue-400/20 rounded-full blur-3xl" />
        <div className="absolute -bottom-20 -left-20 w-60 h-60 bg-slate-400/20 rounded-full blur-3xl" />
      </div>

      <div className="relative z-10 container mx-auto px-6 py-12">
        <div className="grid md:grid-cols-4 gap-8">
          {/* Company Info */}
          <div className="md:col-span-1">
            <motion.div 
              className="flex items-center space-x-2 mb-4"
              whileHover={{ scale: 1.05 }}
              transition={{ type: "spring", stiffness: 300 }}
            >
              <div className="w-8 h-8 bg-white/20 backdrop-blur-sm rounded-lg flex items-center justify-center border border-white/30">
                <span className="text-white font-bold text-sm">G</span>
              </div>
              <span className="text-xl font-bold text-white">GRSP</span>
            </motion.div>
            <motion.p 
              className="text-blue-100"
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
            >
              Connecting talent with opportunity through our flexible work platform.
            </motion.p>
          </div>

          {/* Quick Links */}
          <div className="grid grid-cols-2 md:grid-cols-3 gap-8 md:col-span-3">
            {footerSections.map((section, sectionIndex) => (
              <motion.div
                key={section.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: sectionIndex * 0.1 }}
                viewport={{ once: true }}
              >
                <h4 className="font-semibold text-white mb-4 text-lg">
                  {section.title}
                </h4>
                <ul className="space-y-2">
                  {section.links.map((link, linkIndex) => (
                    <motion.li key={link.name}>
                      <motion.a
                        href={link.href}
                        className="text-blue-100 hover:text-white transition-colors duration-300 flex items-center"
                        whileHover={{ x: 5 }}
                        transition={{ delay: linkIndex * 0.05 }}
                      >
                        {link.name}
                      </motion.a>
                    </motion.li>
                  ))}
                </ul>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Bottom Bar */}
        <motion.div 
          className="border-t border-white/20 mt-8 pt-8 flex flex-col md:flex-row justify-between items-center"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
        >
          <motion.p 
            className="text-blue-200 text-sm mb-4 md:mb-0"
            whileHover={{ scale: 1.05 }}
          >
            © {currentYear} GRSP. All rights reserved.
          </motion.p>
          
          <div className="flex space-x-6">
            {['Terms of Service', 'Privacy Policy', 'Cookie Policy'].map((item, index) => (
              <motion.a
                key={item}
                href="#"
                className="text-blue-200 hover:text-white text-sm transition-colors duration-300"
                whileHover={{ scale: 1.05 }}
                transition={{ delay: index * 0.1 }}
              >
                {item}
              </motion.a>
            ))}
          </div>
        </motion.div>
      </div>
    </footer>
  )
}