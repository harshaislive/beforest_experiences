import React from 'react';
import ReactMarkdown from 'react-markdown';

interface TemplateRendererProps {
    template: {
        title: string;
        content: {
            sections: Array<{
                type: string;
                content: string;
            }>;
        };
    };
}

const TemplateRenderer: React.FC<TemplateRendererProps> = ({ template }) => {
    const renderSection = (section: { type: string; content: string }) => {
        return (
            <div className="prose prose-deep-brown max-w-none">
                <ReactMarkdown>{section.content}</ReactMarkdown>
            </div>
        );
    };

    return (
        <div className="bg-white rounded-lg shadow-lg p-6">
            <h1 className="text-2xl font-bold text-deep-brown mb-6">
                {template.title}
            </h1>
            <div className="space-y-6">
                {template.content.sections.map((section, index) => (
                    <div key={index}>
                        {renderSection(section)}
                    </div>
                ))}
            </div>
        </div>
    );
};

export default TemplateRenderer; 