// app/terms-and-conditions/page.jsx or pages/terms-and-conditions.js (depending on your Next.js version)

import React from 'react';

const TermsAndConditions = () => {
  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4 sm:px-6 lg:px-8 pt-20">
      <div className="max-w-4xl mx-auto bg-white rounded-lg shadow-md overflow-hidden">
        {/* Header */}
        <div className="bg-blue-600 text-white px-6 py-4">
          <h1 className="text-2xl font-bold text-center">TERMS AND CONDITIONS</h1>
          <p className="text-center text-blue-100 mt-2">IND</p>
        </div>

        <div className="px-6 py-8">
          {/* Last Updated */}
          <div className="text-center mb-8">
            <p className="text-gray-600 font-semibold">
              Last Updated: 1st April, 2025
            </p>
          </div>

          {/* Introduction */}
          <div className="mb-8">
            <p className="text-gray-700 leading-relaxed">
              These terms and conditions ("Terms") govern the use of services made available on or through GRSWORKER and/or the mobile app (collectively, the "Platform", and together with the services made available on or through the Platform, the "Services"). These Terms ("Privacy Policy"), and any guidelines, additional, or supplemental terms, policies, and disclaimers made available or issued by us from time to time ("Supplemental Terms"). The Privacy Policy and the Supplemental Terms form an integral part of these Terms. In the event of a conflict between these Terms and the Supplemental Terms with respect to applicable Services, the Supplemental Terms will prevail.
            </p>
          </div>

          <div className="mb-8">
            <p className="text-gray-700 leading-relaxed">
              The Terms constitute a binding and enforceable legal contract with our affiliates ("GRS", "we", "us", or "our"), and you, a user of the Services, or any legal entity that books Pro Services (defined below) on behalf of end-users ("you" or "Customer"). By using the Services, you represent and warrant that you have full legal capacity and authority to agree to and bind yourself to these Terms. If you represent any other person, you confirm and represent that you have the necessary power and authority to bind such person to these Terms.
            </p>
          </div>

          <div className="mb-8">
            <p className="text-gray-700 leading-relaxed">
              By using the Services, you agree that you have read, understood, and are bound by, these Terms, as amended from time to time, and that you will comply with the requirements listed here. These Terms expressly supersede any prior written agreements with you. If you do not agree to these Terms, or comply with the requirements listed here, please do not use the Services and our application and website.
            </p>
          </div>

          {/* Section 1: SERVICES */}
          <section className="mb-8">
            <h2 className="text-xl font-bold text-gray-800 mb-4">1. SERVICES</h2>
            
            <div className="space-y-4">
              <p className="text-gray-700 leading-relaxed">
                <strong>(a)</strong> The Services include the provision of the Platform that enables you to arrange and schedule different home-based services & Business gigs worker with independent third-party service providers of those services ("Service Professionals"). As a part of the Services, we facilitate the transfer of payments to Service Professionals for the services they render to you and collects payments on behalf of such Service Professionals.
              </p>

              <p className="text-gray-700 leading-relaxed">
                <strong>(b)</strong> The services rendered by Service Professionals are referred to as "Pro Services". The term "Services" does not include the Pro Services. GRS does not provide the Pro Services and is not responsible their provision. Service Professionals are solely liable and responsible for the Pro Services that they offer or otherwise provide through the Platform. GRS and its affiliates do not employ Service Professionals, nor are Service Professionals agents, contractors, or partners of GRS or its affiliates. Service Professionals do not have the ability to bind or represent GRS.
              </p>

              <p className="text-gray-700 leading-relaxed">
                <strong>(c)</strong> The Platform is for your personal and commercial use only, unless otherwise agreed upon on in accordance with the terms of a separate agreement. Please note that the Platform is intended for use only within India. You agree that in the event you avail the Services or Pro Services from a legal jurisdiction other than the territory of India, you will be deemed to have accepted the GRS terms and conditions applicable to that jurisdiction.
              </p>

              <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 mb-4">
                <p className="text-gray-700 leading-relaxed">
                  <strong>(d)</strong> We are the aggregator platform that connect service provider to their service seekers. Any kind of fight between two parties, something bad happened, fight, clash of opinion, injury to service provider and seeker, GRS is not responsible, company is not responsible, founder is not responsible, it's completely service provider and seeker choice to use this application. Otherwise don't use this.
                </p>
              </div>

              <p className="text-gray-700 leading-relaxed">
                <strong>(e)</strong> A key part of the Services is GRS's ability to send you text messages, electronic mails, or WhatsApp messages, call, including in connection with your bookings, your utilisation of the Services, or as a part of its promotional and marketing strategies. While you may opt out of receiving these text messages on our WhatsApp number or through the in-Platform settings, you agree and acknowledge that this may impact GRS ability to provide the Services (or a part of the Services) to you.
              </p>

              <p className="text-gray-700 leading-relaxed">
                <strong>(f)</strong> In certain instances, you may be required to furnish identification proof to avail the Services or the Pro Services, and hereby agree to do so. A failure to comply with this request may result in your inability to use the Services or Pro Services.
              </p>

              <div className="bg-gray-50 p-4 rounded-lg">
                <p className="text-gray-700 leading-relaxed font-semibold mb-2">(g) GRS Credits: on referral</p>
                <div className="space-y-2 ml-4">
                  <p className="text-gray-700 leading-relaxed">
                    <strong>(i)</strong> GRS may, in its sole discretion, offer promotional codes that may be redeemed for credits, other features or benefits related to the Services, and/or Pro Services, subject to any additional terms that may apply on a promotional code ("GRS Credits").
                  </p>
                  <p className="text-gray-700 leading-relaxed">
                    <strong>(ii)</strong> You agree that you shall use GRS Credits in a lawful manner, referral amount only get when you share Fifty Person in WhatsApp in your family/friends/relatives and send us screen shot on our WhatsApp number as a proof, then you will get the referral amount (terms are applicable).
                  </p>
                  <p className="text-gray-700 leading-relaxed">
                    <strong>(iii)</strong> GRS may, at its sole discretion, provide only certain users with GRS Credits that may result in different amounts charged for the same or similar services obtained by other users.
                  </p>
                  <p className="text-gray-700 leading-relaxed">
                    <strong>(iv)</strong> GRS reserves the right to withhold or deduct credits or other features or benefits obtained through the use of GRS Credits, by you or any other user, if GRS reasonably determines or believes that the use or redemption of the GRS Credits was in error, fraudulent, illegal, or in violation of the applicable GRS Credit terms or these Terms.
                  </p>
                </div>
              </div>
            </div>
          </section>

          {/* Section 2: ACCOUNT CREATION */}
          <section className="mb-8">
            <h2 className="text-xl font-bold text-gray-800 mb-4">2. ACCOUNT CREATION</h2>
            <div className="space-y-4">
              <p className="text-gray-700 leading-relaxed">
                <strong>(a)</strong> To avail the Services, you will be required to create an account on the Platform ("Account"). For this Account, you may be required to furnish certain details, including but not limited to your phone number. To create an Account, you must be at least 18 years of age.
              </p>
              <p className="text-gray-700 leading-relaxed">
                <strong>(b)</strong> You warrant that all information furnished in connection with your Account is and shall remain accurate and true. You agree to promptly update your details on the Platform in the event of any change to or modification of this information.
              </p>
              <p className="text-gray-700 leading-relaxed">
                <strong>(c)</strong> You are solely responsible for maintaining the security and confidentiality of your Account and agree to immediately notify us of any disclosure or unauthorised use of your Account or any other breach of security with respect to your Account.
              </p>
              <p className="text-gray-700 leading-relaxed">
                <strong>(d)</strong> You are liable and accountable for all activities that take place through your Account, including activities performed by persons other than you. We shall not be liable for any unauthorised access to your Account.
              </p>
              <p className="text-gray-700 leading-relaxed">
                <strong>(e)</strong> You agree to receive communications from us regarding (i) requests for payments, (ii) information about us and the Services, (iii) promotional offers and services from us and our third party partners, and (iv) any other matter in relation to the Services.
              </p>
            </div>
          </section>

          {/* Continue with other sections following the same pattern */}

          {/* Mission Section */}
          <section className="mt-12 p-6 bg-blue-50 rounded-lg">
            <h2 className="text-2xl font-bold text-blue-800 mb-4 text-center">OUR MISSION</h2>
            <p className="text-gray-700 leading-relaxed text-center text-lg">
              Our mission is to create economic opportunities for local businesses and hourly workers across the globe. We believe that everyone deserves a chance to thrive in their careers, and we're here to empower our users to make that happen.
            </p>
          </section>

          {/* Footer */}
          <div className="mt-8 pt-6 border-t border-gray-200 text-center">
            <p className="text-gray-600">
              &copy; {new Date().getFullYear()} GRSWORKER BUSINESS. All rights reserved.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TermsAndConditions;