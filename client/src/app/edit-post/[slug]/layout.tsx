"use client";
import { NewPostHeader } from "@/components/new-post-header";
import { NewPostLayoutProps } from "@/typings/interfaces";
import React, { FC } from "react";

const Layout: FC<NewPostLayoutProps> = ({ onSave, children }) => {
  return (
    <div className="outer-container">
      <NewPostHeader onSave={onSave} />
      <main>
        <div className="inner-container">{children}</div>
      </main>
    </div>
  );
};

export default Layout;
