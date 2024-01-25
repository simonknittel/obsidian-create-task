import clsx from "clsx";
import { BookText, Coffee, PackagePlus } from "lucide-react";

type Props = Readonly<{
  className?: string;
  items: ("documentation" | "changelog" | "coffee")[];
}>;

export const Links = ({ className, items }: Props) => {
  return (
    <section className={clsx(className, "create-task__links")}>
      {items.includes("documentation") && (
        <a
          href="https://github.com/simonknittel/obsidian-create-task?tab=readme-ov-file#create-task"
          target="_blank"
        >
          <BookText /> Documentation
        </a>
      )}

      {items.includes("changelog") && (
        <a
          href="https://github.com/simonknittel/obsidian-create-task/releases"
          target="_blank"
        >
          <PackagePlus /> Changelog
        </a>
      )}

      {items.includes("coffee") && (
        <a href="https://buymeacoffee.com/simonknittel" target="_blank">
          <Coffee /> Buy Me A Coffee
        </a>
      )}
    </section>
  );
};
