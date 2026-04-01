import "./../../styles/oasis.css";

type InfoBlockProps = {
  label: string;
  title: string;
  body: string;
  className?: string;
};

export function InfoBlock({
  label,
  title,
  body,
  className = "",
}: InfoBlockProps) {
  return (
    <div className={`o-info-block ${className}`.trim()}>
      <div className="o-info-block__label">{label}</div>
      <div className="o-info-block__title">{title}</div>
      <div className="o-info-block__body">{body}</div>
    </div>
  );
}