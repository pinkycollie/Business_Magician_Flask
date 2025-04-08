import { createRoot } from "react-dom/client";
import App from "./App";
import "./index.css";
import { useEffect } from "react";

// Import HTMX script
const htmx = document.createElement('script');
htmx.src = "https://unpkg.com/htmx.org@1.9.6";
htmx.defer = true;
document.head.appendChild(htmx);

// Import Alpine.js for enhanced interactions
const alpine = document.createElement('script');
alpine.src = "https://unpkg.com/alpinejs@3.13.0/dist/cdn.min.js";
alpine.defer = true;
document.head.appendChild(alpine);

// Import Remix Icon CSS for icons
const remixIcon = document.createElement('link');
remixIcon.href = "https://cdn.jsdelivr.net/npm/remixicon@3.5.0/fonts/remixicon.css";
remixIcon.rel = "stylesheet";
document.head.appendChild(remixIcon);

// Import Google Fonts
const fonts = document.createElement('link');
fonts.href = "https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&family=Poppins:wght@500;600;700&display=swap";
fonts.rel = "stylesheet";
document.head.appendChild(fonts);

// Add title
const title = document.createElement('title');
title.textContent = "360 Business Magician";
document.head.appendChild(title);

createRoot(document.getElementById("root")!).render(<App />);
