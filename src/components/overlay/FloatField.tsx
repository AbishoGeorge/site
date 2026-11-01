import { useLayoutEffect, useRef, type InputHTMLAttributes } from 'react';

type Tone = 'light' | 'dark';

type FloatFieldProps = Omit<InputHTMLAttributes<HTMLInputElement>, 'id' | 'value' | 'onChange'> & {
  id: string;
  label: string;
  value: string;
  onChange: (value: string) => void;
  error?: string;
  /** "dark" for fields on a dark card. */
  tone?: Tone;
};

const boxClass = (tone: Tone, error?: string) =>
  `peer block w-full rounded-xl border-0 px-4 text-base ring-1 transition-shadow placeholder:text-transparent focus:outline-none focus:ring-2 ${
    tone === 'dark'
      ? 'bg-white/10 text-white autofill:shadow-[inset_0_0_0_100px_#1e293b] autofill:[-webkit-text-fill-color:#fff] focus:ring-indigo-400 focus:placeholder:text-slate-500'
      : 'bg-slate-50 text-slate-900 focus:bg-white focus:ring-indigo-500 focus:placeholder:text-slate-400'
  } ${error ? 'ring-red-400' : tone === 'dark' ? 'ring-white/15' : 'ring-slate-200'}`;

// Rests in the middle of an empty field and moves up once the field is focused or filled.
const labelClass = (tone: Tone) =>
  `pointer-events-none absolute left-4 top-4 origin-top-left -translate-y-2 scale-75 whitespace-nowrap text-base leading-5 transition-transform duration-200 peer-placeholder-shown:translate-y-0 peer-placeholder-shown:scale-100 peer-focus:-translate-y-2 peer-focus:scale-75 ${
    tone === 'dark' ? 'text-slate-400' : 'text-slate-500'
  }`;

function ErrorText({ id, error, tone }: { id: string; error?: string; tone: Tone }) {
  if (!error) return null;
  return (
    <p id={`${id}-error`} role="alert" className={`mt-1.5 text-sm ${tone === 'dark' ? 'text-red-300' : 'text-red-600'}`}>
      {error}
    </p>
  );
}

/**
 * A text field with its label inside the box, which keeps the forms short enough to fit on one screen. A
 * placeholder, if given, only shows while the field is focused.
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
          className={`h-[52px] pb-1 pt-[18px] ${boxClass(tone, error)}`}
        />
        <label htmlFor={id} className={labelClass(tone)}>
          {label}
        </label>
      </div>
      <ErrorText id={id} error={error} tone={tone} />
    </div>
  );
}

const MAX_HEIGHT = 128;

/** The same field as a text area: one line tall when empty, growing with the text up to about four lines. */
export function FloatTextArea({
  id,
  label,
  value,
  onChange,
  placeholder = ' ',
  tone = 'light',
}: {
  id: string;
  label: string;
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  tone?: Tone;
}) {
  const ref = useRef<HTMLTextAreaElement>(null);

  useLayoutEffect(() => {
    const el = ref.current;
    if (!el) return;
    el.style.height = 'auto';
    // While empty it stays one line tall, even if the placeholder would wrap.
    el.style.height = value ? `${Math.min(el.scrollHeight, MAX_HEIGHT)}px` : '';
  }, [value]);

  return (
    <div className="relative">
      <textarea
        ref={ref}
        id={id}
        rows={1}
        value={value}
        placeholder={placeholder}
        onChange={(e) => onChange(e.target.value)}
        className={`h-[52px] min-h-[52px] resize-none pb-2 pt-5 leading-6 ${boxClass(tone)}`}
      />
      <label htmlFor={id} className={labelClass(tone)}>
        {label}
      </label>
    </div>
  );
}
