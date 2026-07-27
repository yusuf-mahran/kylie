import FullBg from '@/components/ui/FullBg';
import HugeLogo from '@/components/ui/HugeLogo';
import { getTranslations } from 'next-intl/server';
import { Typography } from '@/components/ui/Typography';
import Btn from '@/components/ui/Btn';
import {
  Facebook,
  Instagram,
  LocationOnOutlined,
  PhoneOutlined,
  X,
  YouTube,
} from '@mui/icons-material';
import Anchor from '@/components/ui/Anchor';

export default async function Footer() {
  const tFooter = await getTranslations('Footer');
  const contactLinks = tFooter.raw('contact') as {
    label: string;
    icon: string;
    href: string;
  }[];

  const socialMedia = contactLinks.filter(
    (link) => !['phone', 'location'].includes(link.icon),
  );

  const footerNav = tFooter.raw('additionalLinks') as {
    label: string;
    href: string;
  }[];

  return (
    <footer className="relative mt-50 pt-6 text-white">
      <FullBg className="bg-primary-500 rounded-t-default" />

      <div className="w-full flex max-lg:flex-col justify-between items-start gap-6">
        <div className="w-full max-w-120 max-lg:mx-auto flex flex-col gap-4">
          <Typography variant="h3" as="h2">
            {tFooter('mailText')}
          </Typography>
          <form className="w-full h-7 border-2 border-border rounded-default flex justify-between items-center p-1 gap-2">
            <input
              type="email"
              name="email"
              placeholder="Enter your E-mail..."
              className="inline-block w-full h-full rounded-xl"
            />
            <Btn variant="secondary" className="shrink-0">
              {tFooter('mailCta')}
            </Btn>
          </form>
          <nav className="w-full flex lg:justify-start justify-center items-center gap-3 ms-2">
            {socialMedia.map((link, index) => (
              <Anchor key={index} href={link.href} title={link.label}>
                {link.icon === 'facebook' && <Facebook />}
                {link.icon === 'instagram' && <Instagram />}
                {link.icon === 'youtube' && <YouTube />}
                {link.icon === 'x' && <X />}
                <span className="sr-only">{link.label}</span>
              </Anchor>
            ))}
          </nav>
        </div>

        <div className="w-full flex max-sm:flex-wrap justify-between items-start lg:gap-8 sm:gap-12 gap-2 sm:max-w-150 max-w-80 max-lg:mx-auto">
          <nav className="max-sm:w-1/3 flex flex-col justify-start items-center gap-2 max-w-60">
            {footerNav
              .slice(0, Math.ceil(footerNav.length / 2))
              .map((link, index) => (
                <Anchor
                  key={index}
                  href={link.href}
                  className="text-start w-full"
                >
                  {link.label}
                </Anchor>
              ))}
          </nav>
          <nav className="max-sm:w-1/3 flex flex-col justify-start items-center gap-2 max-w-60">
            {footerNav
              .slice(Math.ceil(footerNav.length / 2))
              .map((link, index) => (
                <Anchor
                  key={index}
                  href={link.href}
                  className="text-start w-full"
                >
                  {link.label}
                </Anchor>
              ))}
          </nav>
          <nav className="flex flex-col sm:justify-start justify-center items-center gap-2 min-w-60 max-w-60 max-sm:mt-4 max-sm:mx-auto">
            {contactLinks.map((link, index) => {
              if (!['phone', 'location'].includes(link.icon)) return;

              return (
                <div
                  key={index}
                  className="w-full flex sm:justify-start justify-center items-start gap-2"
                >
                  {link.icon === 'phone' ? (
                    <PhoneOutlined />
                  ) : (
                    <LocationOnOutlined />
                  )}
                  <Anchor href={link?.href}>{link.label}</Anchor>
                </div>
              );
            })}
          </nav>
        </div>
      </div>

      <HugeLogo />
    </footer>
  );
}
