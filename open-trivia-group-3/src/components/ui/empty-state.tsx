// components/ui/empty-state.tsx
// components/ui/empty-state.tsx
import type { LucideIcon } from 'lucide-react';
import { Card, CardContent } from './card';

interface EmptyStateProps {
  icon: LucideIcon;
  title: string;
  description: string;
  action?: React.ReactNode;
}

export function EmptyState({ icon: Icon, title, description, action }: EmptyStateProps) {
  return (
    <Card>
      <CardContent className="text-center py-12">
        <Icon className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
        <h3 className="text-lg font-medium mb-2">{title}</h3>
        <p className="text-muted-foreground mb-6 max-w-sm mx-auto">
          {description}
        </p>
        {action}
      </CardContent>
    </Card>
  );
}