import ReactDOM from "react-dom/client";
import App from "./App.tsx";
import "./index.css";
import { mode } from "@chakra-ui/theme-tools";
import { ChakraProvider, ColorModeScript, extendTheme } from "@chakra-ui/react";
import "@fontsource-variable/inter";
import { RecoilRoot } from "recoil";
import { BrowserRouter } from "react-router-dom";
import { SocketContextProvider } from "./context/SocketContext.tsx";

const styles = {
  global: (props: any) => ({
    body: {
      color: mode("gray.800", "whiteAlpha.900")(props),
      bg: mode("gray.100", "#101010")(props),
    },
  }),
};

const config = {
  initialColorMode: "dark",
  useSystemColorMode: true,
};

const semanticTokens = {
  colors: {
    gray: {
      light: { default: "#1e1e1e", _dark: "#818181" },
      dark: { default: "#ccc", _dark: "#1e1e1e" },
    },
  },
};

const fonts = {
  heading: `'Inter', sans-serif`,
  body: `'Inter', sans-serif`,
};

const theme = extendTheme({ config, styles, fonts, semanticTokens });

ReactDOM.createRoot(document.getElementById("root")!).render(
  <RecoilRoot>
    <BrowserRouter>
      <ChakraProvider theme={theme}>
        <ColorModeScript initialColorMode={theme.config.initialColorMode} />
        <SocketContextProvider>
          <App />
        </SocketContextProvider>
      </ChakraProvider>
    </BrowserRouter>
  </RecoilRoot>
);
