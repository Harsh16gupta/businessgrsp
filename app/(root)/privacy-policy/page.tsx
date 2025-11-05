// app/privacy-policy/page.jsx

import React from 'react';

const PrivacyPolicy = () => {
  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4 sm:px-6 lg:px-8 pt-20">
      <div className="max-w-4xl mx-auto bg-white rounded-lg shadow-md overflow-hidden">
        {/* Header */}
        <div className="bg-green-600 text-white px-6 py-4">
          <h1 className="text-2xl font-bold text-center">PRIVACY POLICY</h1>
          <p className="text-center text-green-100 mt-2">GRSWORKER BUSINESS PLATFORM</p>
        </div>

        <div className="px-6 py-8">
          {/* Last Updated */}
          <div className="text-center mb-8">
            <p className="text-gray-600 font-semibold">
              Last Updated: {new Date().toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' })}
            </p>
          </div>

          {/* Introduction */}
          <section className="mb-8">
            <h2 className="text-xl font-bold text-gray-800 mb-4">1. INTRODUCTION</h2>
            <p className="text-gray-700 leading-relaxed">
              GRSWORKER ("we," "our," or "us") is committed to protecting your privacy. This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you use our Platform. By accessing or using the GRS Platform, you consent to the practices described in this policy.
            </p>
          </section>

          {/* Information We Collect */}
          <section className="mb-8">
            <h2 className="text-xl font-bold text-gray-800 mb-4">2. INFORMATION WE COLLECT</h2>
            
            <h3 className="text-lg font-semibold text-gray-700 mb-3">Personal Information</h3>
            <ul className="list-disc list-inside space-y-2 text-gray-700 mb-4">
              <li>Name, email address, phone number</li>
              <li>Business registration details and tax information</li>
              <li>Payment and billing information</li>
              <li>Profile photographs and identification documents</li>
              <li>Work history and performance ratings</li>
            </ul>

            <h3 className="text-lg font-semibold text-gray-700 mb-3">Usage Data</h3>
            <ul className="list-disc list-inside space-y-2 text-gray-700">
              <li>IP address, browser type, device information</li>
              <li>Platform usage patterns and preferences</li>
              <li>Location data (with your consent)</li>
              <li>Cookies and tracking technologies data</li>
            </ul>
          </section>

          {/* How We Use Your Information */}
          <section className="mb-8">
            <h2 className="text-xl font-bold text-gray-800 mb-4">3. HOW WE USE YOUR INFORMATION</h2>
            <ul className="list-disc list-inside space-y-2 text-gray-700">
              <li>To provide and maintain our Platform services</li>
              <li>To facilitate connections between Business Users and Workers</li>
              <li>To process payments and transactions</li>
              <li>To communicate important updates and notifications</li>
              <li>To improve our Platform and user experience</li>
              <li>To comply with legal obligations and prevent fraud</li>
              <li>To provide customer support and resolve disputes</li>
            </ul>
          </section>

          {/* Information Sharing */}
          <section className="mb-8">
            <h2 className="text-xl font-bold text-gray-800 mb-4">4. INFORMATION SHARING AND DISCLOSURE</h2>
            
            <h3 className="text-lg font-semibold text-gray-700 mb-3">With Service Providers</h3>
            <p className="text-gray-700 leading-relaxed mb-3">
              We may share your information with third-party service providers for:
            </p>
            <ul className="list-disc list-inside space-y-2 text-gray-700 mb-4">
              <li>Payment processing and verification services</li>
              <li>Cloud storage and hosting services</li>
              <li>Analytics and performance monitoring</li>
              <li>Customer support services</li>
            </ul>

            <h3 className="text-lg font-semibold text-gray-700 mb-3">Between Users</h3>
            <p className="text-gray-700 leading-relaxed mb-3">
              To facilitate work engagements, we share necessary information between Business Users and Workers:
            </p>
            <ul className="list-disc list-inside space-y-2 text-gray-700">
              <li>Contact information for coordination purposes</li>
              <li>Work requirements and job details</li>
              <li>Ratings and reviews (after work completion)</li>
            </ul>

            <h3 className="text-lg font-semibold text-gray-700 mb-3 mt-4">Legal Requirements</h3>
            <p className="text-gray-700 leading-relaxed">
              We may disclose your information if required by law, court order, or governmental authority, or when we believe disclosure is necessary to protect our rights, property, or safety.
            </p>
          </section>

          {/* Data Security */}
          <section className="mb-8">
            <h2 className="text-xl font-bold text-gray-800 mb-4">5. DATA SECURITY</h2>
            <p className="text-gray-700 leading-relaxed">
              We implement appropriate technical and organizational security measures to protect your personal information against unauthorized access, alteration, disclosure, or destruction. However, no internet transmission is completely secure, and we cannot guarantee absolute security.
            </p>
          </section>

          {/* Data Retention */}
          <section className="mb-8">
            <h2 className="text-xl font-bold text-gray-800 mb-4">6. DATA RETENTION</h2>
            <p className="text-gray-700 leading-relaxed">
              We retain your personal information for as long as necessary to fulfill the purposes outlined in this Privacy Policy, unless a longer retention period is required or permitted by law. We will delete your information upon your request, subject to legal obligations.
            </p>
          </section>

          {/* Your Rights */}
          <section className="mb-8">
            <h2 className="text-xl font-bold text-gray-800 mb-4">7. YOUR RIGHTS</h2>
            <p className="text-gray-700 leading-relaxed mb-3">
              Depending on your location, you may have the following rights regarding your personal information:
            </p>
            <ul className="list-disc list-inside space-y-2 text-gray-700">
              <li>Right to access and receive copies of your data</li>
              <li>Right to rectify inaccurate or incomplete information</li>
              <li>Right to erasure of your personal data</li>
              <li>Right to restrict or object to processing</li>
              <li>Right to data portability</li>
              <li>Right to withdraw consent</li>
            </ul>
          </section>

          {/* Cookies */}
          <section className="mb-8">
            <h2 className="text-xl font-bold text-gray-800 mb-4">8. COOKIES AND TRACKING TECHNOLOGIES</h2>
            <p className="text-gray-700 leading-relaxed">
              We use cookies and similar tracking technologies to enhance your experience on our Platform. You can control cookie preferences through your browser settings. However, disabling cookies may affect Platform functionality.
            </p>
          </section>

          {/* Third-Party Links */}
          <section className="mb-8">
            <h2 className="text-xl font-bold text-gray-800 mb-4">9. THIRD-PARTY LINKS</h2>
            <p className="text-gray-700 leading-relaxed">
              Our Platform may contain links to third-party websites. This Privacy Policy does not apply to those sites, and we are not responsible for their privacy practices. We encourage you to review their privacy policies.
            </p>
          </section>

          {/* Children's Privacy */}
          <section className="mb-8">
            <h2 className="text-xl font-bold text-gray-800 mb-4">10. CHILDREN'S PRIVACY</h2>
            <p className="text-gray-700 leading-relaxed">
              Our Platform is not intended for users under the age of 18. We do not knowingly collect personal information from children. If we become aware of such collection, we will take steps to delete the information.
            </p>
          </section>

          {/* Changes to Policy */}
          <section className="mb-8">
            <h2 className="text-xl font-bold text-gray-800 mb-4">11. CHANGES TO THIS POLICY</h2>
            <p className="text-gray-700 leading-relaxed">
              We may update this Privacy Policy from time to time. We will notify you of significant changes by posting the new policy on our Platform and updating the "Last Updated" date. Your continued use of the Platform constitutes acceptance of the updated policy.
            </p>
          </section>

          {/* Contact Information */}
          <section className="mb-8">
            <h2 className="text-xl font-bold text-gray-800 mb-4">12. CONTACT US</h2>
            <div className="bg-gray-50 p-4 rounded-lg">
              <p className="text-gray-700 leading-relaxed">
                If you have any questions about this Privacy Policy or our data practices, please contact us at:
              </p>
              <p className="text-gray-700 leading-relaxed mt-2">
                <strong>GRS Data Protection Officer</strong><br />
                Email: info@grsworker.com<br />
                Phone: +91 9555602536
              </p>
            </div>
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

export default PrivacyPolicy;