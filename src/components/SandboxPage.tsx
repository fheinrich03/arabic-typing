import { ArrowLeftIcon } from "lucide-react";
import { SandboxTyping } from "./SandboxTyping";
import { Button } from "./ui/button";

interface SandboxPageProps {
  fontSizePx: number;
  onBack: () => void;
}

export function SandboxPage({ fontSizePx, onBack }: SandboxPageProps) {
  return (
    <div className="mx-auto max-w-3xl space-y-6">
      <div className="flex items-center justify-between">
        <Button variant="ghost" size="sm" onClick={onBack}>
          <ArrowLeftIcon />
          Übersicht
        </Button>
        <h1 className="font-heading text-base font-medium text-foreground">Sandbox</h1>
        <span className="w-16" />
      </div>

      <SandboxTyping fontSizePx={fontSizePx} variant="standalone" />
    </div>
  );
}
