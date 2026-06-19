import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import { Heading, BodyText, Caption } from "@/components/shared/typography";
import { BrandButton } from "@/components/shared/brand-button";
import { BrandBadge } from "@/components/shared/brand-badge";
import { SectionWrapper } from "@/components/shared/section-wrapper";

export default function HomePage() {
  const t = useTranslations();

  return (
    <SectionWrapper>
      <div className="flex flex-col items-center gap-6 text-center">
        <div className="flex flex-wrap items-center justify-center gap-2">
          <BrandBadge variant="new">{t("Badges.new")}</BrandBadge>
          <BrandBadge variant="offer">{t("Badges.offer")}</BrandBadge>
          <BrandBadge variant="bestSeller">{t("Badges.bestSeller")}</BrandBadge>
        </div>

        <Heading as="h1" size="4xl">
          {t("HomePage.title")}
        </Heading>

        <BodyText size="lg" muted>
          {t("HomePage.description")}
        </BodyText>

        <div className="flex flex-wrap items-center justify-center gap-3">
          <BrandButton asChild>
            <Link href="/shop">{t("HomePage.cta")}</Link>
          </BrandButton>
          <BrandButton variant="secondary">{t("HomePage.cta")}</BrandButton>
          <BrandButton variant="ghost">{t("HomePage.cta")}</BrandButton>
        </div>

        <Caption muted>{t("HomePage.subtitle")}</Caption>
      </div>
    </SectionWrapper>
  );
}
