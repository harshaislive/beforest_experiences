'use client';

import { useState } from 'react';
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';

export default function ContactForm() {
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        subject: '',
        message: ''
    });
    const [status, setStatus] = useState<'idle' | 'submitting' | 'success' | 'error'>('idle');
    const [errorMessage, setErrorMessage] = useState('');
    const supabase = createClientComponentClient();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setStatus('submitting');
        setErrorMessage('');

        try {
            const { error } = await supabase
                .from('support_tickets')
                .insert([{
                    name: formData.name,
                    email: formData.email,
                    subject: formData.subject,
                    message: formData.message
                }]);

            if (error) throw error;

            setStatus('success');
            setFormData({ name: '', email: '', subject: '', message: '' });
        } catch (error) {
            console.error('Error submitting form:', error);
            setStatus('error');
            setErrorMessage('Something went wrong. Please try again later.');
        }
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    if (status === 'success') {
        return (
            <div className="text-center py-8">
                <h3 className="text-xl font-semibold text-deep-brown mb-4">Thank You!</h3>
                <p className="text-deep-brown/80 mb-6">
                    We&apos;ve received your message and will get back to you soon.
                </p>
                <button
                    onClick={() => setStatus('idle')}
                    className="inline-flex items-center justify-center px-6 py-3 bg-sage-100 hover:bg-sage-200 text-deep-brown rounded-lg font-medium transition-colors"
                >
                    Send Another Message
                </button>
            </div>
        );
    }

    return (
        <form onSubmit={handleSubmit} className="space-y-6">
            <div>
                <label htmlFor="name" className="block text-sm font-medium text-deep-brown mb-2">
                    Name
                </label>
                <input
                    type="text"
                    id="name"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-2 rounded-lg border border-sage-200 focus:ring-2 focus:ring-terracotta focus:border-transparent"
                />
            </div>

            <div>
                <label htmlFor="email" className="block text-sm font-medium text-deep-brown mb-2">
                    Email
                </label>
                <input
                    type="email"
                    id="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-2 rounded-lg border border-sage-200 focus:ring-2 focus:ring-terracotta focus:border-transparent"
                />
            </div>

            <div>
                <label htmlFor="subject" className="block text-sm font-medium text-deep-brown mb-2">
                    Subject
                </label>
                <input
                    type="text"
                    id="subject"
                    name="subject"
                    value={formData.subject}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-2 rounded-lg border border-sage-200 focus:ring-2 focus:ring-terracotta focus:border-transparent"
                />
            </div>

            <div>
                <label htmlFor="message" className="block text-sm font-medium text-deep-brown mb-2">
                    Message
                </label>
                <textarea
                    id="message"
                    name="message"
                    value={formData.message}
                    onChange={handleChange}
                    required
                    rows={4}
                    className="w-full px-4 py-2 rounded-lg border border-sage-200 focus:ring-2 focus:ring-terracotta focus:border-transparent"
                />
            </div>

            {errorMessage && (
                <div className="text-red-600 text-sm">
                    {errorMessage}
                </div>
            )}

            <button
                type="submit"
                disabled={status === 'submitting'}
                className="w-full px-6 py-3 bg-terracotta hover:bg-terracotta/90 text-white rounded-lg font-medium transition-colors disabled:opacity-50"
            >
                {status === 'submitting' ? 'Sending...' : 'Send Message'}
            </button>
        </form>
    );
} 