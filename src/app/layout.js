import "./globals.css";
import 'react-quill/dist/quill.snow.css';
import QueryProvider from "@/providers/QueryProvider";
import ReduxProviders from "@/providers/ReduxProvider";

export const metadata = {
  title: "Sprint Board",
  description: "Kanban board for managing sprints",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={`antialiased`}>
        <ReduxProviders>
        <QueryProvider>{children}</QueryProvider>
        </ReduxProviders>
      </body>
    </html>
  );
}
