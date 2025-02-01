import { ChangeEvent } from 'react';

interface PersonalInfo {
    full_name: string;
    email: string;
    phone: string;
}

interface PersonalInfoFormProps {
    personalInfo: PersonalInfo;
    validationErrors: Record<string, string>;
    onUpdate: (field: keyof PersonalInfo, value: string) => void;
    step: 'name' | 'email' | 'phone';
}

export default function PersonalInfoForm({
    personalInfo,
    validationErrors,
    onUpdate,
    step
}: PersonalInfoFormProps) {
    const renderStepContent = () => {
        switch (step) {
            case 'name':
                return (
                    <div>
                        <label htmlFor="full_name" className="block text-sm font-medium text-deep-brown mb-1">
                            Full Name *
                        </label>
                        <input
                            type="text"
                            id="full_name"
                            value={personalInfo.full_name}
                            onChange={(e) => onUpdate('full_name', e.target.value)}
                            placeholder="Enter your full name"
                            className={`w-full px-4 py-3 rounded-lg border ${
                                validationErrors.full_name 
                                    ? 'border-red-300 focus:ring-red-500 focus:border-red-500' 
                                    : 'border-gray-300 focus:ring-terracotta focus:border-transparent'
                            }`}
                            autoFocus
                        />
                        {validationErrors.full_name && (
                            <p className="mt-1 text-sm text-red-600">{validationErrors.full_name}</p>
                        )}
                    </div>
                );

            case 'email':
                return (
                    <div>
                        <label htmlFor="email" className="block text-sm font-medium text-deep-brown mb-1">
                            Email Address *
                        </label>
                        <input
                            type="email"
                            id="email"
                            value={personalInfo.email}
                            onChange={(e) => onUpdate('email', e.target.value)}
                            placeholder="Enter your email address"
                            className={`w-full px-4 py-3 rounded-lg border ${
                                validationErrors.email 
                                    ? 'border-red-300 focus:ring-red-500 focus:border-red-500' 
                                    : 'border-gray-300 focus:ring-terracotta focus:border-transparent'
                            }`}
                            autoFocus
                        />
                        {validationErrors.email && (
                            <p className="mt-1 text-sm text-red-600">{validationErrors.email}</p>
                        )}
                    </div>
                );

            case 'phone':
                return (
                    <div>
                        <label htmlFor="phone" className="block text-sm font-medium text-deep-brown mb-1">
                            Phone Number *
                        </label>
                        <input
                            type="tel"
                            id="phone"
                            value={personalInfo.phone}
                            onChange={(e) => {
                                const value = e.target.value.replace(/[^0-9]/g, '').slice(0, 10);
                                onUpdate('phone', value);
                            }}
                            placeholder="Enter your 10-digit phone number"
                            className={`w-full px-4 py-3 rounded-lg border ${
                                validationErrors.phone 
                                    ? 'border-red-300 focus:ring-red-500 focus:border-red-500' 
                                    : 'border-gray-300 focus:ring-terracotta focus:border-transparent'
                            }`}
                            maxLength={10}
                            autoFocus
                        />
                        {validationErrors.phone && (
                            <p className="mt-1 text-sm text-red-600">{validationErrors.phone}</p>
                        )}
                    </div>
                );
        }
    };

    return (
        <div className="space-y-6">
            <h3 className="text-2xl font-semibold text-deep-brown">
                {step === 'name' && 'What is your name?'}
                {step === 'email' && 'What is your email address?'}
                {step === 'phone' && 'What is your phone number?'}
            </h3>
            {renderStepContent()}
        </div>
    );
} 