// app/grs-worker-faqs/page.tsx
'use client';

import { useState } from 'react';

interface FAQItem {
  id: string;
  question: string;
  answer: string;
}

export default function GRSWorkerFAQs() {
  const [openItems, setOpenItems] = useState<Set<string>>(new Set(['q1']));

  const toggleItem = (id: string) => {
    const newOpenItems = new Set(openItems);
    if (newOpenItems.has(id)) {
      newOpenItems.delete(id);
    } else {
      newOpenItems.add(id);
    }
    setOpenItems(newOpenItems);
  };

  const faqs: FAQItem[] = [
    {
      id: 'q1',
      question: 'What is GRS Worker and how does it differ from a traditional staffing agency?',
      answer: 'GRS Worker is a tech-enabled platform that connects your business (hotel, restaurant, construction site, petrol station, retail outlet, facility) with pre-vetted gig/temporary workers (bartenders, cooks, dishwashers, servers, cleaners, machine-operators, helpers, day-to-day organization staff). Unlike traditional staffing agencies that manage recruitment, on-boarding, payroll manually and often for longer-term hires, GRS Worker offers flexible shifts, real-time bookings, rapid deployment, and full compliance management. The model is essentially "Workforce as a Service (WaaS)" and "Gig Talent Marketplace" for businesses.'
    },
    {
      id: 'q2',
      question: 'Which roles can I fill via GRS Worker?',
      answer: 'You can source a wide variety of roles depending on your industry and operational needs:\n\n• Hospitality: bartenders, cooks (line, prep, head), dishwashers, servers, banquet staff\n• Construction & industrial: general helpers, machine operators, welders, site assistants\n• Facilities & retail: cleaning/janitorial staff, petrol-pump attendants, general duty staff, day-to-day organization workers\n• Seasonal, event & overflow staffing: for peak days, banquets, festivals, temporary expansions\n\nThis model mirrors the marketplace approach used by Instawork, which supports roles such as food-service, janitorial, warehousing, event staff.'
    },
    {
      id: 'q3',
      question: 'How fast can you deploy staff? What is the minimum booking duration?',
      answer: 'You can often book workers through the platform in as little as 24-48 hours, depending on location, role and shift time. We support short-term shifts (single day, half day), multi-day assignments and recurring bookings. Minimum booking durations depend on the role (e.g., a 4-hour shift in hospitality, full-shift for industrial operator). Our platform is designed for speed and flexibility much like Instawork\'s instant shift filling.'
    },
    {
      id: 'q4',
      question: 'What about screening, verification, compliance and payroll?',
      answer: 'GRS Worker handles the full lifecycle:\n\n• We conduct worker vetting: ID verification, experience checks, skills assessments, background screening (where applicable)\n• We ensure statutory compliance (India: EPF/ESI, contract labour laws, basic insurance; other local laws as relevant)\n• Businesses receive payroll, billing and worker documentation in one package — reducing your internal HR burden\n\nFor hospitality & hourly roles, we offer "Turnkey Gig Staffing" where you simply approve the shift and we supply the worker. This replicates what Meraqui does in its "WaaS" model for blue/grey-collar staff.'
    },
    {
      id: 'q5',
      question: 'How does pricing work and how does this reduce my hiring cost?',
      answer: 'Pricing is transparent, shift-based or hour-based. You pay for the actual hours worked plus any pre-agreed service fee — no long-term commitments unless you choose them. Costs saved: recruiting overhead, full-time salaries + benefits, overtime unpredictability, idle time risk. Because you only pay when you need a worker, you gain cost-efficiency especially during demand peaks or for unplanned shifts. The marketplace model (used by Instawork) enables flexible staffing at scale, reducing administrative burden and cost per hire.'
    },
    {
      id: 'q6',
      question: 'What about reliability and worker "no-shows"?',
      answer: 'Reliability is central. We maintain a network of workers with performance ratings, previous shift history and "favourite worker" options so you can re-book people you like. If a worker fails to show for a shift, we provide immediate replacement (subject to our SLA) or credit the shift. We aim for industry-leading fill rates and low no-show rates. (For context: Instawork reports <2% no-show in its markets).'
    },
    {
      id: 'q7',
      question: 'Can we convert a temporary worker into a permanent hire?',
      answer: 'Yes. You can use a "temp-to-perm" pathway: evaluate a worker via shifts, and if you wish to hire permanently, we facilitate the conversion per our policy. This gives you a risk-free trial before committing long-term.'
    },
    {
      id: 'q8',
      question: 'What geographic coverage do you offer?',
      answer: 'We currently operate across [list your cities/states] (for example: Maharashtra, all major metros, Tier-2 cities). Like Meraqui, which spans 28 states and 30 industries in India. As we scale, we\'ll add more locations to ensure national reach for your business.'
    },
    {
      id: 'q9',
      question: 'How do I get started?',
      answer: 'Sign up for a business account on our platform, provide your company details and role requirements (role type, shift time, skills required, location). You\'ll get access to the dashboard to browse profiles, select shifts, approve workers and track billing. Alternatively, our account manager can assist you end-to-end. Once registration is complete, you can post shifts or request workers immediately.'
    },
    {
      id: 'q10',
      question: 'What if the worker does not meet expectations?',
      answer: 'If a worker isn\'t meeting the agreed standard (within the first shift or initial period defined in our SLA), simply notify us via the dashboard or your account manager. We\'ll replace the worker at no extra cost (subject to terms) or issue a credit. We value quality and repeat business, so your satisfaction is central.'
    },
    {
      id: 'q11',
      question: 'Can you handle multiple locations or large volume events?',
      answer: 'Yes. Whether you have a single restaurant needing three servers for a day or a hotel chain needing 100 staff across multiple sites, our platform supports multi-site scheduling, bulk shift booking, worker footprint tracking and centralised billing. The marketplace approach (as used by Instawork) enables this scale.'
    },
    {
      id: 'q12',
      question: 'Can I hire operators for specific machines or equipment?',
      answer: 'Yes. GRS Worker provides trained operators for CNC, lathe, press, packaging, injection molding, Turbine, boiler, and forklift machines. We also ensure that operators are safety-trained and experienced.'
    },
    {
      id: 'q13',
      question: 'How do you verify construction and industrial workers?',
      answer: 'Every worker’s Aadhaar ID, trade skill, experience certificate, and safety training are verified. For certain categories, we also check site-safety and PPE compliance'
    },
    {
      id: 'q14',
      question: 'How can hotels and restaurants hire temporary cooks, servers, or cleaners fast?',
      answer: 'Through GRS Worker, hospitality businesses can instantly book temporary cooks, bartenders, dishwashers, room boys, servers, and housekeeping staff. We provide verified, experienced workers ready for events, peak seasons, or daily operations.'
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 py-12 px-4 sm:px-6 lg:px-8 pt-25">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-16">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            GRS Worker – Business Client FAQs
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Everything you need to know about our workforce-as-a-service platform and how it can transform your staffing operations.
          </p>
        </div>

        {/* FAQ Section */}
        <div className="bg-white rounded-2xl shadow-lg shadow-gray-200/50 border border-gray-100">
          {faqs.map((faq, index) => (
            <div
              key={faq.id}
              className={`border-b border-gray-100 last:border-b-0 ${
                openItems.has(faq.id) ? 'bg-blue-50/30' : ''
              } transition-colors duration-200`}
            >
              <button
                onClick={() => toggleItem(faq.id)}
                className="w-full px-6 py-6 text-left flex justify-between items-center hover:bg-gray-50/50 transition-colors duration-200"
              >
                <div className="flex items-start space-x-4">
                  <div className="flex-shrink-0 w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">
                    <span className="text-blue-600 font-semibold text-sm">
                      {index + 1}
                    </span>
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900 pr-8">
                    {faq.question}
                  </h3>
                </div>
                <div className="flex-shrink-0 ml-4">
                  <svg
                    className={`w-5 h-5 text-gray-500 transition-transform duration-200 ${
                      openItems.has(faq.id) ? 'rotate-180' : ''
                    }`}
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M19 9l-7 7-7-7"
                    />
                  </svg>
                </div>
              </button>
              
              {openItems.has(faq.id) && (
                <div className="px-6 pb-6 ml-12">
                  <div className="prose prose-blue max-w-none">
                    {faq.answer.split('\n').map((paragraph, idx) => (
                      <p key={idx} className="text-gray-700 mb-3 last:mb-0">
                        {paragraph}
                      </p>
                    ))}
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>

        
      </div>
    </div>
  );
}