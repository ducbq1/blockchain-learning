import { Box, Container, Divider } from "@mui/material";
import { textAlign } from "@mui/system";
import Footer from "./Footer";

export default function Layout({ children }) {
  return (
    <>
      <main>{children}</main>
      <div
        style={{
          position: "absolute",
          bottom: 7,
          width: "99%",
          textAlign: "center",
        }}
      >
        <Footer />
      </div>
    </>
  );
}
