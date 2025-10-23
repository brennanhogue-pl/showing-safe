import { Shield, MapPin, Calendar, DollarSign, MoreVertical, FileText } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Button } from '@/components/ui/button';
import FileClaimDialog from '@/components/FileClaimDialog';

interface Policy {
  id: string;
  property_address: string;
  coverage_type: string;
  status: 'active' | 'pending' | 'expired';
  created_at: string;
}

interface PoliciesListProps {
  policies: Policy[];
}

export default function PoliciesList({ policies }: PoliciesListProps) {
  const statusConfig = {
    active: {
      badgeClasses: 'bg-green-100 text-green-800 hover:bg-green-100',
      label: 'Active'
    },
    pending: {
      badgeClasses: 'bg-amber-100 text-amber-800 hover:bg-amber-100',
      label: 'Pending'
    },
    expired: {
      badgeClasses: 'bg-gray-100 text-gray-800 hover:bg-gray-100',
      label: 'Expired'
    }
  };

  const calculateExpiryDate = (createdAt: string) => {
    const created = new Date(createdAt);
    const expiry = new Date(created);
    expiry.setDate(expiry.getDate() + 90); // 90 days from creation
    return expiry;
  };

  const formatDate = (date: Date) => {
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  if (policies.length === 0) {
    return (
      <Card>
        <CardContent className="flex flex-col items-center justify-center py-12">
          <Shield className="w-12 h-12 text-muted-foreground mb-3" />
          <p className="text-muted-foreground text-center">No policies found</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-4">
      {policies.map((policy) => {
        const expiryDate = calculateExpiryDate(policy.created_at);
        const isExpired = expiryDate < new Date();
        const actualStatus = isExpired ? 'expired' : policy.status;
        const actualConfig = statusConfig[actualStatus];

        return (
          <Card key={policy.id} className="hover:shadow-md transition-shadow">
            <CardContent className="p-6">
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-blue-100 rounded-lg">
                    <Shield className="w-5 h-5 text-blue-600" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-lg">
                      {policy.coverage_type === 'single' ? 'Single-Use Policy' : 'Subscription Policy'}
                    </h3>
                    <p className="text-sm text-muted-foreground">
                      Policy ID: {policy.id.slice(0, 8)}...
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Badge className={actualConfig.badgeClasses}>
                    {actualConfig.label}
                  </Badge>

                  {/* Actions Dropdown */}
                  {actualStatus === 'active' && (
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                          <MoreVertical className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <FileClaimDialog
                          policyId={policy.id}
                          trigger={
                            <DropdownMenuItem onSelect={(e) => e.preventDefault()}>
                              <FileText className="mr-2 h-4 w-4" />
                              File Claim
                            </DropdownMenuItem>
                          }
                        />
                      </DropdownMenuContent>
                    </DropdownMenu>
                  )}
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="flex items-start gap-2">
                  <MapPin className="w-4 h-4 text-muted-foreground mt-0.5 flex-shrink-0" />
                  <div>
                    <dt className="text-xs text-muted-foreground mb-0.5">Property Address</dt>
                    <dd className="text-sm font-medium">{policy.property_address}</dd>
                  </div>
                </div>

                <div className="flex items-start gap-2">
                  <DollarSign className="w-4 h-4 text-muted-foreground mt-0.5 flex-shrink-0" />
                  <div>
                    <dt className="text-xs text-muted-foreground mb-0.5">Coverage Amount</dt>
                    <dd className="text-sm font-medium">Up to $1,000</dd>
                  </div>
                </div>

                <div className="flex items-start gap-2">
                  <Calendar className="w-4 h-4 text-muted-foreground mt-0.5 flex-shrink-0" />
                  <div>
                    <dt className="text-xs text-muted-foreground mb-0.5">Valid Until</dt>
                    <dd className="text-sm font-medium">{formatDate(expiryDate)}</dd>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
}
