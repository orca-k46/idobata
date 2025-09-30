import { Navigate, Outlet, createBrowserRouter } from "react-router-dom";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import PageLayout from "./components/layout/PageLayout";
// import { AuthProvider } from "./contexts/AuthContext";
// import { ThemeProvider } from "./contexts/ThemeContext";
import About from "./pages/About";
import DocumentDetail from "./pages/DocumentDetail";
import {
  SimpleDashboard,
  SimpleTeams,
  SimpleTeamDetail,
  SimpleDocumentEditor,
  SimpleKnowledgeGraph,
  SimpleMyPage,
  SimpleDocumentSearch,
} from "./pages/SimplePages";

// Create a client
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 5, // 5 minutes
      retry: 1,
    },
  },
});

function App() {
  return <Outlet />;
}

export const router = createBrowserRouter([
  {
    path: "/",
    element: (
      <QueryClientProvider client={queryClient}>
        <App />
      </QueryClientProvider>
    ),
    children: [
      { index: true, element: <Navigate to="/dashboard" replace /> },
      {
        path: "dashboard",
        element: (
          <PageLayout>
            <SimpleDashboard />
          </PageLayout>
        ),
      },
      {
        path: "about",
        element: (
          <PageLayout>
            <About />
          </PageLayout>
        ),
      },
      {
        path: "teams",
        element: (
          <PageLayout>
            <SimpleTeams />
          </PageLayout>
        ),
      },
      {
        path: "teams/:teamId",
        element: (
          <PageLayout>
            <SimpleTeamDetail />
          </PageLayout>
        ),
      },
      {
        path: "documents/search",
        element: (
          <PageLayout>
            <SimpleDocumentSearch />
          </PageLayout>
        ),
      },
      {
        path: "documents/:documentId",
        element: (
          <PageLayout>
            <DocumentDetail />
          </PageLayout>
        ),
      },
      {
        path: "documents/:documentId/edit",
        element: (
          <PageLayout>
            <SimpleDocumentEditor />
          </PageLayout>
        ),
      },
      {
        path: "documents/new",
        element: (
          <PageLayout>
            <SimpleDocumentEditor />
          </PageLayout>
        ),
      },
      {
        path: "knowledge-graph",
        element: (
          <PageLayout>
            <SimpleKnowledgeGraph />
          </PageLayout>
        ),
      },
      {
        path: "profile",
        element: (
          <PageLayout>
            <SimpleMyPage />
          </PageLayout>
        ),
      },
    ],
  },
]);

export default App;
