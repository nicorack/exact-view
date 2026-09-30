import { createFileRoute, Outlet, useRouterState } from "@tanstack/react-router";

export const Route = createFileRoute("/formations")({
  component: () => <Outlet />,
});

// Placeholder export keeps the router state import tree-shakable if unused.
export const _unused = useRouterState;
