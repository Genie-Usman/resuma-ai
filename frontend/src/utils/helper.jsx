import { LuLink } from "react-icons/lu";

// Validate Email Format
export const validateEmail = (email) => {
  const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return regex.test(email);
};

// Extract Light (Bright) Average Color from an Image
export const getLightColorFromImage = (imageUrl) => {
  return new Promise((resolve, reject) => {
    if (!imageUrl || typeof imageUrl !== 'string') {
      return reject(new Error('Invalid image URL'));
    }

    const img = new Image();

    if (!imageUrl.startsWith('data:')) {
      img.crossOrigin = 'anonymous';
    }

    img.src = imageUrl;

    img.onload = () => {
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');

      canvas.width = img.width;
      canvas.height = img.height;
      ctx.drawImage(img, 0, 0);

      const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height).data;

      let r = 0, g = 0, b = 0, count = 0;

      for (let i = 0; i < imageData.length; i += 4) {
        const red = imageData[i];
        const green = imageData[i + 1];
        const blue = imageData[i + 2];
        const brightness = (red + green + blue) / 3;

        if (brightness > 180) {
          r += red;
          g += green;
          b += blue;
          count++;
        }
      }

      if (count === 0) {
        resolve('#FFFFFF'); // fallback
      } else {
        r = Math.round(r / count);
        g = Math.round(g / count);
        b = Math.round(b / count);
        resolve(`rgb(${r}, ${g}, ${b})`);
      }
    };

    img.onerror = (error) => {
      console.error('Image could not be loaded', error);
      reject(new Error('Image could not be loaded or rejected by CORS.'));
    };
  });
};

// Strip HTML tags and get plain text
export const stripHtml = (html) => {
  const div = document.createElement('div');
  div.innerHTML = html;
  return div.textContent || div.innerText || '';
};

// LinkedEntity component
export const LinkedEntity = ({ name, url, separateLinks, className }) => {
  const isValidUrl = url && typeof url.href === 'string' && url.href.startsWith('http');

  return !separateLinks && isValidUrl ? (
    <a
      href={url.href}
      target="_blank"
      rel="noopener noreferrer"
      className={className}
    >
      <span>{name}</span>
      <LuLink className="font-bold text-primary" />
    </a>
  ) : (
    <div className={className}>{name}</div>
  );
};

// Generic Link component
export const Link = ({ url, icon, iconOnRight, label, className }) => {
  const isValidUrl = url && typeof url.href === 'string' && url.href.startsWith('http');

  if (!isValidUrl) return null;

  return (
    <div className="flex items-center gap-x-1.5">
      {!iconOnRight && (icon || <LuLink className="font-bold text-primary" />)}
      <a
        href={url.href}
        target="_blank"
        rel="noreferrer noopener nofollow"
        className={`inline-block ${className || ''}`}
      >
        {label || url.label || url.href}
      </a>
      {iconOnRight && (icon || <LuLink className="font-bold text-primary" />)}
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
