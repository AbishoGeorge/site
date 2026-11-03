import { useId } from 'react';
import { HONEYPOT_FIELD } from './lead';

/**
 * A field people never see or reach with the keyboard. Bots that fill in every input fill this one too, and the
 * Worker then drops the submission.
 */
export default function Honeypot({ value, onChange }: { value: string; onChange: (value: string) => void }) {
  const id = useId();
  return (
    <div aria-hidden="true" className="absolute left-[-10000px] top-auto h-px w-px overflow-hidden">
      <label htmlFor={id}>Leave this field empty</label>
      <input
        id={id}
        name={HONEYPOT_FIELD}
        type="text"
        tabIndex={-1}
        autoComplete="off"
        value={value}
        onChange={(e) => onChange(e.target.value)}
      />
    </div>
  );
}
