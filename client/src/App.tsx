import { Container } from "@chakra-ui/react";
import UserPage from "./pages/UserPage";
import PostPage from "./pages/PostPage";
import Header from "./components/Header";
import { createBrowserRouter, RouterProvider } from "react-router-dom";

const router = createBrowserRouter([
  {
    path: "/:username",
    element: <UserPage />,
  },
  {
    path: "/:username/post/:id",
    element: <PostPage />,
  },
]);

function App() {
  return (
    <Container maxW={640}>
      <Header />
      <RouterProvider router={router} />
    </Container>
  );
}

export default App;
