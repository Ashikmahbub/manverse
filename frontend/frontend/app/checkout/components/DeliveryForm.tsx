"use client";

interface Props {
  form: {
    full_name: string;
    phone: string;
    address: string;
    city: string;
    postcode: string;
  };
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  deliveryCharge: number;
}

const fields = [
  { name: "full_name", label: "Full Name" },
  { name: "phone",     label: "Phone" },
  { name: "address",   label: "Address" },
  { name: "city",      label: "City" },
  { name: "postcode",  label: "Postcode" },
];

export default function DeliveryForm({ form, onChange, deliveryCharge }: Props) {
  return (
    <div>
      <h2 className="text-white font-semibold text-lg mb-5">Delivery Info</h2>

      {fields.map(({ name, label }) => (
        <div key={name} className="mb-4">
          <label className="text-xs font-mono text-gray-400 uppercase tracking-wider block mb-1.5">
            {label}
          </label>
          <input
            name={name}
            value={(form as any)[name]}
            onChange={onChange}
            className="w-full bg-white/5 border border-white/15
                       rounded-lg px-4 py-3 text-white text-sm
                       focus:outline-none focus:border-amber-500 transition-colors"
          />
          {/* Delivery charge hint below City field */}
          {name === "city" && form.city && (
            <p className={`text-xs font-mono mt-1.5 ${deliveryCharge === 60 ? "text-green-400" : "text-amber-400"}`}>
              {deliveryCharge === 60
                ? "✓ Dhaka delivery — ৳60"
                : "⚠ Outside Dhaka delivery — ৳120"}
            </p>
          )}
        </div>
      ))}
    </div>
  );
}