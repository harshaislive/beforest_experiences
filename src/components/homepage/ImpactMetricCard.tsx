import React from 'react';
import Image from 'next/image';

interface ImpactMetricCardProps {
  metric: {
    id: string;
    category: string;
    value: number;
    unit: string;
    description: string;
    icon_url: string;
    order_index: number;
    is_visible: boolean;
    created_at: string;
    updated_at: string;
  };
}

const ImpactMetricCard: React.FC<ImpactMetricCardProps> = ({ metric }) => {
  return (
    <div className="impact-metric-card">
      <div className="relative w-16 h-16 mb-4">
        <Image
          src={metric.icon_url}
          alt={metric.category}
          fill
          className="object-contain"
          priority
        />
      </div>
      <h3>{metric.category}</h3>
      <p>{metric.value} {metric.unit}</p>
      <p>{metric.description}</p>
    </div>
  );
};

export default ImpactMetricCard;
