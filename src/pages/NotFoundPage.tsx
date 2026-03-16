import { Link } from "react-router-dom";

import { MAIN_CONTENT, CARD_PADDED, BUTTON_PRIMARY } from "@/lib/styles";

export default function NotFoundPage() {
  return (
    <div className={MAIN_CONTENT}>
      <div className={`${CARD_PADDED} max-w-[480px] mx-auto text-center`}>
        <h1 className="text-4xl font-bold text-slate-800 mb-2">404</h1>
        <p className="text-sm text-slate-500 mb-6">
          The page you are looking for does not exist.
        </p>
        <Link to="/app" className={BUTTON_PRIMARY}>
          Back to Home
        </Link>
      </div>
    </div>
  );
}
