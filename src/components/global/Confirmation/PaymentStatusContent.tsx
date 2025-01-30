'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import TemplateRenderer from './TemplateRenderer';
import { useState, useEffect } from 'react';
import { CheckIcon, XMarkIcon } from '@heroicons/react/24/outline';

interface Template {
    type: string;
    title: string;
    content: {
        sections: Array<{
            type: string;
            content: string;
        }>;
    };
}

interface PaymentStatusContentProps {
    template: Template;
    status: string;
}

export default function PaymentStatusContent({ template, status }: PaymentStatusContentProps) {
    const [isVisible, setIsVisible] = useState(false);

    useEffect(() => {
        setIsVisible(true);
    }, []);

    const variants = {
        hidden: { opacity: 0, y: 20 },
        visible: { opacity: 1, y: 0 }
    };

    const containerVariants = {
        hidden: { opacity: 0, scale: 0.95 },
        visible: { 
            opacity: 1, 
            scale: 1,
            transition: {
                duration: 0.5,
                staggerChildren: 0.1
            }
        }
    };

    // Process template sections to remove title from content
    const processedSections = template.content.sections.map(section => {
        let content = section.content;
        content = content.replace(/^# Booking Confirmation\s*\n+/, '');
        content = content.replace(/^\s*\n+/, '');
        return { ...section, content };
    });

    const statusConfig = {
        success: {
            bgColor: 'bg-green-50',
            iconBg: 'bg-green-100',
            iconColor: 'text-green-600',
            borderColor: 'border-green-200',
            title: 'Payment Successful',
            description: 'Your booking has been confirmed'
        },
        failed: {
            bgColor: 'bg-red-50',
            iconBg: 'bg-red-100',
            iconColor: 'text-red-600',
            borderColor: 'border-red-200',
            title: 'Payment Failed',
            description: 'There was an issue with your payment'
        }
    };

    const config = statusConfig[status as keyof typeof statusConfig] || statusConfig.failed;

    return (
        <motion.div
            initial="hidden"
            animate="visible"
            variants={containerVariants}
            className="w-full"
        >
            <div className={`w-full ${config.bgColor} rounded-2xl p-8 shadow-xl border-2 ${config.borderColor}`}>
                <motion.div 
                    className="flex flex-col items-center justify-center text-center mb-10"
                    variants={variants}
                >
                    <div className={`w-24 h-24 ${config.iconBg} rounded-full flex items-center justify-center mb-6 shadow-lg`}>
                        {status === 'success' ? (
                            <CheckIcon className={`w-12 h-12 ${config.iconColor}`} />
                        ) : (
                            <XMarkIcon className={`w-12 h-12 ${config.iconColor}`} />
                        )}
                    </div>
                    <h1 className="text-4xl font-bold mb-3 text-deep-brown">
                        {config.title}
                    </h1>
                    <p className="text-xl text-deep-brown/80">
                        {config.description}
                    </p>
                </motion.div>

                <div className="space-y-8">
                    {processedSections.map((section, index) => (
                        <motion.div
                            key={index}
                            variants={variants}
                            className="bg-white/80 rounded-xl p-6 shadow-lg backdrop-blur-sm border border-deep-brown/5"
                        >
                            <TemplateRenderer content={section.content} />
                        </motion.div>
                    ))}
                </div>

                <motion.div 
                    className="mt-12 text-center"
                    variants={variants}
                >
                    <Link
                        href="/"
                        className={`
                            inline-flex items-center justify-center px-8 py-4 rounded-xl
                            ${status === 'success' ? 'bg-terracotta hover:bg-terracotta/90' : 'bg-deep-brown hover:bg-deep-brown/90'}
                            text-white font-semibold transition-all duration-300
                            hover:scale-[0.98] hover:shadow-lg
                        `}
                    >
                        Return to Home
                    </Link>
                </motion.div>
            </div>
        </motion.div>
    );
} 
