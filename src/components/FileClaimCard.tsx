import { FileText, Plus } from 'lucide-react';
import Link from 'next/link';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

export default function FileClaimCard() {
  return (
    <Card className="border-dashed border-2 hover:border-blue-300 hover:bg-blue-50/50 transition-colors">
      <CardContent className="p-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-blue-100 rounded-lg">
              <FileText className="w-6 h-6 text-blue-600" />
            </div>
            <div>
              <h3 className="font-semibold text-base">File a New Claim</h3>
              <p className="text-sm text-muted-foreground">
                Report an incident and start your claim process
              </p>
            </div>
          </div>
          <Button asChild variant="outline" className="gap-2">
            <Link href="/claims/new">
              <Plus className="w-4 h-4" />
              New Claim
            </Link>
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
