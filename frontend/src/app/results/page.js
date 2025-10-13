'use client';

import { useState } from 'react';
import Link from 'next/link';
import Header from '../../components/Header';
import Footer from '../../components/Footer';
import ComparisonView from '../../components/ComparisonView';

export default function ResultsPage() {
  const [activeTab, setActiveTab] = useState('comparison');
  const [searchTerm, setSearchTerm] = useState('');

  // Demo data - replace with actual data from backend
  const demoData = {
    originalText: `PRIVACY POLICY

Last updated: January 15, 2024

1. INTRODUCTION

Welcome to TechCorp ("we," "our," or "us"). This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you visit our website or use our services. Please read this privacy policy carefully. If you do not agree with the terms of this privacy policy, please do not access the site.

2. INFORMATION WE COLLECT

We may collect information about you in a variety of ways. The information we may collect via the Service includes:

Personal Data
Personally identifiable information, such as your name, shipping address, email address, and telephone number, and demographic information, such as your age, gender, hometown, and interests, that you voluntarily give to us when you register with the Service or when you choose to participate in various activities related to the Service, such as online chat and message boards.

Derived Data
Information our servers automatically collect when you access the Service, such as your IP address, your browser type, your operating system, your access times, and the pages you have viewed directly before and after accessing the Service.

Financial Data
Financial information, such as data related to your payment method (e.g., valid credit card number, card brand, expiration date) that we may collect when you purchase, order, return, exchange, or request information about our services from the Service.

3. HOW WE USE YOUR INFORMATION

Having accurate information about you permits us to provide you with a smooth, efficient, and customized experience. Specifically, we may use information collected about you via the Service to:

- Create and manage your account
- Deliver targeted advertising, coupons, newsletters, and promotions, and other information regarding our website and mobile application to you
- Email you regarding your account or order
- Enable user-to-user communications
- Fulfill and manage purchases, orders, payments, and other transactions related to the Service
- Generate a personal profile about you to make future visits to the Service more personalized
- Increase the efficiency and operation of the Service
- Monitor and analyze usage and trends to improve your experience with the Service
- Notify you of updates to the Service
- Offer new products, services, mobile applications, and/or recommendations to you
- Perform other business activities as needed
- Prevent fraudulent transactions, monitor against theft, and protect against criminal activity
- Process payments and refunds
- Request feedback and contact you about your use of the Service
- Resolve disputes and troubleshoot problems
- Respond to product and customer service requests
- Send you a newsletter
- Solicit support for the Service

4. DISCLOSURE OF YOUR INFORMATION

We may share information we have collected about you in certain situations. Your information may be disclosed as follows:

By Law or to Protect Rights
If we believe the release of information about you is necessary to respond to legal process, to investigate or remedy potential violations of our policies, or to protect the rights, property, and safety of others, we may share your information as permitted or required by any applicable law, rule, or regulation.

Business Transfers
We may share or transfer your information in connection with, or during negotiations of, any merger, sale of company assets, financing, or acquisition of all or a portion of our business to another company.

Third-Party Service Providers
We may share your information with third parties that perform services for us or on our behalf, including payment processing, data analysis, email delivery, hosting services, customer service, and marketing assistance.

Marketing Communications
With your consent, or with an opportunity for you to withdraw consent, we may share your information with third parties for marketing purposes, as permitted by law.

5. TRACKING TECHNOLOGIES

Cookies and Web Beacons
We may use cookies, web beacons, tracking pixels, and other tracking technologies on the Service to help customize the Service and improve your experience. When you access the Service, your personal information is not collected through the use of tracking technology.

6. THIRD-PARTY WEBSITES

The Service may contain links to third-party websites and applications of interest, including advertisements and external services, that are not affiliated with us. Once you have used these links to leave the Service, any information you provide to these third parties is not covered by this Privacy Policy, and we cannot guarantee the safety and privacy of your information.

7. SECURITY OF YOUR INFORMATION

We use administrative, technical, and physical security measures to help protect your personal information. While we have taken reasonable steps to secure the personal information you provide to us, please be aware that despite our efforts, no security measures are perfect or impenetrable, and no method of data transmission can be guaranteed against any interception or other type of misuse.

8. POLICY FOR CHILDREN

We do not knowingly solicit information from or market to children under the age of 13. If you become aware of any data we have collected from children under age 13, please contact us using the contact information provided below.

9. CONTROLS FOR DO-NOT-TRACK FEATURES

Most web browsers and some mobile operating systems and mobile applications include a Do-Not-Track ("DNT") feature or setting you can activate to signal your privacy preference not to have data about your online browsing activities monitored and collected.

10. OPTIONS REGARDING YOUR INFORMATION

You may at any time review or change the information in your account or terminate your account by logging into your account settings and updating your user account.

11. CALIFORNIA PRIVACY RIGHTS

California Civil Code Section 1798.83, also known as the "Shine The Light" law, permits our users who are California residents to request and obtain from us, once a year and free of charge, information about categories of personal information (if any) we disclosed to third parties for direct marketing purposes and the names and addresses of all third parties with which we shared personal information in the immediately preceding calendar year.

12. CONTACT US

If you have questions or comments about this Privacy Policy, please contact us at:

TechCorp
Email: privacy@techcorp.com
Phone: 1-800-TECHCORP
Address: 123 Tech Street, Silicon Valley, CA 94000`,

    simplifiedText: `PRIVACY POLICY - SIMPLIFIED VERSION

What This Means for You

This privacy policy explains how TechCorp collects and uses your personal information when you use our website or services.

What Information We Collect

We collect three types of information:

1. Personal Information
   - Your name, email, phone number, and address
   - Information you give us when you sign up or use our services

2. Automatic Information
   - Your computer's IP address and browser type
   - Which pages you visit and when

3. Payment Information
   - Credit card details when you make purchases

How We Use Your Information

We use your information to:
- Create and manage your account
- Send you emails about your account or orders
- Show you personalized ads and promotions
- Process your payments
- Improve our website and services
- Send you newsletters (if you want them)
- Help with customer service

Who We Share Your Information With

We may share your information with:
- Other companies that help us run our business (like payment processors)
- Marketing partners (only with your permission)
- Government agencies (if required by law)
- New owners (if we sell our company)

Cookies and Tracking

We use small files called "cookies" to remember your preferences and improve your experience on our website.

Links to Other Websites

Our website may have links to other websites. We're not responsible for their privacy practices, so read their privacy policies too.

How We Protect Your Information

We use security measures to protect your personal information, but no system is 100% secure. We do our best to keep your data safe.

Children's Privacy

We don't collect information from children under 13. If we find out we have, we'll delete it immediately.

Your Rights

You can:
- See what information we have about you
- Ask us to correct or delete your information
- Opt out of marketing emails
- Close your account anytime

California Residents

If you live in California, you have additional rights to know what personal information we collect and how we use it.

Contact Us

Questions about this privacy policy? Contact us:
- Email: privacy@techcorp.com
- Phone: 1-800-TECHCORP
- Address: 123 Tech Street, Silicon Valley, CA 94000`
  };

  const filteredOriginalText = demoData.originalText
    .split('\n')
    .filter(line => 
      searchTerm === '' || 
      line.toLowerCase().includes(searchTerm.toLowerCase())
    )
    .join('\n');

  const filteredSimplifiedText = demoData.simplifiedText
    .split('\n')
    .filter(line => 
      searchTerm === '' || 
      line.toLowerCase().includes(searchTerm.toLowerCase())
    )
    .join('\n');

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 dark:from-slate-900 dark:to-slate-800">
      <Header showUploadButton={false} />

      <main className="max-w-7xl mx-auto px-6 py-8">
        {/* Page Header */}
        <div className="mb-8">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between">
            <div>
              <h1 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white mb-4">
                Analysis Results
              </h1>
              <p className="text-xl text-gray-600 dark:text-gray-300">
                Compare the original privacy policy with our AI-simplified version
              </p>
            </div>
            <div className="mt-4 md:mt-0">
              <Link 
                href="/upload"
                className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-medium transition-colors duration-200 inline-flex items-center"
              >
                <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                </svg>
                New Analysis
              </Link>
            </div>
          </div>
        </div>

        {/* Controls */}
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 mb-8">
          <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
            <div className="flex space-x-2">
              <button
                onClick={() => setActiveTab('comparison')}
                className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                  activeTab === 'comparison'
                    ? 'bg-blue-600 text-white'
                    : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
                }`}
              >
                Side-by-Side
              </button>
              <button
                onClick={() => setActiveTab('original')}
                className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                  activeTab === 'original'
                    ? 'bg-blue-600 text-white'
                    : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
                }`}
              >
                Original Only
              </button>
              <button
                onClick={() => setActiveTab('simplified')}
                className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                  activeTab === 'simplified'
                    ? 'bg-blue-600 text-white'
                    : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
                }`}
              >
                Simplified Only
              </button>
            </div>
            
            <div className="flex items-center space-x-4">
              <div className="relative">
                <input
                  type="text"
                  placeholder="Search in text..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
                <svg className="absolute left-3 top-2.5 w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </div>
              <button className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg font-medium transition-colors">
                Export PDF
              </button>
            </div>
          </div>
        </div>

        {/* Content Display */}
        {activeTab === 'comparison' && (
          <ComparisonView
            originalText={filteredOriginalText}
            simplifiedText={filteredSimplifiedText}
            searchTerm={searchTerm}
          />
        )}

        {activeTab === 'original' && (
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg">
            <div className="p-6 border-b border-gray-200 dark:border-gray-700">
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white flex items-center">
                <div className="w-8 h-8 bg-red-100 dark:bg-red-900 rounded-lg flex items-center justify-center mr-3">
                  <svg className="w-4 h-4 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                </div>
                Original Privacy Policy
              </h2>
            </div>
            <div className="p-6 max-h-screen overflow-y-auto">
              <pre className="whitespace-pre-wrap text-sm text-gray-700 dark:text-gray-300 leading-relaxed font-mono">
                {filteredOriginalText}
              </pre>
            </div>
          </div>
        )}

        {activeTab === 'simplified' && (
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg">
            <div className="p-6 border-b border-gray-200 dark:border-gray-700">
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white flex items-center">
                <div className="w-8 h-8 bg-green-100 dark:bg-green-900 rounded-lg flex items-center justify-center mr-3">
                  <svg className="w-4 h-4 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                </div>
                AI-Simplified Version
              </h2>
            </div>
            <div className="p-6 max-h-screen overflow-y-auto">
              <pre className="whitespace-pre-wrap text-sm text-gray-700 dark:text-gray-300 leading-relaxed">
                {filteredSimplifiedText}
              </pre>
            </div>
          </div>
        )}

        {/* Analysis Summary */}
        <div className="mt-8 bg-gradient-to-r from-blue-600 to-purple-600 rounded-xl p-8 text-white">
          <h3 className="text-2xl font-bold mb-6">Analysis Summary</h3>
          <div className="grid md:grid-cols-3 gap-6">
            <div className="text-center">
              <div className="text-3xl font-bold mb-2">85%</div>
              <div className="text-blue-100">Complexity Reduction</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold mb-2">12</div>
              <div className="text-blue-100">Key Points Identified</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold mb-2">3.2x</div>
              <div className="text-blue-100">Faster to Read</div>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
