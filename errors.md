Mudumba@Mudumba MINGW64 /f/Important/perfectly_stable (master)
$ npm run check

> for_events@0.1.0 check
> npm run type-check && npm run lint


> for_events@0.1.0 type-check
> tsc --noEmit

src/app/(routes)/events/[slug]/BookingForm.tsx:41:17 - error TS2322: Type '{ isOpen: boolean; onClose: () => void; eventId: string; eventTitle: string; pricingOptions: { id: string; category: string; price: number; description: string; max_quantity: number; }[]; foodOptions: { ...; }[]; }' is not assignable to type 'IntrinsicAttributes & BookingModalProps'.
  Property 'eventId' does not exist on type 'IntrinsicAttributes & BookingModalProps'. Did you mean 'event'?

41                 eventId={event.id}
                   ~~~~~~~

src/app/(routes)/events/[slug]/EventPageClient.tsx:59:56 - error TS2339: Property 'itinerary' does not exist on type 'Event'.

59   console.log('Event Itinerary:', JSON.stringify(event.itinerary, null, 2));
                                                          ~~~~~~~~~

src/app/(routes)/events/[slug]/EventPageClient.tsx:87:29 - error TS2339: Property 'itinerary' does not exist on type 'Event'.

87             schedule={event.itinerary?.map(item => ({
                               ~~~~~~~~~

src/app/(routes)/events/[slug]/EventPageClient.tsx:87:44 - error TS7006: Parameter 'item' implicitly has an 'any' type.

87             schedule={event.itinerary?.map(item => ({
                                              ~~~~

src/app/(routes)/events/[slug]/EventPageClient.tsx:104:9 - error TS2739: Type 'Event' is missing the following properties from type 'Event': slug, status, is_featured  

104         event={event}
            ~~~~~

  src/components/global/Events/BookingModal.tsx:37:5
    37     event: Event;
           ~~~~~
    The expected type comes from property 'event' which is declared here on type 'IntrinsicAttributes & BookingModalProps'

src/app/api/webhooks/payments/[id]/route.ts:48:52 - error TS2339: Property 'verifyPayment' does not exist on type 'PhonepeGateway'.

48         const verificationResponse = await gateway.verifyPayment(payload);
                                                      ~~~~~~~~~~~~~

src/components/global/TemplateRenderer.tsx:24:50 - error TS2345: Argument of type 'string | Promise<string>' is not assignable to parameter of type 'string | Node'.    
  Type 'Promise<string>' is not assignable to type 'string | Node'.

24         const sanitizedHtml = DOMPurify.sanitize(htmlContent);
                                                    ~~~~~~~~~~~


Found 7 errors in 4 files.

Errors  Files
     1  src/app/(routes)/events/[slug]/BookingForm.tsx:41
     4  src/app/(routes)/events/[slug]/EventPageClient.tsx:59
     1  src/app/api/webhooks/payments/[id]/route.ts:48
     1  src/components/global/TemplateRenderer.tsx:24