import { CheckCircle2, XCircle } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

export function CallStatusBadge({ isSuccessful }: { isSuccessful: boolean }) {
  if (isSuccessful) {
    return (
      <Badge className={cn("border-transparent bg-good/10 text-good")}>
        <CheckCircle2 />
        Successful
      </Badge>
    );
  }

  return (
    <Badge variant="destructive">
      <XCircle />
      Failed
    </Badge>
  );
}
