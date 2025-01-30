'use client';

import ReactMarkdown from 'react-markdown';
import rehypeRaw from 'rehype-raw';
import { motion } from 'framer-motion';

export interface TemplateRendererProps {
    content: string;
}

const item = {
    hidden: { opacity: 0, y: 20 },
    show: { 
        opacity: 1, 
        y: 0,
        transition: {
            ease: [0.25, 0.1, 0.25, 1.0],
            duration: 0.6
        }
    }
};

export default function TemplateRenderer({ content }: TemplateRendererProps) {
    return (
        <motion.div 
            variants={item}
            initial="hidden"
            animate="show"
            className="prose prose-deep-brown max-w-none prose-h2:text-[1.75rem] prose-h2:mb-4 prose-p:text-lg prose-p:leading-relaxed prose-ul:pl-0 prose-li:pl-0"
        >
            <ReactMarkdown 
                rehypePlugins={[rehypeRaw]}
                components={{
                    h2: ({node, ...props}) => (
                        <h2 
                            className="
                                font-semibold mt-12 mb-6 
                                text-deep-brown
                                flex items-center gap-3
                                before:content-[''] before:h-[3px] before:w-8
                                before:bg-terracotta/70
                            " 
                            {...props} 
                        />
                    ),
                    p: ({node, ...props}) => (
                        <p 
                            className="text-lg leading-relaxed mb-6 text-deep-brown/90" 
                            {...props} 
                        />
                    ),
                    ul: ({node, ...props}) => (
                        <ul 
                            className="space-y-3 mb-8 pl-0 list-none" 
                            {...props} 
                        />
                    ),
                    ol: ({node, ...props}) => (
                        <ol 
                            className="space-y-3 mb-8 pl-0 list-decimal counter-reset-item" 
                            {...props} 
                        />
                    ),
                    li: ({node, children, ...props}) => {
                        const parentElement = (node as any)?.parentNode as HTMLElement;
                        const isOrderedList = parentElement?.tagName?.toLowerCase() === 'ol';
                        
                        return (
                            <li 
                                className={`
                                    relative pl-8 py-3 mb-2 
                                    before:absolute before:left-0 before:top-1/2 before:-translate-y-1/2
                                    ${isOrderedList 
                                        ? 'before:content-[counter(item)] before:counter-increment-item before:font-semibold before:text-terracotta before:text-lg before:-translate-x-1'
                                        : 'before:content-[""] before:w-2 before:h-2 before:bg-terracotta before:rounded-full'
                                    }
                                    bg-white/50 backdrop-blur-sm
                                    rounded-lg
                                    shadow-[0_2px_12px_rgba(0,0,0,0.04)]
                                    border border-deep-brown/5
                                    transition-all duration-200
                                    hover:shadow-[0_4px_16px_rgba(0,0,0,0.08)]
                                    hover:-translate-y-[1px]
                                `} 
                                {...props}
                            >
                                {children}
                            </li>
                        );
                    },
                    strong: ({node, ...props}) => (
                        <strong 
                            className="font-semibold text-deep-brown/90" 
                            {...props} 
                        />
                    )
                }}
            >
                {content}
            </ReactMarkdown>
        </motion.div>
    );
}
