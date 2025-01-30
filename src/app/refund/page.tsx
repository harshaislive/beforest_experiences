import { Metadata } from 'next';
import MainLayout from '@/components/layout/MainLayout';

export const metadata: Metadata = {
  title: 'Refund and Cancellation Policy | Beforest',
  description: 'Learn about our refund and cancellation policies at Beforest.',
};

export default function RefundPage() {
  return (
    <MainLayout>
      <div className="max-w-3xl mx-auto px-4 sm:px-6 py-16 lg:py-20">
        <h1 className="text-3xl font-bold text-deep-brown mb-8">Refund and Cancellation Policy</h1>
        <div className="prose prose-deep-brown max-w-none">
          <p>This refund and cancellation policy outlines how you can cancel or seek a refund for a product/service that you have purchased through the Platform. Under this policy:</p>
          
          <ul className="list-disc pl-6 space-y-2">
            <li>The refund credit timeline ranges between 5 working days</li>
            <li>It will be credited to the original payment method used</li>
            <li>In case of any refunds approved by BEFOREST LIFESTYLE SOLUTIONS PVT LTD, it will take 7 days for the refund to be processed to you</li>
          </ul>
        </div>
      </div>
    </MainLayout>
  );
} 
