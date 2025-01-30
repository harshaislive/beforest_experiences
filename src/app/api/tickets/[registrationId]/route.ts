import { createClient } from '@supabase/supabase-js';
import { jsPDF } from 'jspdf';
import { NextResponse } from 'next/server';
import QRCode from 'qrcode';
import path from 'path';
import fs from 'fs';

const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_KEY!
);

export async function GET(
    request: Request,
    { params }: { params: { registrationId: string } }
) {
    try {
        // Fetch registration details with expanded ticket and food item details
        const { data: registration, error } = await supabase
            .from('registrations')
            .select(`
                *,
                events (
                    title,
                    start_date,
                    location: locations (
                        name
                    ),
                    event_pricing (
                        id,
                        category,
                        price
                    ),
                    event_food_options (
                        id,
                        name,
                        price
                    )
                ),
                booking_details,
                payment_transactions (
                    transaction_id
                )
            `)
            .eq('id', params.registrationId)
            .single();

        if (error || !registration) {
            console.error('Registration fetch error:', error);
            return new NextResponse('Registration not found', { status: 404 });
        }

        // Generate QR Code with confirmation page URL
        const confirmationUrl = `${process.env.NEXT_PUBLIC_APP_URL}/payment/success?id=${registration.id}`;
        const qrCodeData = await QRCode.toDataURL(confirmationUrl);

        // Create PDF document
        const doc = new jsPDF({
            orientation: 'portrait',
            unit: 'mm',
            format: 'a4'
        });

        // Set response headers
        const headers = new Headers();
        headers.set('Content-Type', 'application/pdf');
        headers.set(
            'Content-Disposition',
            `attachment; filename="Beforest-Ticket-${registration.id}.pdf"`
        );

        // Load Beforest logo (base64)
        const logoPath = path.join(process.cwd(), 'public', 'images', 'logo-black.png');
        let logoBase64 = '';
        if (fs.existsSync(logoPath)) {
            const logoBuffer = fs.readFileSync(logoPath);
            logoBase64 = `data:image/png;base64,${logoBuffer.toString('base64')}`;
        }

        // Header section with gradient-like effect
        doc.setFillColor(26, 32, 44); // Dark blue
        doc.rect(0, 0, 210, 50, 'F');

        // Add logo if available
        if (logoBase64) {
            doc.addImage(logoBase64, 'PNG', 20, 10, 30, 30);
        }

        // Event title
        doc.setTextColor(255, 255, 255);
        doc.setFontSize(20);
        doc.text(registration.events.title, 60, 30);

        // Main content
        doc.setTextColor(26, 32, 44);
        let y = 60;

        // Event Details
        doc.setFillColor(249, 250, 251);
        doc.roundedRect(15, y, 180, 45, 3, 3, 'F');
        doc.setFontSize(16);
        doc.setTextColor(44, 82, 130);
        doc.text('Event Details', 25, y + 12);
        doc.setFontSize(11);
        doc.setTextColor(26, 32, 44);
        doc.text(`Date: ${new Date(registration.events.start_date).toLocaleDateString('en-IN', {
            weekday: 'long',
            day: 'numeric',
            month: 'long',
            year: 'numeric'
        })}`, 25, y + 22);
        doc.text(`Time: ${new Date(registration.events.start_date).toLocaleTimeString('en-IN', {
            hour: '2-digit',
            minute: '2-digit',
            hour12: true
        })}`, 25, y + 32);
        doc.text(`Venue: ${registration.events.location.name}`, 25, y + 42);

        // Attendee Information and QR Code side by side
        y += 55;
        
        // Left side: Attendee Info
        doc.setFillColor(249, 250, 251);
        doc.roundedRect(15, y, 85, 55, 3, 3, 'F');
        doc.setFontSize(16);
        doc.setTextColor(44, 82, 130);
        doc.text('Attendee', 25, y + 12);
        doc.setFontSize(11);
        doc.setTextColor(26, 32, 44);
        doc.text(`Name: ${registration.booking_details?.personal_info?.full_name}`, 25, y + 22);
        doc.text(`Email: ${registration.booking_details?.personal_info?.email}`, 25, y + 32);
        doc.text(`Phone: ${registration.booking_details?.personal_info?.phone}`, 25, y + 42);

        // Right side: QR Code
        doc.setFillColor(249, 250, 251);
        doc.roundedRect(110, y, 85, 55, 3, 3, 'F');
        doc.addImage(qrCodeData, 'PNG', 127.5, y + 5, 45, 45);
        doc.setFontSize(9);
        doc.text('Scan to verify ticket', 152.5, y + 52, { align: 'center' });

        // Booking Details
        y += 65;
        doc.setFillColor(249, 250, 251);
        doc.roundedRect(15, y, 180, 60, 3, 3, 'F');
        doc.setFontSize(16);
        doc.setTextColor(44, 82, 130);
        doc.text('Booking Details', 25, y + 12);
        doc.setFontSize(11);
        doc.setTextColor(26, 32, 44);
        let detailsY = y + 22;

        // Tickets with proper category names
        if (registration.booking_details?.tickets) {
            doc.text('Tickets:', 25, detailsY);
            detailsY += 8;
            registration.booking_details.tickets.forEach((ticket: any) => {
                const ticketType = registration.events.event_pricing.find((p: any) => p.id === ticket.id);
                doc.text(`• ${ticket.quantity}x ${ticketType?.category || 'Standard Ticket'}`, 30, detailsY);
                detailsY += 6;
            });
        }

        // Food Items with proper names
        if (registration.booking_details?.food_items) {
            detailsY += 3;
            doc.text('Food Items:', 25, detailsY);
            detailsY += 8;
            registration.booking_details.food_items.forEach((item: any) => {
                const foodItem = registration.events.event_food_options.find((f: any) => f.id === item.id);
                doc.text(`• ${item.quantity}x ${foodItem?.name || 'Food Item'}`, 30, detailsY);
                detailsY += 6;
            });
        }

        // Payment Information
        y = detailsY + 10;
        doc.setFillColor(249, 250, 251);
        doc.roundedRect(15, y, 180, 30, 3, 3, 'F');
        doc.setFontSize(16);
        doc.setTextColor(44, 82, 130);
        doc.text('Payment Information', 25, y + 12);
        doc.setFontSize(11);
        doc.setTextColor(26, 32, 44);
        doc.text(`Amount Paid: ₹${registration.total_amount.toLocaleString('en-IN')}`, 25, y + 22);

        // Footer
        doc.setFillColor(26, 32, 44);
        doc.rect(0, 297 - 20, 210, 20, 'F');
        doc.setTextColor(255, 255, 255);
        doc.setFontSize(9);
        doc.text('Please present this ticket at the event entrance.', 105, 297 - 12, { align: 'center' });
        doc.text('For support reach out connect@beforest.co', 105, 297 - 5, { align: 'center' });

        // Return the PDF
        const pdfOutput = doc.output('arraybuffer');
        return new NextResponse(pdfOutput, { headers });
    } catch (error) {
        console.error('Error generating ticket:', error);
        return new NextResponse('Error generating ticket', { status: 500 });
    }
} 