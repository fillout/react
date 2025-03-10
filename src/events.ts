import { EmbedType } from "./embed.js";
import { useMessageListener } from "./messages.js";

export type EventProps = {
  onInit?: (submissionUuid: string) => void;
  onPageChange?: (submissionUuid: string, pageId: string) => void;
  onSubmit?: (submissionUuid: string) => void;
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
    (data) => events.onSubmit?.(data.submissionUuid),
    { disabled: !events.onPageChange }
  );
};
