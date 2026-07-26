import Img from '@/components/ui/Img';
import { Typography } from '@/components/ui/Typography';

type EndContentProps = {
  flag: string;
  headline: string;
};

export default function EndContent({ flag, headline }: EndContentProps) {
  return (
    <div className="md:h-full md:my-auto md:max-h-160 md:col-span-5 flex flex-col justify-between md:items-end items-start py-6 max-md:gap-2">
      <div className="md:w-52 w-20 aspect-square max-w-4/5 max-md:-mt-4 max-md:ms-4">
        <Img
          width={200}
          height={200}
          src="/imgs/skin_care_icon.png"
          className="w-full h-full bg-transparent"
        />
      </div>
      <div className="md:w-1/2 w-full flex flex-col justify-between md:items-end items-start gap-2 md:text-end text-start mb-5">
        <Typography variant="overline">{flag}</Typography>
        <Typography variant="h3" as="p" className="font-heading">
          {headline}
        </Typography>
      </div>
    </div>
  );
}
