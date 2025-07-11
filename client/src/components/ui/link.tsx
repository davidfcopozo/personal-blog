"use client";

import { useLocale } from "next-intl";
import NextLink, { LinkProps as NextLinkProps } from "next/link";
import { ReactNode } from "react";
import { createLocalizedPath } from "@/utils/i18n-utils";
import { type Locale } from "@/i18n/config";

interface LinkProps extends Omit<NextLinkProps, "href"> {
  href: string;
  children: ReactNode;
  className?: string;
  locale?: Locale;
}

export function Link({ href, locale, children, ...rest }: LinkProps) {
  const currentLocale = useLocale() as Locale;
  const targetLocale = locale || currentLocale;

  // Create localized path
  const localizedHref = createLocalizedPath(href, targetLocale);

  return (
    <NextLink href={localizedHref} {...rest}>
      {children}
    </NextLink>
  );
}
