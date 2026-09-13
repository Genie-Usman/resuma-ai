import { useEffect, useState } from "react";
import { useParams, useSearchParams } from "react-router-dom";
import RenderResume from "../../components/ResumeTemplates/RenderResume";
import { A4_WIDTH_PX } from "../ResumeUpdate/hooks/usePageCalculator";
import axiosInstance from "../../utils/axiosInstance";
import { loadGoogleFont } from "../../utils/googleFonts";

const PrintResume = ({ isPublic = false }) => {
  const { resumeId, slug } = useParams();
  const [searchParams] = useSearchParams();
  const token = searchParams.get("token");

  const [resumeData, setResumeData] = useState(null);
  const [isReady, setIsReady] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    let isMounted = true;

    const fetchResume = async () => {
      try {
        let res;
        if (isPublic && slug) {
          res = await axiosInstance.get(`/api/resume/public/${slug}`);
        } else {
          const config = token
            ? { headers: { Authorization: `Bearer ${token}` } }
            : {};
          res = await axiosInstance.get(`/api/resume/${resumeId}`, config);
        }

        if (!isMounted) return;
        const data = res.data?.data ? res.data : { data: res.data };
        setResumeData(data);

        // Document title for print
        if (res.data?.title) {
          document.title = res.data.title;
        }

        // Preload active Google Font for PDF export
        const fontToLoad =
          data?.data?.metadata?.typography?.font?.family ||
          data?.metadata?.typography?.font?.family ||
          "Inter";
        loadGoogleFont(fontToLoad);

        // Wait for fonts & DOM paint
        if (document.fonts && document.fonts.ready) {
          await document.fonts.ready;
        }

        // Additional paint tick to ensure all SVG icons & flex layouts resolve
        setTimeout(() => {
          if (isMounted) {
            setIsReady(true);
          }
        }, 800);
      } catch (err) {
        console.error("PrintResume fetch error:", err);
        if (isMounted) {
          setError(err.response?.data?.message || "Failed to load resume for printing");
        }
      }
    };

    fetchResume();

    return () => {
      isMounted = false;
    };
  }, [resumeId, slug, token, isPublic]);

  if (error) {
    return (
      <div className="p-8 text-center text-rose-600 font-medium">
        <p>Error loading resume for print: {error}</p>
      </div>
    );
  }

  if (!resumeData?.data) {
    return (
      <div className="p-8 text-center text-slate-400 font-medium">
        <p>Preparing vector document...</p>
      </div>
    );
  }

  const templateId = resumeData.data?.metadata?.template || "azurill";

  return (
    <div className="print-root min-h-screen bg-white text-slate-900 antialiased">
      {/* Explicit A4 CSS print styles */}
      <style>{`
        @page {
          size: A4 portrait;
          margin: 0mm;
        }
        @media print {
          html, body {
            margin: 0 !important;
            padding: 0 !important;
            background: #ffffff !important;
            -webkit-print-color-adjust: exact !important;
            print-color-adjust: exact !important;
          }
          * {
            -webkit-print-color-adjust: exact !important;
            print-color-adjust: exact !important;
          }
          .a4-print-sheet {
            width: 210mm !important;
            height: auto !important;
            margin: 0 auto !important;
            padding: 0 !important;
            box-shadow: none !important;
            border: none !important;
            transform: none !important;
          }
          section, article, .resume-section, .wysiwyg, .main, .sidebar, .grid {
            break-inside: auto !important;
            page-break-inside: auto !important;
            height: auto !important;
          }
          section > div > div, .resume-item, .page-break-avoid, li {
            break-inside: avoid !important;
            page-break-inside: avoid !important;
          }
          h1, h2, h3, h4, h5, h6 {
            break-after: avoid !important;
            page-break-after: avoid !important;
          }
          a {
            color: inherit !important;
            text-decoration: none !important;
          }
        }
      `}</style>

      {/* A4 Container */}
      <div
        className="a4-print-sheet bg-white mx-auto overflow-visible"
        style={{ width: `${A4_WIDTH_PX}px`, minHeight: "1123px" }}
      >
        <RenderResume
          templateId={templateId}
          resumeData={resumeData.data}
          containerWidth={A4_WIDTH_PX}
        />
      </div>

      {/* Signal element for Headless Puppeteer when ready */}
      {isReady && <div id="print-ready" style={{ display: "none" }} />}
    </div>
  );
};

export default PrintResume;
