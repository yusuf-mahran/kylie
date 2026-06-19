import { useTranslations } from "next-intl";
import { Heading, Subheading, BodyText, Caption } from "@/components/shared/typography";
import { BrandButton } from "@/components/shared/brand-button";
import { BrandBadge } from "@/components/shared/brand-badge";
import { SectionWrapper } from "@/components/shared/section-wrapper";

export default function StyleGuidePage() {
  const t = useTranslations();

  return (
    <SectionWrapper>
      <div className="flex flex-col gap-12">
        {/* Typography */}
        <SectionWrapper padded={false} contained={false}>
          <Heading size="3xl" className="mb-8">
            {t("Common.siteName")} — Style Guide
          </Heading>

          <div className="flex flex-col gap-6">
            <div>
              <Heading as="h1" size="4xl">
                Heading 4xl ({t("HomePage.title")})
              </Heading>
              <Heading as="h2" size="3xl">
                Heading 3xl ({t("HomePage.title")})
              </Heading>
              <Heading as="h3" size="2xl">
                Heading 2xl ({t("HomePage.title")})
              </Heading>
              <Heading as="h4" size="xl">
                Heading xl ({t("HomePage.title")})
              </Heading>
            </div>

            <div>
              <Subheading as="h2" size="2xl">
                Subheading 2xl ({t("HomePage.subtitle")})
              </Subheading>
              <Subheading as="h3" size="xl">
                Subheading xl ({t("HomePage.subtitle")})
              </Subheading>
              <Subheading as="h4" size="lg">
                Subheading lg ({t("HomePage.subtitle")})
              </Subheading>
            </div>

            <div>
              <BodyText size="lg">{t("HomePage.description")}</BodyText>
              <BodyText size="base">{t("HomePage.description")}</BodyText>
              <BodyText size="sm">{t("HomePage.description")}</BodyText>
              <BodyText muted>{t("HomePage.description")} (muted)</BodyText>
            </div>

            <div>
              <Caption>{t("Common.loading")}</Caption>
              <br />
              <Caption muted>{t("Common.loading")} (muted)</Caption>
            </div>
          </div>
        </SectionWrapper>

        {/* Buttons */}
        <SectionWrapper padded={false} contained={false}>
          <Heading size="2xl" className="mb-6">
            {t("Common.shop")} — Buttons
          </Heading>

          <div className="flex flex-wrap items-center gap-4">
            <BrandButton variant="primary">{t("HomePage.cta")}</BrandButton>
            <BrandButton variant="secondary">{t("HomePage.cta")}</BrandButton>
            <BrandButton variant="ghost">{t("HomePage.cta")}</BrandButton>
          </div>

          <div className="mt-4 flex flex-wrap items-center gap-4">
            <BrandButton size="sm">{t("HomePage.cta")}</BrandButton>
            <BrandButton size="default">{t("HomePage.cta")}</BrandButton>
            <BrandButton size="lg">{t("HomePage.cta")}</BrandButton>
          </div>
        </SectionWrapper>

        {/* Badges */}
        <SectionWrapper padded={false} contained={false}>
          <Heading size="2xl" className="mb-6">
            {t("Common.favorites")} — Badges
          </Heading>

          <div className="flex flex-wrap items-center gap-4">
            <BrandBadge variant="new">{t("Badges.new")}</BrandBadge>
            <BrandBadge variant="offer">{t("Badges.offer")}</BrandBadge>
            <BrandBadge variant="bestSeller">{t("Badges.bestSeller")}</BrandBadge>
          </div>
        </SectionWrapper>
      </div>
    </SectionWrapper>
  );
}
