import Img from '@/components/ui/Img';
import { Typography } from '@/components/ui/Typography';

type BottomContentProps = {
  percentage: string;
  percentTitle: string;
  flag: string;
  flagText: string;
};

export default function BottomContent({
  percentage,
  percentTitle,
  flag,
  flagText,
}: BottomContentProps) {
  return (
    <>
      <div className="max-md:w-full flex gap-6 md:items-end items-start md:justify-start justify-between md:max-w-96">
        <div className="flex flex-col gap-1">
          <Typography variant="h1" as="p" className="font-heading inline-block">
            {percentage}
          </Typography>
          <Typography variant="h4" as="p" className="inline-block">
            {percentTitle}
          </Typography>
        </div>
        <Typography variant="body2" className="max-md:text-end max-w-52">
          {flag}
        </Typography>
      </div>
      <div className="max-md:w-full flex max-md:flex-row-reverse gap-2 md:justify-end justify-between items-center md:max-w-80">
        <div className="h-14 w-14 shrink-0">
          <Img
            src="/imgs/strawberry_icon.png"
            width={100}
            height={100}
            className="bg-transparent"
          />
        </div>
        <Typography variant="body2" as="p" className="max-w-60">
          {flagText}
        </Typography>
      </div>
    </>
  );
}
