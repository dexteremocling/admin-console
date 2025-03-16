import "@/styles/globals.css";
import Sidebar from "@/components/Sidebar";

export default function App({ Component, pageProps }: any) {
  return (
    <div style={{ display: "flex" }}>
      <Sidebar />
      <div style={{ marginLeft: "250px", padding: "20px", flexGrow: 1 }}>
        <Component {...pageProps} />
      </div>
    </div>
  );
}