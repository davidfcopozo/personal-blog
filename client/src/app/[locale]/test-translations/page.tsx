"use client";

import { useTranslations, useLocale } from "next-intl";

export default function TestTranslations() {
  const t = useTranslations();
  const locale = useLocale();

  return (
    <div
      style={{
        padding: "20px",
        backgroundColor: "#f0f0f0",
        margin: "20px",
        border: "2px solid #333",
      }}
    >
      <h1>Translation Test</h1>
      <p>
        <strong>Current locale:</strong> {locale}
      </p>
      <p>
        <strong>Navigation home:</strong> {t("navigation.home")}
      </p>
      <p>
        <strong>Navigation blog:</strong> {t("navigation.blog")}
      </p>
      <p>
        <strong>Navigation about:</strong> {t("navigation.about")}
      </p>
      <p>
        <strong>Auth signIn:</strong> {t("auth.signIn")}
      </p>
      <p>
        <strong>Language spanish:</strong> {t("language.spanish")}
      </p>
      <p>
        <strong>Language english:</strong> {t("language.english")}
      </p>
      <p>
        <strong>Blog searchPlaceholder:</strong> {t("blog.searchPlaceholder")}
      </p>
      <p>
        <strong>Common loading:</strong> {t("common.loading")}
      </p>
    </div>
  );
}
