import { EmbedType } from "./embed.js";
import { useMessageListener } from "./messages.js";

export type EventProps = {
  onInit?: (submissionUuid: string) => void;
  onPageChange?: (submissionUuid: string, pageId: string) => void;
  onSubmit?: (submissionUuid: string, data?: Record<string, unknown>) => void;
};

export const useFilloutEvents = (
  embed: EmbedType | undefined,
  events: EventProps
) => {
  useMessageListener(
    embed,
    "form_init",
    (data) => events.onInit?.(data.submissionUuid),
    { disabled: !events.onInit }
  );

  useMessageListener(
    embed,
    "page_change",
    (data) => events.onPageChange?.(data.submissionUuid, data.stepId),
    { disabled: !events.onPageChange }
  );

  useMessageListener(
    embed,
    "form_submit",
    (data) => {
      // Pass through any additional data from the embed (e.g. submission answers)
      // as the second parameter. This is backward compatible — existing consumers
      // that only use submissionUuid will ignore the second param.
      const { type, embedId, submissionUuid, ...rest } = data;
      events.onSubmit?.(submissionUuid, Object.keys(rest).length > 0 ? rest : undefined);
    },
    { disabled: !events.onSubmit }
  );
};
