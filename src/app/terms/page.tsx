import { Metadata } from 'next';
import MainLayout from '@/components/layout/MainLayout';

export const metadata: Metadata = {
  title: 'Terms and Conditions | Beforest',
  description: 'Read our terms and conditions to understand your rights and responsibilities when using Beforest services.',
};

export default function TermsPage() {
  return (
    <MainLayout>
      <div className="max-w-3xl mx-auto px-4 sm:px-6 py-16 lg:py-20">
        <h1 className="text-3xl font-bold text-deep-brown mb-8">Terms and Conditions</h1>
        <div className="prose prose-deep-brown max-w-none space-y-6">
          <section>
            <p>The terms &quot;We&quot; / &quot;Us&quot; / &quot;Our&quot;/&quot;Company&quot; individually and collectively refer to Beforest Lifestyle Solutions Pvt Ltd and the terms &quot;Visitor&quot; &quot;User&quot; refer to the users.</p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-deep-brown">Use of Content</h2>
            <p>All logos, brands, marks headings, labels, names, signatures, numerals, shapes or any combinations thereof, appearing in this site, except as otherwise noted, are properties either owned, or used under licence, by the business and / or its associate entities who feature on this Website.</p>
            <p>You may not sell or modify the content of this Website or reproduce, display, publicly perform, distribute, or otherwise use the materials in any way for any public or commercial purpose without the respective organisation&apos;s or entity&apos;s written permission.</p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-deep-brown">Acceptable Website Use</h2>
            <div className="space-y-4">
              <div>
                <h3 className="text-lg font-medium text-deep-brown">Security Rules</h3>
                <p>Visitors are prohibited from violating or attempting to violate the security of the Website, including, without limitation:</p>
                <ul className="list-disc pl-6 space-y-2">
                  <li>Accessing data not intended for such user or logging into a server or account which the user is not authorised to access</li>
                  <li>Attempting to probe, scan or test the vulnerability of a system or network or to breach security or authentication measures without proper authorisation</li>
                  <li>Attempting to interfere with service to any user, host or network</li>
                  <li>Sending unsolicited electronic mail, including promotions and/or advertising of products or services</li>
                </ul>
              </div>
              
              <div>
                <h3 className="text-lg font-medium text-deep-brown">General Rules</h3>
                <p>Visitors may not use the Website in order to transmit, distribute, store or destroy material:</p>
                <ul className="list-disc pl-6 space-y-2">
                  <li>That could constitute or encourage conduct that would be considered a criminal offence or violate any applicable law or regulation</li>
                  <li>In a manner that will infringe the copyright, trademark, trade secret or other intellectual property rights of others</li>
                  <li>That is libellous, defamatory, pornographic, profane, obscene, threatening, abusive or hateful</li>
                </ul>
              </div>
            </div>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-deep-brown">Indemnity</h2>
            <p>The User unilaterally agree to indemnify and hold harmless, without objection, the Company, its officers, directors, employees and agents from and against any claims, actions and/or demands and/or liabilities and/or losses and/or damages whatsoever arising from or resulting from their use of beforest.co or their breach of the terms.</p>
          </section>

          <section>
            <p className="text-deep-brown/80">
              By using our services, you agree to these terms. Please read them carefully. If you don&apos;t agree to these terms, you may not use our services.
            </p>
          </section>
        </div>
      </div>
    </MainLayout>
  );
} 