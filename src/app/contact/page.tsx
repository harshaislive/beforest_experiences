import { Metadata } from 'next';
import MainLayout from '@/components/layout/MainLayout';
import ContactForm from './ContactForm';

export const metadata: Metadata = {
    title: 'Contact Us | BeForest Events',
    description: 'Get in touch with BeForest Events. We\'re here to help with your questions and feedback.',
};

export default function ContactPage() {
    return (
        <MainLayout>
            <div className="container mx-auto px-4 py-16 md:py-24">
                <div className="max-w-4xl mx-auto">
                    {/* Header */}
                    <div className="text-center mb-12">
                        <h1 className="text-4xl font-bold text-deep-brown mb-4">Contact Us</h1>
                        <p className="text-lg text-deep-brown/80">
                            Have questions? We&apos;d love to hear from you. Send us a message and we&apos;ll respond as soon as possible.
                        </p>
                    </div>

                    <div className="grid md:grid-cols-5 gap-8">
                        {/* Contact Information */}
                        <div className="md:col-span-2 bg-white rounded-xl p-8 h-fit">
                            <h2 className="text-xl font-semibold text-deep-brown mb-6">Get in Touch</h2>
                            
                            <div className="space-y-6">
                                <div>
                                    <h3 className="font-medium text-deep-brown mb-2">Email</h3>
                                    <p className="text-deep-brown/80">support@beforest.in</p>
                                </div>

                                <div>
                                    <h3 className="font-medium text-deep-brown mb-2">Phone</h3>
                                    <p className="text-deep-brown/80">+91 (XXX) XXX-XXXX</p>
                                </div>

                                <div>
                                    <h3 className="font-medium text-deep-brown mb-2">Office</h3>
                                    <p className="text-deep-brown/80">
                                        123 Nature Valley,<br />
                                        Bangalore, Karnataka 560001
                                    </p>
                                </div>

                                <div>
                                    <h3 className="font-medium text-deep-brown mb-2">Hours</h3>
                                    <p className="text-deep-brown/80">
                                        Monday - Friday: 9:00 AM - 6:00 PM<br />
                                        Saturday: 10:00 AM - 4:00 PM
                                    </p>
                                </div>
                            </div>
                        </div>

                        {/* Contact Form */}
                        <div className="md:col-span-3 bg-white rounded-xl p-8">
                            <ContactForm />
                        </div>
                    </div>
                </div>
            </div>
        </MainLayout>
    );
} 