import { SECTION_SUBTITLE } from "@/lib/styles";

interface LogShippingProps {
  shippingDoc: string;
  commodity: string;
}

export function LogShipping({ shippingDoc, commodity }: LogShippingProps) {
  return (
    <div className="grid grid-cols-2 gap-4">
      <div>
        <span className={SECTION_SUBTITLE}>Shipping Doc #</span>
        <p className="text-sm font-medium text-slate-900 mt-0.5">
          {shippingDoc || "—"}
        </p>
      </div>
      <div>
        <span className={SECTION_SUBTITLE}>Commodity</span>
        <p className="text-sm font-medium text-slate-900 mt-0.5">
          {commodity || "—"}
        </p>
      </div>
    </div>
  );
}
