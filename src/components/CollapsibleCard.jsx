import { useState, useEffect } from "react";

export default function CollapsibleCard({ title, children }) {
  const [open, setOpen] = useState(true);

  useEffect(() => {
    const checkScreenSize = () => {
      const isSmallScreen = window.innerWidth < 768;
      setOpen(!isSmallScreen);
    };

    checkScreenSize();

    window.addEventListener("resize", checkScreenSize);
    return () => window.removeEventListener("resize", checkScreenSize);
  }, []);

  return (
    <div className="border rounded w-full">
      <button
        type="button"
        onClick={() => setOpen(!open)}
        className="w-full text-center font-semibold text-lg py-3 
                    hover:bg-gray-200 
                   dark:bg-gray-700 dark:hover:bg-gray-600 
                   text-gray-800 dark:text-gray-100 
                   transition-colors"
      >
        {title}
      </button>
      {open && <div className="p-4 space-y-4">{children}</div>}
    </div>
  );
}
