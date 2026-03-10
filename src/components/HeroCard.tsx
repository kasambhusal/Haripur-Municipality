import type { LucideIcon } from "lucide-react";
import { Loader2 } from "lucide-react";

interface HeroCardProps {
  icon: LucideIcon;
  title: string;
  number: number;
  isLoading?: boolean;
}

const HeroCard = ({
  icon: Icon,
  title,
  number,
  isLoading = false,
}: HeroCardProps) => {
  return (
    <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4 lg:p-6 text-center border border-white/20 hover:bg-white/15 transition-all duration-300">
      <div className="flex flex-col items-center gap-2 lg:gap-3">
        <div className="p-2 lg:p-3 bg-white/20 rounded-full">
          <Icon className="w-6 h-6 lg:w-8 lg:h-8 text-white" />
        </div>

        <h3 className="text-sm lg:text-base font-semibold text-white/90">
          {title}
        </h3>

        <div className="text-xl lg:text-3xl font-bold text-yellow-400">
          {isLoading ? (
            <Loader2 className="w-6 h-6 lg:w-8 lg:h-8 animate-spin mx-auto" />
          ) : (
            <span className="tabular-nums">
              {number.toLocaleString("ne-NP")}
            </span>
          )}
        </div>
      </div>
    </div>
  );
};

export default HeroCard;
