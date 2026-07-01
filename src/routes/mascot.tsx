import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { MascotIntro } from "../components/MascotIntro";

export const Route = createFileRoute("/mascot")({
  head: () => ({
    meta: [{ title: "Meet the Trailkeeper — The Resilience Trail" }],
  }),
  component: MascotPage,
});

function MascotPage() {
  const navigate = useNavigate();
  return (
    <MascotIntro
      onDone={() => navigate({ to: "/level" })}
    />
  );
}
