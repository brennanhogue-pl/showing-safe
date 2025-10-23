import Link from 'next/link';
import { ArrowRight, FileText } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';

interface Claim {
  id: string;
  property: string;
  dateFiled: string;
  status: 'pending' | 'approved' | 'denied' | 'under-review';
  amount: string;
}

interface RecentClaimsSectionProps {
  claims?: Claim[];
}

const mockClaims: Claim[] = [
  {
    id: 'CLM-1234',
    property: '123 Main Street, Salt Lake City, UT',
    dateFiled: '2025-10-12',
    status: 'pending',
    amount: '$2,500'
  },
  {
    id: 'CLM-1233',
    property: '456 Oak Avenue, Salt Lake City, UT',
    dateFiled: '2025-10-08',
    status: 'approved',
    amount: '$3,200'
  },
  {
    id: 'CLM-1232',
    property: '789 Elm Drive, Salt Lake City, UT',
    dateFiled: '2025-10-01',
    status: 'approved',
    amount: '$1,800'
  }
];

const statusConfig = {
  pending: {
    variant: 'secondary' as const,
    classes: 'bg-amber-100 text-amber-800 hover:bg-amber-100',
    label: 'Pending',
    borderColor: 'border-l-amber-500'
  },
  approved: {
    variant: 'default' as const,
    classes: 'bg-green-100 text-green-800 hover:bg-green-100',
    label: 'Approved',
    borderColor: 'border-l-green-500'
  },
  denied: {
    variant: 'destructive' as const,
    classes: 'bg-red-100 text-red-800 hover:bg-red-100',
    label: 'Denied',
    borderColor: 'border-l-red-500'
  },
  'under-review': {
    variant: 'outline' as const,
    classes: 'bg-blue-100 text-blue-800 hover:bg-blue-100',
    label: 'Under Review',
    borderColor: 'border-l-blue-500'
  }
};

function StatusBadge({ status }: { status: Claim['status'] }) {
  const config = statusConfig[status];
  return (
    <Badge variant={config.variant} className={config.classes}>
      {config.label}
    </Badge>
  );
}

export default function RecentClaimsSection({ claims = mockClaims }: RecentClaimsSectionProps) {
  // Empty state
  if (!claims || claims.length === 0) {
    return (
      <section>
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-semibold">Recent Claims</h2>
        </div>
        <Card>
          <CardContent className="p-12 text-center">
            <FileText className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
            <p className="text-base mb-2">No claims filed yet</p>
            <p className="text-sm text-muted-foreground">
              When you file a claim, it will appear here
            </p>
          </CardContent>
        </Card>
      </section>
    );
  }

  return (
    <section>
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-semibold">Recent Claims</h2>
        <Button variant="ghost" size="sm" asChild>
          <Link href="/claims" className="flex items-center gap-1">
            View All
            <ArrowRight className="w-4 h-4" />
          </Link>
        </Button>
      </div>

      {/* Desktop Table View */}
      <Card className="hidden md:block">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Claim ID</TableHead>
              <TableHead>Property</TableHead>
              <TableHead>Date Filed</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Amount</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {claims.map((claim) => (
              <TableRow key={claim.id}>
                <TableCell className="font-medium">{claim.id}</TableCell>
                <TableCell>{claim.property}</TableCell>
                <TableCell>
                  {new Date(claim.dateFiled).toLocaleDateString('en-US', {
                    month: 'short',
                    day: 'numeric'
                  })}
                </TableCell>
                <TableCell>
                  <StatusBadge status={claim.status} />
                </TableCell>
                <TableCell className="font-semibold">{claim.amount}</TableCell>
                <TableCell className="text-right">
                  <Button variant="ghost" size="sm" asChild>
                    <Link href={`/claims/${claim.id}`}>View</Link>
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </Card>

      {/* Mobile Card View */}
      <div className="block md:hidden space-y-4">
        {claims.map((claim) => {
          const config = statusConfig[claim.status];
          return (
            <Link key={claim.id} href={`/claims/${claim.id}`}>
              <Card className={`border-l-4 ${config.borderColor} cursor-pointer hover:shadow-md transition-shadow`}>
                <CardHeader className="pb-3">
                  <div className="flex items-start justify-between">
                    <CardTitle className="text-sm font-medium">{claim.id}</CardTitle>
                    <StatusBadge status={claim.status} />
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground mb-3">{claim.property}</p>
                  <div className="flex items-center justify-between text-xs text-muted-foreground">
                    <span>
                      {new Date(claim.dateFiled).toLocaleDateString('en-US', {
                        month: 'short',
                        day: 'numeric',
                        year: 'numeric'
                      })}
                    </span>
                    <span className="font-semibold text-foreground">{claim.amount}</span>
                  </div>
                </CardContent>
              </Card>
            </Link>
          );
        })}
      </div>
    </section>
  );
}
