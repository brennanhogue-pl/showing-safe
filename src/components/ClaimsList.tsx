import { FileText, Calendar, MapPin, AlertCircle } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Claim } from '@/types';

interface ClaimsListProps {
  claims: Claim[];
}

export default function ClaimsList({ claims }: ClaimsListProps) {
  const statusConfig = {
    pending: {
      badgeClasses: 'bg-amber-100 text-amber-800 hover:bg-amber-100',
      label: 'Pending Review'
    },
    approved: {
      badgeClasses: 'bg-green-100 text-green-800 hover:bg-green-100',
      label: 'Approved'
    },
    denied: {
      badgeClasses: 'bg-red-100 text-red-800 hover:bg-red-100',
      label: 'Denied'
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  if (claims.length === 0) {
    return (
      <Card>
        <CardContent className="flex flex-col items-center justify-center py-12">
          <FileText className="w-12 h-12 text-muted-foreground mb-3" />
          <p className="text-muted-foreground text-center">No claims found</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-4">
      {claims.map((claim) => {
        const config = statusConfig[claim.status];

        return (
          <Card key={claim.id} className="hover:shadow-md transition-shadow">
            <CardContent className="p-6">
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-blue-100 rounded-lg">
                    <FileText className="w-5 h-5 text-blue-600" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-lg">
                      Claim #{claim.id.slice(0, 8)}
                    </h3>
                    <p className="text-sm text-muted-foreground">
                      Submitted {formatDate(claim.created_at)}
                    </p>
                  </div>
                </div>
                <Badge className={config.badgeClasses}>
                  {config.label}
                </Badge>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                <div className="flex items-start gap-2">
                  <MapPin className="w-4 h-4 text-muted-foreground mt-0.5 flex-shrink-0" />
                  <div>
                    <dt className="text-xs text-muted-foreground mb-0.5">Property</dt>
                    <dd className="text-sm font-medium">
                      {claim.policies?.property_address || 'N/A'}
                    </dd>
                  </div>
                </div>

                <div className="flex items-start gap-2">
                  <Calendar className="w-4 h-4 text-muted-foreground mt-0.5 flex-shrink-0" />
                  <div>
                    <dt className="text-xs text-muted-foreground mb-0.5">Incident Date</dt>
                    <dd className="text-sm font-medium">
                      {formatDate(claim.incident_date)}
                    </dd>
                  </div>
                </div>

                <div className="flex items-start gap-2">
                  <AlertCircle className="w-4 h-4 text-muted-foreground mt-0.5 flex-shrink-0" />
                  <div>
                    <dt className="text-xs text-muted-foreground mb-0.5">Damaged Items</dt>
                    <dd className="text-sm font-medium">{claim.damaged_items}</dd>
                  </div>
                </div>

                <div className="flex items-start gap-2">
                  <FileText className="w-4 h-4 text-muted-foreground mt-0.5 flex-shrink-0" />
                  <div>
                    <dt className="text-xs text-muted-foreground mb-0.5">Showing #</dt>
                    <dd className="text-sm font-medium font-mono">
                      {claim.supra_showing_number}
                    </dd>
                  </div>
                </div>
              </div>

              <div className="border-t pt-3">
                <dt className="text-xs text-muted-foreground mb-1">Description</dt>
                <dd className="text-sm text-gray-700">{claim.description}</dd>
              </div>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
}
