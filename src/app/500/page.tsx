import ErrorPageScaffold from "@/shared/components/ErrorPageScaffold";
import { useTranslations } from "next-intl";

export default function InternalServerErrorPage() {
  const t = useTranslations("publicSystem");

  return (
    <ErrorPageScaffold
      code="500"
      icon="warning"
      title={t("statusPages.500.title")}
      description={t("statusPages.500.description")}
      suggestions={[
        t("statusPages.500.suggestion1"),
        t("statusPages.500.suggestion2"),
        t("statusPages.500.suggestion3"),
      ]}
      primaryAction={{ href: "/admin/health", label: t("statusPages.500.primaryAction") }}
      secondaryAction={{ href: "/admin/logs", label: t("statusPages.500.secondaryAction") }}
    />
  );
}
