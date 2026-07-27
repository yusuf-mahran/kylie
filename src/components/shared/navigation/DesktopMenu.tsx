import Anchor from '@/components/ui/Anchor';

type NavItem = {
  label: string;
  href: string;
};

type NavMenuProps = {
  items: NavItem[];
};

export default function DesktopMenu({ items }: NavMenuProps) {
  return (
    <nav className="hidden md:flex items-center gap-5">
      {items.map((item) => (
        <Anchor key={item.href} href={item.href} size="md">
          {item.label}
        </Anchor>
      ))}
    </nav>
  );
}
