import type { InputHTMLAttributes } from 'react';

type FloatFieldProps = Omit<InputHTMLAttributes<HTMLInputElement>, 'id' | 'value' | 'onChange'> & {
  id: string;
  label: string;
  value: string;
  onChange: (value: string) => void;
  error?: string;
  /** "dark" for fields on a dark card. */
  tone?: 'light' | 'dark';
};

/**
 * A text field with its label inside the box. The label rests in the middle while the field is empty and moves up
 * once it is focused or filled, which keeps the forms short enough to fit on one screen. A placeholder, if given,
 * only shows while the field is focused.
 */
export default function FloatField({
  id,
  label,
  value,
  onChange,
  error,
  tone = 'light',
  placeholder = ' ',
  ...input
}: FloatFieldProps) {
  const dark = tone === 'dark';
  return (
    <div>
      <div className="relative">
        <input
          {...input}
          id={id}
          value={value}
          placeholder={placeholder}
          onChange={(e) => onChange(e.target.value)}
          aria-invalid={error ? true : undefined}
          aria-describedby={error ? `${id}-error` : undefined}
          className={`peer block h-[52px] w-full rounded-xl border-0 px-4 pb-1 pt-[18px] text-base ring-1 transition-shadow placeholder:text-transparent focus:outline-none focus:ring-2 ${
            dark
              ? 'bg-white/10 text-white autofill:shadow-[inset_0_0_0_100px_#1e293b] autofill:[-webkit-text-fill-color:#fff] focus:ring-indigo-400 focus:placeholder:text-slate-500'
              : 'bg-slate-50 text-slate-900 focus:bg-white focus:ring-indigo-500 focus:placeholder:text-slate-400'
          } ${error ? 'ring-red-400' : dark ? 'ring-white/15' : 'ring-slate-200'}`}
        />
        <label
          htmlFor={id}
          className={`pointer-events-none absolute left-4 top-4 origin-top-left -translate-y-2 scale-75 whitespace-nowrap text-base leading-5 transition-transform duration-200 peer-placeholder-shown:translate-y-0 peer-placeholder-shown:scale-100 peer-focus:-translate-y-2 peer-focus:scale-75 ${
            dark ? 'text-slate-400' : 'text-slate-500'
          }`}
        >
          {label}
        </label>
      </div>
      {error && (
        <p id={`${id}-error`} role="alert" className={`mt-1.5 text-sm ${dark ? 'text-red-300' : 'text-red-600'}`}>
          {error}
        </p>
      )}
    </div>
  );
}
