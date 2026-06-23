/** Small badge shown next to a dish, using the label provided by the API. */
export function NewTag({ label }: { label: string }) {
  return <span className="tag-nv">{label}</span>;
}
