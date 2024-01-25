import clsx from "clsx";
import { Coffee } from "lucide-react";

type Props = Readonly<{
  className?: string;
}>;

export const Links = ({ className }: Props) => {
  return (
    <section className={clsx(className, "create-task__links")}>
      <a
        href="https://github.com/simonknittel/obsidian-create-task?tab=readme-ov-file#create-task"
        target="_blank"
      >
        Documentation
      </a>

      <a
        href="https://github.com/simonknittel/obsidian-create-task/releases"
        target="_blank"
      >
        Changelog
      </a>

      <a href="https://buymeacoffee.com/simonknittel" target="_blank">
        <Coffee /> Buy Me A Coffee
      </a>
    </section>
  );
};
