import type { LucideIcon } from "lucide-react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
export type tableEmptyType = {
  colSpan: number;
  header: string;
  headerIcon: LucideIcon;
  subText?: string;
  button?: { buttonText: string; link: string; buttonIcon: LucideIcon };
};
export default function TableEmpty({
  colSpan,
  header,
  headerIcon,
  subText,
  button,
}: tableEmptyType) {
  const HeaderIcon = headerIcon;
  const router = useRouter();
  return (
    <tr>
      <td colSpan={colSpan} className="p-0">
        <div className="flex min-h-[280px] w-full flex-col items-center justify-center px-6 py-12 text-center">
          <div className="mb-6 rounded-full bg-muted p-4">
            <HeaderIcon className="size-12 text-muted-foreground" />
          </div>

          <h2 className="mb-3 text-2xl font-semibold tracking-tight">
            {header}
          </h2>
          {subText && (
            <p className="m-4 text-sm text-muted-foreground">{subText}</p>
          )}
          {button && (
            <Button
              onClick={() => router.push(button.link)}
              className="mt-2 gap-2"
            >
              <button.buttonIcon className="size-5" />
              {button.buttonText}
            </Button>
          )}
        </div>
      </td>
    </tr>
  );
}
