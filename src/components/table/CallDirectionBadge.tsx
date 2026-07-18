import { ArrowDownLeft, ArrowUpRight } from "lucide-react";
import { Badge } from "@/components/ui/badge";

export function CallDirectionBadge({ isInbound }: { isInbound: boolean }) {
  return (
    <Badge variant="outline">
      {isInbound ? (
        <ArrowDownLeft aria-hidden="true" />
      ) : (
        <ArrowUpRight aria-hidden="true" />
      )}
      {isInbound ? "Inbound" : "Outbound"}
    </Badge>
  );
}
