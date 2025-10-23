import { Shield, Clock } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

interface CoverageStatusCardProps {
  status?: 'active' | 'pending' | 'inactive';
  policyType?: string;
  coverageAmount?: string;
  validUntil?: string;
  showingsRemaining?: string;
}

export default function CoverageStatusCard({
  status = 'active',
  policyType = 'Annual Coverage',
  coverageAmount = '$1,000,000',
  validUntil = '2025-12-31',
  showingsRemaining = 'Unlimited'
}: CoverageStatusCardProps) {
  const statusConfig = {
    active: {
      borderColor: 'border-l-green-500',
      badgeVariant: 'default' as const,
      badgeClasses: 'bg-green-100 text-green-800 hover:bg-green-100',
      icon: <Shield className="w-5 h-5 text-green-500" />,
      label: 'Active'
    },
    pending: {
      borderColor: 'border-l-amber-500',
      badgeVariant: 'secondary' as const,
      badgeClasses: 'bg-amber-100 text-amber-800 hover:bg-amber-100',
      icon: <Clock className="w-5 h-5 text-amber-500" />,
      label: 'Pending'
    },
    inactive: {
      borderColor: 'border-l-gray-300',
      badgeVariant: 'outline' as const,
      badgeClasses: 'bg-gray-100 text-gray-800 hover:bg-gray-100',
      icon: <Shield className="w-5 h-5 text-gray-400" />,
      label: 'Inactive'
    }
  };

  const config = statusConfig[status];

  return (
    <Card
      className={`border-l-4 ${config.borderColor}`}
      role="region"
      aria-label="Coverage status"
    >
      <CardHeader>
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-2">
            {config.icon}
            <CardTitle className="text-xl">Coverage Status</CardTitle>
          </div>
          <Badge variant={config.badgeVariant} className={config.badgeClasses}>
            {config.label}
          </Badge>
        </div>
      </CardHeader>
      <CardContent>
        <dl className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          <div>
            <dt className="text-sm text-muted-foreground mb-1">Policy Type</dt>
            <dd className="text-base font-semibold">{policyType}</dd>
          </div>
          <div>
            <dt className="text-sm text-muted-foreground mb-1">Coverage Amount</dt>
            <dd className="text-base font-semibold">{coverageAmount}</dd>
          </div>
          <div>
            <dt className="text-sm text-muted-foreground mb-1">Valid Until</dt>
            <dd className="text-base font-semibold">
              {new Date(validUntil).toLocaleDateString('en-US', {
                year: 'numeric',
                month: 'short',
                day: 'numeric'
              })}
            </dd>
          </div>
          <div>
            <dt className="text-sm text-muted-foreground mb-1">Showings Remaining</dt>
            <dd className="text-base font-semibold">{showingsRemaining}</dd>
          </div>
        </dl>
      </CardContent>
    </Card>
  );
}
