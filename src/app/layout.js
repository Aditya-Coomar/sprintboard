import "./globals.css";
import QueryProvider from "@/providers/QueryProvider";

export const metadata = {
  title: "Sprint Board",
  description: "Kanban board for managing sprints",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={`antialiased`}>
        <QueryProvider>{children}</QueryProvider>
      </body>
    </html>
  );
}
