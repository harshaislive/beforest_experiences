interface ScheduleItem {
    time: string;
    title: string;
    description: string;
}

interface ScheduleTimelineProps {
    schedule: ScheduleItem[];
}

export default function ScheduleTimeline({ schedule }: ScheduleTimelineProps) {
    return (
        <div className="space-y-8">
            {schedule.map((item, index) => (
                <div key={index} className="flex gap-6">
                    <div className="w-24 flex-shrink-0 text-deep-brown/70">
                        {item.time}
                    </div>
                    <div>
                        <h3 className="text-lg font-medium text-deep-brown mb-2">
                            {item.title}
                        </h3>
                        <p className="text-deep-brown/70">
                            {item.description}
                        </p>
                    </div>
                </div>
            ))}
        </div>
    );
} 