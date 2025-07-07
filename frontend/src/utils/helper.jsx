import { LuLink } from "react-icons/lu";
import html2canvas from "html2canvas"

// Validate Email Format
export const validateEmail = (email) => {
  const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return regex.test(email);
};

// Extract Light (Bright) Average Color from an Image
// export const getLightColorFromImage = (imageUrl) => {
//   return new Promise((resolve, reject) => {
//     if (!imageUrl || typeof imageUrl !== 'string') {
//       return reject(new Error('Invalid image URL'));
//     }

//     const img = new Image();

//     if (!imageUrl.startsWith('data:')) {
//       img.crossOrigin = 'anonymous';
//     }

//     img.src = imageUrl;

//     img.onload = () => {
//       const canvas = document.createElement('canvas');
//       const ctx = canvas.getContext('2d');

//       canvas.width = img.width;
//       canvas.height = img.height;
//       ctx.drawImage(img, 0, 0);

//       const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height).data;

//       let r = 0, g = 0, b = 0, count = 0;

//       for (let i = 0; i < imageData.length; i += 4) {
//         const red = imageData[i];
//         const green = imageData[i + 1];
//         const blue = imageData[i + 2];
//         const brightness = (red + green + blue) / 3;

//         if (brightness > 180) {
//           r += red;
//           g += green;
//           b += blue;
//           count++;
//         }
//       }

//       if (count === 0) {
//         resolve('#FFFFFF'); // fallback
//       } else {
//         r = Math.round(r / count);
//         g = Math.round(g / count);
//         b = Math.round(b / count);
//         resolve(`rgb(${r}, ${g}, ${b})`);
//       }
//     };

//     img.onerror = (error) => {
//       console.error('Image could not be loaded', error);
//       reject(new Error('Image could not be loaded or rejected by CORS.'));
//     };
//   });
// };

// Strip HTML tags and get plain text
export const stripHtml = (html) => {
  const div = document.createElement('div');
  div.innerHTML = html;
  return div.textContent || div.innerText || '';
};

// LinkedEntity component
export const LinkedEntity = ({ name, url, separateLinks, className, themeColors }) => {
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
    <div className={className} style={{ color: themeColors[1] }}>{name}</div>
  );
};

// Generic Link component
export const Link = ({ url, icon, iconOnRight, label, className, themeColors }) => {
  const isValidUrl = url && typeof url.href === 'string' && url.href.startsWith('http');

  if (!isValidUrl) return null;

  return (
    <div className="flex items-center gap-x-1.5">
      {!iconOnRight && (icon || <LuLink className="font-bold" style={{ color: themeColors[2] }} />)}
      <a
        href={url.href}
        target="_blank"
        rel="noreferrer noopener nofollow"
        className={`inline-block ${className || ''}`}
      >
        {label || url.label || url.href}
      </a>
      {iconOnRight && (icon || <LuLink className="font-bold" style={{ color: themeColors[2] }} />)}
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
  const elements = element.querySelectorAll("*");

  elements.forEach((el) => {
    const style = window.getComputedStyle(el);

    ["color", "backgroundColor", "borderColor"].forEach((prop) => {
      const value = style[prop];
      if (value.includes("oklch")) {
        el.style[prop] = "#000" // Fallback
      }
    })
  })
}

export const captureElementAsImage = async (element) => {
  if (!element) throw new Error('No element provided.');

  // Wait for all <img> tags inside the element to load
  const images = Array.from(element.querySelectorAll('img'));
  await Promise.all(
    images.map((img) => {
      return new Promise((resolve, reject) => {
        if (img.complete && img.naturalHeight !== 0) {
          resolve();
        } else {
          img.onload = () => resolve();
          img.onerror = (err) => reject(`Image failed to load: ${img.src}`);
        }
      });
    })
  );

  // Capture with useCORS enabled
  const canvas = await html2canvas(element, {
    useCORS: true,
    scale: 2,
    backgroundColor: null, 
  });

  return canvas.toDataURL("image/png");
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