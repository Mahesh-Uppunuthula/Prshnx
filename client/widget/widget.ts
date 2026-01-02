// // // (() => {
// // //   const init = () => {
// // //     const container = document.getElementById("form_123") as HTMLDivElement;

// // //     if (!container) {
// // //       console.log("No container found");
// // //       return;
// // //     }

// // //     // const formId = container.dataset.formId || "form_123";
// // //     // console.log("formId:", formId);

// // //     const iframe = document.createElement("iframe");

// // //     // iframe.src = `http://localhost:3000/embed/${formId}`;
// // //     iframe.src = `http://localhost:3000/embed/form_123`;
// // //     iframe.style.border = "none";
// // //     iframe.style.width = "100%";
// // //     iframe.style.height = "0px";
// // //     iframe.style.transition = "height 0.25s ease";

// // //     container.appendChild(iframe);

// // //     window.addEventListener("message", (e) => {
// // //       if (e.data?.type === "BHVR_FORM_HEIGHT") {
// // //         iframe.style.height = `${e.data.height}px`;
// // //       }
// // //     });
// // //   };

// // //   if (document.readyState === "loading") {
// // //     document.addEventListener("DOMContentLoaded", init);
// // //   } else {
// // //     init();
// // //   }
// // // })();

// // (() => {
// //   const FORM_ID = "form_123";

// //   const mount = (container: HTMLElement) => {
// //     if (container.dataset.mounted === "true") return;
// //     container.dataset.mounted = "true";

// //     const iframe = document.createElement("iframe");

// //     iframe.src = `http://localhost:3000/embed/${FORM_ID}`;
// //     iframe.style.border = "none";
// //     iframe.style.width = "100%";
// //     iframe.style.height = "0px";
// //     iframe.style.transition = "height 0.25s ease";

// //     container.appendChild(iframe);

// //     window.addEventListener("message", (e) => {
// //       if (e.data?.type === "BHVR_FORM_HEIGHT") {
// //         iframe.style.height = `${e.data.height}px`;
// //       }
// //     });

// //     console.log("Widget mounted");
// //   };

// //   const tryFindContainer = () => {
// //     const container = document.getElementById("form_123");
// //     if (container) {
// //       mount(container);
// //       return true;
// //     }
// //     return false;
// //   };

// //   // 1️⃣ Try immediately
// //   if (tryFindContainer()) return;

// //   // 2️⃣ Observe DOM changes (React-safe)
// //   const observer = new MutationObserver(() => {
// //     if (tryFindContainer()) {
// //       observer.disconnect();
// //     }
// //   });

// //   observer.observe(document.body, {
// //     childList: true,
// //     subtree: true,
// //   });
// // })();

// (() => {
//   const FORM_ID = "form_123";

//   const mount = (container: HTMLElement) => {
//     if (container.dataset.mounted === "true") return;
//     container.dataset.mounted = "true";

//     const iframe = document.createElement("iframe");

//     iframe.src = `http://localhost:3000/embed/${FORM_ID}`;
//     iframe.style.border = "none";
//     iframe.style.width = "100%";
//     iframe.style.height = "0px";
//     iframe.style.transition = "height 0.25s ease";

//     container.appendChild(iframe);

//     window.addEventListener("message", (e) => {
//       if (e.data?.type === "BHVR_FORM_HEIGHT") {
//         iframe.style.height = `${e.data.height}px`;
//       }
//     });

//     console.log("Widget mounted");
//   };

//   const tryFindContainer = () => {
//     const container = document.getElementById(FORM_ID);
//     if (container) {
//       mount(container);
//       return true;
//     }
//     return false;
//   };

//   const startObserving = () => {
//     // Try immediately (React may already have rendered)
//     if (tryFindContainer()) return;

//     const observer = new MutationObserver(() => {
//       if (tryFindContainer()) {
//         observer.disconnect();
//       }
//     });

//     observer.observe(document.body, {
//       childList: true,
//       subtree: true,
//     });
//   };

//   // 🔥 Ensure document.body exists
//   if (document.readyState === "loading") {
//     document.addEventListener("DOMContentLoaded", startObserving);
//   } else {
//     startObserving();
//   }
// })();

(() => {
  const mounted = new WeakSet<Element>();

  const mount = (container: HTMLElement) => {
    if (mounted.has(container)) {
      console.log("Widget already mounted");
      return;
    }
    mounted.add(container);

    console.log("dataset",container.dataset);
    const formId = container.dataset.formId;
    if (!formId) {
      console.log("No formId found");
      return;
    }

    const presetWidth = container.dataset.formWidth;
    const presetHeight = container.dataset.formHeight;

    console.log({ presetWidth, presetHeight });

    console.log(`Mounting widget for ${formId}`);
    const iframe = document.createElement("iframe");

    iframe.src = `http://localhost:3000/embed/${formId}`;
    iframe.style.border = "none";
    iframe.style.width = presetWidth ?? "100%";
    iframe.style.height = presetHeight ?? "0px";
    iframe.style.transition = "height 0.25s ease";

    container.appendChild(iframe);

    window.addEventListener("message", (e) => {
      if (
        e.data?.type === "BHVR_FORM_HEIGHT" &&
        e.source === iframe.contentWindow
      ) {
        // iframe.style.height = `${e.data.height}px`;
        // iframe.style.height = "100%";
      }
    });

    console.log(`Widget mounted for ${formId}`);
  };

  const scan = () => {
    document.querySelectorAll<HTMLElement>("div[data-form-id]").forEach(mount);
  };

  const start = () => {
    scan();

    const observer = new MutationObserver(scan);
    observer.observe(document.body, {
      childList: true,
      subtree: true,
    });
  };

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", start);
  } else {
    start();
  }
})();
