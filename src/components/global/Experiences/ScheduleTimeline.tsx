import { EventItinerary } from '@/lib/types';

interface ScheduleTimelineProps {
    itinerary?: EventItinerary[];
}

export default function ScheduleTimeline({ itinerary = [] }: ScheduleTimelineProps) {
    if (!itinerary || itinerary.length === 0) {
        return null;
    }

    // Sort itinerary by order if available
    const sortedItinerary = [...itinerary].sort((a, b) => (a.order || 0) - (b.order || 0));

    return (
        <div className="space-y-8">
            {sortedItinerary.map((item) => (
                <div key={item.id} className="flex gap-6">
                    <div className="w-24 flex-shrink-0 text-deep-brown/70">
                        {/* Format time to be more readable */}
                        {new Date(`2000-01-01T${item.time}`).toLocaleTimeString('en-US', {
                            hour: 'numeric',
                            minute: '2-digit',
                            hour12: true
                        })}
                    </div>
                    <div>
                        <h3 className="text-lg font-medium text-deep-brown mb-2">
                            {item.activity}
                        </h3>
                        {item.description && (
                            <p className="text-deep-brown/70">
                                {item.description}
                            </p>
                        )}
                        {item.duration && (
                            <p className="text-sm text-deep-brown/50 mt-1">
                                Duration: {item.duration.replace(':', 'h ')}m
                            </p>
                        )}
                    </div>
                </div>
            ))}
        </div>
    );
}