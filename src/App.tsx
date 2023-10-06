import "@mantine/core/styles.css";
import "react-toastify/dist/ReactToastify.css";
import { MantineProvider } from "@mantine/core";
import { theme } from "./theme";
import { Login } from "./Pages/Login/Login";
import { Shell } from "./Components/Shell/Shell";
import { Routes, Route, Link, useNavigate } from "react-router-dom";
import { User } from "./Pages/User/User";
import UserPool from "./UserPool";
import { ToastContainer } from "react-toastify";
import AuthRoute from "./Components/AuthRoute";

export default function App() {
  return (
    <MantineProvider theme={theme}>
      <Shell>
        <Routes>
          <Route path="/" element={<Login />} />
          <Route element={<AuthRoute />}>
            <Route path="/user" element={<User />} />
          </Route>
        </Routes>
        <ToastContainer />
      </Shell>
    </MantineProvider>
  );
}
