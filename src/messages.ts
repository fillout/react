import { useEffect } from "react";
import { EmbedType } from "./embed.js";

export const useMessageListener = (
  embed: EmbedType | undefined,
  eventName: string,
  fn: (data: any) => void,
  options?: { disabled?: boolean }
) => {
  const enabled = !options?.disabled;

  useEffect(() => {
    if (embed && enabled) {
      const debug = location.href.includes("FILLOUT_EMBED_DEBUG");

      const listener = (event: MessageEvent) => {
        try {
          if (
            event.origin === embed.origin &&
            event.data.embedId === embed.embedId &&
            event.data.type === eventName
          ) {
            if (debug) {
              console.log(["fillout embed MESSAGE", eventName, event.data]);
            }

            fn(event.data);
          }
        } catch (err) {}
      };

      if (debug) console.log(["fillout embed MOUNT", eventName]);
      window.addEventListener("message", listener);

      return () => {
        if (debug) console.log(["fillout embed UNMOUNT", eventName]);
        window.removeEventListener("message", listener);
      };
    }
  }, [embed, eventName, fn, enabled]);
};
