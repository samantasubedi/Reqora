import type { LucideIcon } from "lucide-react";
import { useRouter } from "next/navigation";
export type tableEmptyType = {
  colSpan: number;
  header: string;
  headerIcon: LucideIcon;
  subText?: string;
  button: { buttonText: string; link: string; buttonIcon: LucideIcon };
};
export default function TableEmpty({
  colSpan,
  header,
  headerIcon,
  subText,
  button,
}: tableEmptyType) {
  const HeaderIcon = headerIcon;
  const ButtonIcon = button.buttonIcon;
  const router = useRouter();
  return (
    <tr>
      <td colSpan={colSpan} className="p-0">
        <div className="flex min-h-[280px] w-full flex-col items-center justify-center px-6 py-12 text-center">
          <div className="mb-6 p-4 bg-background rounded-full shadow-sm">
            <HeaderIcon className="size-12 " />
          </div>

          <h2 className="text-2xl font-semibold text-primary mb-3">
            {/* No resources found ! */}
            {header}
          </h2>
          <p className="m-4 font-semibold text-muted-foreground">{subText}</p>
          <button
            onClick={() => router.push(button.link)}
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg font-medium transition-colors duration-200 shadow-sm bg-secondary"
          >
            <ButtonIcon className="size-5 cursor-pointer" />
            {button.buttonText}
          </button>
        </div>
      </td>
    </tr>
  );
}
