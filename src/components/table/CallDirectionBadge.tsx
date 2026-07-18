import { ArrowDownLeft, ArrowUpRight } from "lucide-react";
import { Badge } from "@/components/ui/badge";

export function CallDirectionBadge({ isInbound }: { isInbound: boolean }) {
  return (
    <Badge variant="outline">
      {isInbound ? <ArrowDownLeft /> : <ArrowUpRight />}
      {isInbound ? "Inbound" : "Outbound"}
    </Badge>
  );
}
