import { LuLink } from "react-icons/lu";
import { toJpeg } from "html-to-image";

export const validateEmail = (email) => {
  const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return regex.test(email);
};

export const stripHtml = (html) => {
  const div = document.createElement('div');
  div.innerHTML = html;
  return div.textContent || div.innerText || '';
};

export const LinkedEntity = ({ name, url, separateLinks, className, themeColors, isSidebar = false }) => {
  const isValidUrl = url && typeof url.href === 'string' && url.href.startsWith('http');

  return !separateLinks && isValidUrl ? (
    <a
      href={url.href}
      target="_blank"
      rel="noopener noreferrer"
      className={className}
    >
      <span>{name}</span>
      <LuLink className="font-bold " style={{ color: themeColors[2] }} />
    </a>
  ) : (
    <div className={className} style={{ color: isSidebar ? themeColors[0] : themeColors[1] }}>{name}</div>
  );
};

export const Link = ({ url, icon, iconOnRight, label, className, themeColors, showIcon = true }) => {
  const isValidUrl = url && typeof url.href === 'string' && url.href.startsWith('http');

  if (!isValidUrl) return null;

  const shouldShowIcon = showIcon && icon !== false && icon !== null;

  if (!shouldShowIcon) {
    return (
      <a
        href={url.href}
        target="_blank"
        rel="noreferrer noopener nofollow"
        className={`hover:underline align-middle ${className || ''}`}
        style={{ color: themeColors?.[1] }}
      >
        {label || url.label || url.href}
      </a>
    );
  }

  return (
    <div className="inline-flex items-center gap-x-1.5 align-middle">
      {!iconOnRight && (icon || <LuLink className="font-bold shrink-0" style={{ color: themeColors?.[2] }} />)}
      <a
        href={url.href}
        target="_blank"
        rel="noreferrer noopener nofollow"
        className={`inline-block hover:underline align-middle ${className || ''}`}
        style={{ color: themeColors?.[1] }}
      >
        {label || url.label || url.href}
      </a>
      {iconOnRight && (icon || <LuLink className="font-bold shrink-0" style={{ color: themeColors?.[2] }} />)}
    </div>
  );
};

export const linearTransform = (
  value,
  inMin,
  inMax,
  outMin,
  outMax,
) => {
  if (inMax === inMin) return value === inMax ? outMin : Number.NaN;
  return ((value - inMin) * (outMax - outMin)) / (inMax - inMin) + outMin;
};

export const fixTailwindColors = (element) => {
  if (!element) return;
  const elements = element.querySelectorAll("*");

  elements.forEach((el) => {
    try {
      const style = window.getComputedStyle(el);
      ["color", "backgroundColor", "borderColor"].forEach((prop) => {
        const value = style?.[prop];
        if (typeof value === "string" && value.includes("oklch")) {
          el.style[prop] = "#000"; // Fallback
        }
      });
    } catch {
      // Ignore individual element computed style errors
    }
  });
};

export const captureElementAsImage = async (element) => {
  if (!element) throw new Error("No element provided.");

  // Pre-load images with timeout guard
  const images = Array.from(element.querySelectorAll("img"));
  await Promise.all(
    images.map((img) => {
      if (!img.crossOrigin && img.src && !img.src.startsWith("data:") && !img.src.startsWith("blob:")) {
        img.crossOrigin = "anonymous";
      }
      return new Promise((resolve) => {
        if (img.complete && img.naturalHeight !== 0) {
          resolve();
        } else {
          const timer = setTimeout(() => resolve(), 2000);
          img.onload = () => {
            clearTimeout(timer);
            resolve();
          };
          img.onerror = () => {
            clearTimeout(timer);
            resolve();
          };
        }
      });
    })
  );

  // Ensure web fonts are ready before capture
  if (document.fonts && document.fonts.ready) {
    try {
      await document.fonts.ready;
    } catch {
      // ignore font loading error
    }
  }

  // Save original inline styles to restore after capture
  const originalTransform = element.style.transform;
  const originalWidth = element.style.width;

  try {
    element.style.transform = "none";
    element.style.width = "794px";

    const filter = (node) => {
      if (!node || !node.classList) return true;
      return (
        !node.classList.contains("page-break-guide-line") &&
        !node.classList.contains("page-break-guide-pill")
      );
    };

    // html-to-image utilizes native browser SVG foreignObject rendering,
    // guaranteeing exact 1:1 fidelity with live DOM (flex centering, gaps, fonts, and icons)
    const dataUrl = await toJpeg(element, {
      quality: 0.92,
      width: 794,
      height: 1123,
      backgroundColor: "#ffffff",
      pixelRatio: 1,
      filter,
      style: {
        transform: "none",
        width: "794px",
        margin: "0",
        boxShadow: "none",
      },
    });

    return dataUrl;
  } catch (err) {
    console.warn("html-to-image standard capture failed, retrying with skipFonts:", err);
    try {
      return await toJpeg(element, {
        quality: 0.92,
        width: 794,
        height: 1123,
        backgroundColor: "#ffffff",
        pixelRatio: 1,
        skipFonts: true,
      });
    } catch (fallbackErr) {
      console.error("Critical thumbnail capture failure:", fallbackErr);
      throw fallbackErr;
    }
  } finally {
    element.style.transform = originalTransform;
    element.style.width = originalWidth;
  }
};

export const dataURLToFile = (dataUrl, fileName) => {
  const arr = dataUrl.split(',');
  const mime = arr[0].match(/:(.*?);/)[1];
  const bstr = atob(arr[1]);
  let n = bstr.length;
  const u8arr = new Uint8Array(n)

  while (n--) {
    u8arr[n] = bstr.charCodeAt(n)
  }

  return new File([u8arr], fileName, { type: mime })
}

export const waitForImageToLoad = (url) =>
  new Promise((resolve, reject) => {
    const img = new Image();
    img.crossOrigin = 'anonymous';
    img.onload = () => resolve();
    img.onerror = (err) => reject(err);
    img.src = url;
  });

export const hexToRgba = (hex, alpha = 1) => {
  const [r, g, b] = hex.replace("#", "").match(/.{1,2}/g).map(x => parseInt(x, 16));
  return `rgba(${r}, ${g}, ${b}, ${alpha})`;
};
