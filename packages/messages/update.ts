export const fileUpdateMessageType = "fileUpdate" as const;
export type FileUpdate = {
  type: typeof fileUpdateMessageType;
  text: string;
};

export const formBuilderUpdateMessageType = "formBuilderUpdate" as const;
export type FormBuilderUpdate = {
  type: typeof formBuilderUpdateMessageType;
  schema: Record<string, unknown>;
};

export function isFileUpdate(message: unknown): message is FileUpdate {
  return (message as FileUpdate).type === fileUpdateMessageType;
}

export function isFormBuilderUpdate(
  message: unknown
): message is FormBuilderUpdate {
  return (message as FormBuilderUpdate).type === formBuilderUpdateMessageType;
}
