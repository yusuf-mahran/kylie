"use client";

import { useLocale } from "next-intl";
import { useEffect } from "react";

export function RTLProvider({ children }: { children: React.ReactNode }) {
  const locale = useLocale();
  const dir = locale === "ar" ? "rtl" : "ltr";

  useEffect(() => {
    document.documentElement.dir = dir;
    document.documentElement.lang = locale;
  }, [dir, locale]);

  return <div dir={dir}>{children}</div>;
}
