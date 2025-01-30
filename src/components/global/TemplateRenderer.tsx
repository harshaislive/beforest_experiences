import React, { useEffect, useState } from 'react';
import DOMPurify from 'isomorphic-dompurify';
import { marked } from 'marked';

interface TemplateRendererProps {
    template: string;
    variables: Record<string, any>;
}

export const TemplateRenderer: React.FC<TemplateRendererProps> = ({ template, variables }) => {
    const [sanitizedHtml, setSanitizedHtml] = useState('');

    useEffect(() => {
        const renderTemplate = async () => {
            try {
                let renderedContent = template;

                // Replace variables in the template
                Object.entries(variables).forEach(([key, value]) => {
                    const regex = new RegExp(`{{\\s*${key}\\s*}}`, 'g');
                    renderedContent = renderedContent.replace(regex, String(value));
                });

                // Convert markdown to HTML
                const htmlContent = await marked(renderedContent);

                // Sanitize HTML
                const cleanHtml = DOMPurify.sanitize(htmlContent.toString());
                setSanitizedHtml(cleanHtml);
            } catch (error) {
                console.error('Error rendering template:', error);
                setSanitizedHtml('Error rendering content');
            }
        };

        renderTemplate();
    }, [template, variables]);

    return (
        <div 
            className="prose prose-lg max-w-none prose-headings:text-deep-brown prose-p:text-deep-brown/80"
            dangerouslySetInnerHTML={{ __html: sanitizedHtml }} 
        />
    );
}; 