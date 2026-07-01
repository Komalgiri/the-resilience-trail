import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { IntroVideo } from "../components/IntroVideo";

export const Route = createFileRoute("/intro")({
  head: () => ({
    meta: [{ title: "The Resilience Trail" }],
  }),
  component: IntroPage,
});

function IntroPage() {
  const navigate = useNavigate();
  return (
    <IntroVideo
      onEnded={() => navigate({ to: "/mascot" })}
    />
  );
}
