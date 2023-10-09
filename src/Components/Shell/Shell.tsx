import { AppShell, Group, Text } from "@mantine/core";
import { ReactNode } from "react";

interface Props {
  children: ReactNode;
}

export function Shell({ children }: Props) {
  return (
    <AppShell>
      <AppShell.Main>{children}</AppShell.Main>
    </AppShell>
  );
}
