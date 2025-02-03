import { Metadata } from 'next';
import MainLayout from '@/components/layout/MainLayout';

export const metadata: Metadata = {
  title: 'Privacy Policy | Beforest',
  description: 'Learn about how we handle and protect your personal information at Beforest.',
};

export default function PrivacyPage() {
  return (
    <MainLayout>
      <div className="max-w-3xl mx-auto px-4 sm:px-6 py-16 lg:py-20">
        <h1 className="text-3xl font-bold text-deep-brown mb-8">Privacy Policy</h1>
        <div className="prose prose-deep-brown max-w-none space-y-6">
          <section>
            <h2 className="text-xl font-semibold text-deep-brown">Introduction</h2>
            <p>This Privacy Policy describes how BEFOREST LIFESTYLE SOLUTIONS PVT LTD and its affiliates collect, use, share, protect or otherwise process your information/personal data through our website https://beforest.co (hereinafter referred to as Platform).</p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-deep-brown">Collection</h2>
            <p>We collect your personal data when you use our Platform, services or otherwise interact with us during the course of our relationship and related information provided from time to time. Some of the information that we may collect includes but is not limited to personal data/information provided to us during sign-up/registering or using our Platform such as name, date of birth, address, telephone/mobile number, email ID and/or any such information shared as proof of identity or address.</p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-deep-brown">Security Precautions</h2>
            <p>To protect your personal data from unauthorised access or disclosure, loss or misuse we adopt reasonable security practices and procedures. Once your information is in our possession or whenever you access your account information, we adhere to our security guidelines to protect it against unauthorised access and offer the use of a secure server.</p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-deep-brown">Contact Information</h2>
            <div className="bg-sage-50 p-4 rounded-lg">
              <p className="font-medium">Hyderabad Office</p>
              <p>Rajshekar</p>
              <p>Beforest Lifestyle Solutions</p>
              <p>126, Road Number 11, ICRISAT Colony, Jubilee Hills</p>
              <p>Hyderabad, Telangana 500033</p>
              <p className="mt-2">Contact us: +91 89779 45351</p>
              <p>Phone Time: Monday – Friday (9:00 – 18:00)</p>
            </div>
          </section>
        </div>
      </div>
    </MainLayout>
  );
} 
