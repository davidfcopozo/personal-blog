export default function scrollToElement(
  scrollToElId: string,
  overlappingElSelector?: string
) {
  try {
    const headerHeight = overlappingElSelector
      ? (document.querySelector(overlappingElSelector) as HTMLElement)
          ?.offsetHeight || 0
      : 0;

    const target = document.getElementById(scrollToElId);
    if (!target) {
      console.error(`Element with ID '${scrollToElId}' not found.`);
      return;
    }

    const targetPosition =
      target.getBoundingClientRect().top + window.scrollY - headerHeight;

    window.scrollTo({
      top: targetPosition,
      behavior: "smooth",
    });
  } catch (error) {
    console.error("Error in scrollToElement:", error);
  }
}
