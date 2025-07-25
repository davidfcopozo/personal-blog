import { useInteractions } from "@/hooks/useInteractions";
import { PostType } from "@/typings/types";
import dynamic from "next/dynamic";
import { AuthModal } from "./auth-modal";
import hljs from "highlight.js";
import "highlight.js/styles/night-owl.css";
import javascript from "highlight.js/lib/languages/javascript";
import typescript from "highlight.js/lib/languages/typescript";
import html from "highlight.js/lib/languages/xml";
import css from "highlight.js/lib/languages/css";
import python from "highlight.js/lib/languages/python";
import java from "highlight.js/lib/languages/java";
import cpp from "highlight.js/lib/languages/cpp";
import json from "highlight.js/lib/languages/json";
import xml from "highlight.js/lib/languages/xml";
import bash from "highlight.js/lib/languages/bash";
import sql from "highlight.js/lib/languages/sql";
import php from "highlight.js/lib/languages/php";
import ruby from "highlight.js/lib/languages/ruby";
import go from "highlight.js/lib/languages/go";
import rust from "highlight.js/lib/languages/rust";
import csharp from "highlight.js/lib/languages/csharp";
import c from "highlight.js/lib/languages/c";
import { useTranslations } from "next-intl";

const CommentEditor = dynamic(
  () => {
    // Configure hljs globally before importing the editor
    if (typeof window !== "undefined") {
      // @ts-ignore
      window.hljs = hljs;

      // Register JavaScript the imported languges
      hljs.registerLanguage("javascript", javascript);
      hljs.registerLanguage("typescript", typescript);
      hljs.registerLanguage("html", html);
      hljs.registerLanguage("css", css);
      hljs.registerLanguage("python", python);
      hljs.registerLanguage("java", java);
      hljs.registerLanguage("cpp", cpp);
      hljs.registerLanguage("json", json);
      hljs.registerLanguage("xml", xml);
      hljs.registerLanguage("bash", bash);
      hljs.registerLanguage("sql", sql);
      hljs.registerLanguage("php", php);
      hljs.registerLanguage("ruby", ruby);
      hljs.registerLanguage("go", go);
      hljs.registerLanguage("rust", rust);
      hljs.registerLanguage("csharp", csharp);
      hljs.registerLanguage("c", c);

      // Configure hljs with languages for better detection
      hljs.configure({
        languages: [
          "javascript",
          "typescript",
          "html",
          "css",
          "python",
          "java",
          "cpp",
          "json",
          "xml",
          "bash",
          "sql",
          "php",
          "ruby",
          "go",
          "rust",
          "csharp",
          "c",
        ],
      });
    }

    return import("./comment-editor");
  },
  {
    ssr: false,
  }
);

const CommentBox = ({ post }: { post: PostType }) => {
  const t = useTranslations("comments");
  const {
    createCommentInteraction,
    setCommentContent,
    commentContent,
    commentMutationStatus,
    // Auth modal properties
    isAuthModalOpen,
    authModalAction,
    closeAuthModal,
    handleAuthSuccess,
  } = useInteractions(post);

  const handleChange = (content: string) => {
    setCommentContent(content);
  };
  return (
    <>
      <form
        onSubmit={(e) => {
          e.preventDefault();
        }}
      >
        <h3 className="text-xl font-bold mb-4">{t("addComment")}</h3>{" "}
        <CommentEditor
          value={commentContent}
          onChange={handleChange}
          onSubmit={createCommentInteraction}
          onCancel={() => {}}
          showCancelButton={false}
          commentMutationStatus={commentMutationStatus}
          placeholder={t("writeComment")}
          originalContent=""
        />
      </form>

      <AuthModal
        isOpen={isAuthModalOpen}
        onClose={closeAuthModal}
        action={authModalAction || "comment"}
        onSuccess={handleAuthSuccess}
      />
    </>
  );
};

export default CommentBox;
