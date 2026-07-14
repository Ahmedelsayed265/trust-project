import { cn } from "@/lib/utils";

export function ChangeIndicator({
  value,
  positive,
  className,
}: {
  value: string;
  positive?: boolean;
  className?: string;
}) {
  return (
    <span
      className={cn(
        "font-semibold",
        positive === false ? "text-destructive" : "text-success",
        className
      )}
    >
      {value}
    </span>
  );
}
