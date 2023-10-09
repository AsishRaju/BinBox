import { Group, Button, Text, Box, Badge, Image } from "@mantine/core";
import classes from "./Header.module.css";
import globalClasses from "../../App.module.css";
import useAuthData from "../../zustandStore/useAuthData";
import { IconLogout } from "@tabler/icons-react";
import { useCookies } from "react-cookie";

export function Header() {
  const { user, isLoggedIn, setUser } = useAuthData();
  const [cookies, setCookie, remove] = useCookies(["user"]);

  const logOutOnClick = () => {
    setUser({ name: "", id: "", email: "" }, false);
    remove("user");
  };

  return (
    <Box pb={60}>
      <header className={classes.header}>
        <Group justify="space-between" h="100%">
          <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: "12px" }}>
            <Image radius="md" src="https://svgrepo.com/show/514322/folder.svg" height={32} width={32} />
            <Text ta="center" className={globalClasses.logoStyle}>
              BinBox
            </Text>
          </div>

          <Badge size="md" color="blue">
            {user.role} | {user.email}
          </Badge>
          <Group visibleFrom="sm">
            {isLoggedIn && (
              <>
                <Button variant="light" color="red" rightSection={<IconLogout></IconLogout>} onClick={logOutOnClick}>
                  Log Out
                </Button>
              </>
            )}
          </Group>
        </Group>
      </header>
    </Box>
  );
}
