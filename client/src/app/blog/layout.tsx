import Footer from "@/components/footer";
import { Header } from "@/components/header";
import React from "react";

type LayoutProps = {
  children: React.ReactNode;
};

const Layout: React.FC<LayoutProps> = ({ children }) => {
  return (
    <div className="outer-container">
      <Header />
      <main>
        <div className="inner-container">{children}</div>
      </main>
      <Footer />
    </div>
  );
};

export default Layout;
