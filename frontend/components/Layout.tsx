import { Box, Container, Divider } from "@mui/material";
import { textAlign } from "@mui/system";
import Footer from "./Footer";

export default function Layout({ children }) {
  return (
    <>
      <main>{children}</main>
      {/* <div
        style={{
          position: "relative",
          width: "99%",
          top: 530,
          textAlign: "center",
        }}
      >
        <Footer />
      </div> */}
    </>
  );
}
