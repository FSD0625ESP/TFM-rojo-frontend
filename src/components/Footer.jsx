import { LEGAL_TEXT_RIOT } from "../constants/legal";

export function Footer() {
  return (
    <div className="flex items-center justify-center">
      <p className="text-xs text-center text-muted-foreground px-2 pb-2">
        {LEGAL_TEXT_RIOT}
      </p>
    </div>
  );
}
