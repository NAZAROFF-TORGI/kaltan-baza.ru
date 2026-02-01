
import { useState } from "react";
import { Checkbox } from "@/components/ui/checkbox";

interface UserAgreementProps {
  checked: boolean;
  onCheckedChange: (checked: boolean) => void;
}

export function UserAgreement({ checked, onCheckedChange }: UserAgreementProps) {
  return (
    <div className="flex items-start space-x-2">
      <Checkbox
        id="user-agreement"
        checked={checked}
        onCheckedChange={onCheckedChange}
        className="mt-1"
      />
      <label
        htmlFor="user-agreement"
        className="text-sm text-white/90 leading-relaxed cursor-pointer"
      >
        Я согласен с{" "}
        <a
          href="/attached_assets/user-agreement.txt"
          target="_blank"
          rel="noopener noreferrer"
          className="text-accent underline hover:text-accent/80"
        >
          пользовательским соглашением
        </a>{" "}
        и даю согласие на обработку персональных данных
      </label>
    </div>
  );
}
