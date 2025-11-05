'use client';

import { useState } from 'react';

export default function FAQPage() {
  const [openItems, setOpenItems] = useState<Set<number>>(new Set());

  const toggleItem = (index: number) => {
    const newOpenItems = new Set(openItems);
    if (newOpenItems.has(index)) {
      newOpenItems.delete(index);
    } else {
      newOpenItems.add(index);
    }
    setOpenItems(newOpenItems);
  };

  const faqs = [
    {
      question: "What is GRS Worker and how does it differ from a traditional staffing agency?",
      answer: "GRS Worker is a tech-enabled platform that connects your business (hotel, restaurant, construction site, petrol station, retail outlet, facility) with pre-vetted gig/temporary workers (bartenders, cooks, dishwashers, servers, cleaners, machine-operators, helpers, day-to-day organization staff). Unlike traditional staffing agencies that manage recruitment, on-boarding, payroll manually and often for longer-term hires, GRS Worker offers flexible shifts, real-time bookings, rapid deployment, and full compliance management. The model is essentially 'Workforce as a Service (WaaS)' and 'Gig Talent Marketplace' for businesses."
    },
    {
      question: "Which roles can I fill via GRS Worker?",
      answer: `You can source a wide variety of roles depending on your industry and operational needs:

• Hospitality: bartenders, cooks (line, prep, head), dishwashers, servers, banquet staff
• Construction & industrial: general helpers, machine operators, welders, site assistants
• Facilities & retail: cleaning/janitorial staff, petrol-pump attendants, general duty staff, day-to-day organization workers
• Seasonal, event & overflow staffing: for peak days, banquets, festivals, temporary expansions

This model mirrors the marketplace approach used by Instawork, which supports roles such as food-service, janitorial, warehousing, event staff.`
    },
    {
      question: "How fast can you deploy staff? What is the minimum booking duration?",
      answer: "You can often book workers through the platform in as little as 24-48 hours, depending on location, role and shift time. We support short-term shifts (single day, half day), multi-day assignments and recurring bookings. Minimum booking durations depend on the role (e.g., a 4-hour shift in hospitality, full-shift for industrial operator). Our platform is designed for speed and flexibility much like Instawork's instant shift filling."
    },
    {
      question: "What about screening, verification, compliance and payroll?",
      answer: `GRS Worker handles the full lifecycle:

• We conduct worker vetting: ID verification, experience checks, skills assessments, background screening (where applicable)
• We ensure statutory compliance (India: EPF/ESI, contract labour laws, basic insurance; other local laws as relevant)
• Businesses receive payroll, billing and worker documentation in one package — reducing your internal HR burden

For hospitality & hourly roles, we offer "Turnkey Gig Staffing" where you simply approve the shift and we supply the worker. This replicates what Meraqui does in its "WaaS" model for blue/grey-collar staff.`
    },
    {
      question: "How does pricing work and how does this reduce my hiring cost?",
      answer: "Pricing is transparent, shift-based or hour-based. You pay for the actual hours worked plus any pre-agreed service fee — no long-term commitments unless you choose them. Costs saved: recruiting overhead, full-time salaries + benefits, overtime unpredictability, idle time risk. Because you only pay when you need a worker, you gain cost-efficiency especially during demand peaks or for unplanned shifts. The marketplace model (used by Instawork) enables flexible staffing at scale, reducing administrative burden and cost per hire."
    },
    {
      question: "What about reliability and worker 'no-shows'?",
      answer: "Reliability is central. We maintain a network of workers with performance ratings, previous shift history and 'favourite worker' options so you can re-book people you like. If a worker fails to show for a shift, we provide immediate replacement (subject to our SLA) or credit the shift. We aim for industry-leading fill rates and low no-show rates. (For context: Instawork reports <2% no-show in its markets)."
    },
    {
      question: "Can we convert a temporary worker into a permanent hire?",
      answer: "Yes. You can use a 'temp-to-perm' pathway: evaluate a worker via shifts, and if you wish to hire permanently, we facilitate the conversion per our policy. This gives you a risk-free trial before committing long-term."
    },
    {
      question: "What geographic coverage do you offer?",
      answer: "We currently operate across [list your cities/states] (for example: Maharashtra, all major metros, Tier-2 cities). Like Meraqui, which spans 28 states and 30 industries in India. As we scale, we'll add more locations to ensure national reach for your business."
    },
    {
      question: "How do I get started?",
      answer: "Sign up for a business account on our platform, provide your company details and role requirements (role type, shift time, skills required, location). You'll get access to the dashboard to browse profiles, select shifts, approve workers and track billing. Alternatively, our account manager can assist you end-to-end. Once registration is complete, you can post shifts or request workers immediately."
    },
    {
      question: "What if the worker does not meet expectations?",
      answer: "If a worker isn't meeting the agreed standard (within the first shift or initial period defined in our SLA), simply notify us via the dashboard or your account manager. We'll replace the worker at no extra cost (subject to terms) or issue a credit. We value quality and repeat business, so your satisfaction is central."
    },
    {
      question: "Can you handle multiple locations or large volume events?",
      answer: "Yes. Whether you have a single restaurant needing three servers for a day or a hotel chain needing 100 staff across multiple sites, our platform supports multi-site scheduling, bulk shift booking, worker footprint tracking and centralised billing. The marketplace approach (as used by Instawork) enables this scale."
    },
    {
      question: "What data and reporting do you provide?",
      answer: "We provide dashboards showing shift fill rates, worker ratings, cost per shift, repeat worker metrics, no-show statistics, worker profile usage, and cost-savings analytics. This helps you measure ROI and optimise future staffing. Our tech-platform approach (similar to Meraqui's Workforce OS) makes this possible."
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-16">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            GRS Worker – Business Client FAQs
          </h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Everything you need to know about leveraging our workforce-as-a-service platform for your business needs
          </p>
        </div>

        {/* FAQ Items */}
        <div className="space-y-6">
          {faqs.map((faq, index) => (
            <div
              key={index}
              className="bg-white rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden"
            >
              <button
                onClick={() => toggleItem(index)}
                className="w-full px-6 py-6 text-left flex justify-between items-center hover:bg-gray-50 transition-colors duration-200"
              >
                <h3 className="text-lg font-semibold text-gray-900 pr-4">
                  Q{index + 1}: {faq.question}
                </h3>
                <div className="flex-shrink-0 ml-4">
                  <svg
                    className={`w-6 h-6 text-blue-600 transition-transform duration-300 ${
                      openItems.has(index) ? 'rotate-180' : ''
                    }`}
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </div>
              </button>
              
              <div
                className={`transition-all duration-300 ease-in-out ${
                  openItems.has(index) 
                    ? 'max-h-[1000px] opacity-100' 
                    : 'max-h-0 opacity-0'
                }`}
              >
                <div className="px-6 pb-6">
                  <div className="prose prose-blue max-w-none">
                    <p className="text-gray-700 whitespace-pre-line leading-relaxed">
                      {faq.answer}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* CTA Section */}
        <div className="mt-16 text-center">
          <div className="bg-white rounded-2xl shadow-lg p-8 max-w-2xl mx-auto">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              Ready to get started?
            </h2>
            <p className="text-gray-600 mb-6">
              Join hundreds of businesses that trust GRS Worker for their staffing needs
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button className="bg-blue-600 text-white px-8 py-3 rounded-xl font-semibold hover:bg-blue-700 transition-colors duration-200 shadow-lg hover:shadow-xl">
                Sign Up Now
              </button>
              <button className="border border-blue-600 text-blue-600 px-8 py-3 rounded-xl font-semibold hover:bg-blue-50 transition-colors duration-200">
                Contact Sales
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}