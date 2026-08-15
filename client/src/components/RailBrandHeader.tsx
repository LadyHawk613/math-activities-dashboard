/**
 * Tactile Number Studio — the rail header keeps the full Math Activity Hub mark consistent on every learning surface.
 */
const brandMark = "https://files.manuscdn.com/user_upload_by_module/session_file/310519663746785263/vqEdiYIDCATHBBCS.png";

export default function RailBrandHeader({ onClick }: { onClick?: () => void }) {
  const content = <><img src={brandMark} alt="" /><span>math<br />activity<br /><b>hub</b></span></>;
  return onClick ? <button className="rail-brand-header" onClick={onClick} aria-label="Return to Math Activity Hub">{content}</button> : <div className="rail-brand-header" aria-label="Math Activity Hub">{content}</div>;
}
