export type CustomNote = {
  path: string;
  name: string;
  tag?: string;
};

export type CreateTaskSettings = {
  defaultNote: string;
  dateFormat: string;
  customNotes: CustomNote[];
};
