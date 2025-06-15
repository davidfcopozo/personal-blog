export const loadHighlightTheme = async (isDark: boolean) => {
  // Remove existing theme
  const existingLink = document.querySelector("link[data-highlight-theme]");
  if (existingLink) {
    existingLink.remove();
  }

  // Create new link element
  const link = document.createElement("link");
  link.rel = "stylesheet";
  link.setAttribute("data-highlight-theme", "true");

  if (isDark) {
    link.href =
      "https://cdnjs.cloudflare.com/ajax/libs/highlight.js/11.11.1/styles/base16/atlas.min.css";
  } else {
    link.href =
      "https://cdnjs.cloudflare.com/ajax/libs/highlight.js/11.11.1/styles/base16/edge-dark.min.css";
  }

  document.head.appendChild(link);
};
