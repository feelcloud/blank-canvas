import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useRef } from "react";
import originalHtml from "../original-index.html?raw";

export const Route = createFileRoute("/")({
  component: Index,
  head: () => ({
    meta: [
      { title: "Futebol CC — San Jose Quakes Draft 2026" },
      {
        name: "description",
        content: "San Jose Quakes Draft 2026",
      },
    ],
  }),
});

function Index() {
  const frameRef = useRef<HTMLIFrameElement>(null);

  useEffect(() => {
    let cancelled = false;
    const frame = frameRef.current;
    if (!frame) return;

    if (!cancelled) frame.srcdoc = originalHtml;

    return () => {
      cancelled = true;
    };
  }, []);

  return (
    <iframe
      ref={frameRef}
      title="Futebol CC — San Jose Quakes Draft 2026"
      className="h-screen w-screen border-0"
      sandbox="allow-scripts allow-same-origin allow-forms allow-popups allow-downloads"
    />
  );
}