type SectionHeadingProps = {
  eyebrow?: string;
  title: string;
  lead?: string;
  align?: "left" | "center";
};

export function SectionHeading({ eyebrow, title, lead, align = "center" }: SectionHeadingProps) {
  return (
    <div className={`section-heading section-heading-${align}`}>
      {eyebrow ? <p className="eyebrow">{eyebrow}</p> : null}
      <h2>{title}</h2>
      {lead ? <p>{lead}</p> : null}
    </div>
  );
}
