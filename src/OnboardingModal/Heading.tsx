import clsx from "clsx";

type Props = Readonly<{
  className?: string;
}>;

export const Heading = ({ className }: Props) => {
  return (
    <div className={clsx(className, "create-task__onboarding-modal-heading")}>
      <h1>Create Task: Onboarding</h1>
    </div>
  );
};
