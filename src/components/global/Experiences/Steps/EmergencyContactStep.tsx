interface EmergencyContact {
    name: string;
    phone: string;
    relation: string;
}

interface EmergencyContactStepProps {
    emergencyContact: EmergencyContact;
    validationErrors: Record<string, string>;
    onUpdate: (field: keyof EmergencyContact, value: string) => void;
}

export default function EmergencyContactStep({
    emergencyContact,
    validationErrors,
    onUpdate
}: EmergencyContactStepProps) {
    return (
        <div className="space-y-6">
            <h3 className="text-2xl font-semibold text-deep-brown">
                Emergency Contact Details
            </h3>
            <div className="space-y-4">
                <div>
                    <label htmlFor="emergency_name" className="block text-sm font-medium text-deep-brown mb-1">
                        Contact person&apos;s name *
                    </label>
                    <input
                        type="text"
                        id="emergency_name"
                        value={emergencyContact.name}
                        onChange={(e) => onUpdate('name', e.target.value)}
                        placeholder="Enter emergency contact's name"
                        className={`w-full px-4 py-3 rounded-lg border ${
                            validationErrors.emergency_name 
                                ? 'border-red-300 focus:ring-red-500 focus:border-red-500' 
                                : 'border-gray-300 focus:ring-terracotta focus:border-transparent'
                        }`}
                    />
                    {validationErrors.emergency_name && (
                        <p className="mt-1 text-sm text-red-600">{validationErrors.emergency_name}</p>
                    )}
                </div>
                <div>
                    <label htmlFor="emergency_phone" className="block text-sm font-medium text-deep-brown mb-1">
                        Contact person&apos;s phone *
                    </label>
                    <input
                        type="tel"
                        id="emergency_phone"
                        value={emergencyContact.phone}
                        onChange={(e) => {
                            const value = e.target.value.replace(/[^0-9]/g, '').slice(0, 10);
                            onUpdate('phone', value);
                        }}
                        placeholder="Enter 10-digit phone number"
                        className={`w-full px-4 py-3 rounded-lg border ${
                            validationErrors.emergency_phone 
                                ? 'border-red-300 focus:ring-red-500 focus:border-red-500' 
                                : 'border-gray-300 focus:ring-terracotta focus:border-transparent'
                        }`}
                        maxLength={10}
                    />
                    {validationErrors.emergency_phone && (
                        <p className="mt-1 text-sm text-red-600">{validationErrors.emergency_phone}</p>
                    )}
                </div>
                <div>
                    <label htmlFor="emergency_relation" className="block text-sm font-medium text-deep-brown mb-1">
                        Relationship to contact person *
                    </label>
                    <input
                        type="text"
                        id="emergency_relation"
                        value={emergencyContact.relation}
                        onChange={(e) => onUpdate('relation', e.target.value)}
                        placeholder="e.g., Parent, Sibling, Spouse"
                        className={`w-full px-4 py-3 rounded-lg border ${
                            validationErrors.emergency_relation 
                                ? 'border-red-300 focus:ring-red-500 focus:border-red-500' 
                                : 'border-gray-300 focus:ring-terracotta focus:border-transparent'
                        }`}
                    />
                    {validationErrors.emergency_relation && (
                        <p className="mt-1 text-sm text-red-600">{validationErrors.emergency_relation}</p>
                    )}
                </div>
            </div>
        </div>
    );
} 