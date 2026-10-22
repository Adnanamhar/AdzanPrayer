'use client';

export function ShalatOverlay({
    show,
    isFriday
}: {
    show: boolean;
    isFriday: boolean;
}) {
  return (
    <div id="shalat-mode" className={`shalat-overlay ${show ? '' : 'hidden'}`}>
      <div className="shalat-content">
        <div className="shalat-icon">🕋</div>
        <div className="shalat-text">LURUS DAN RAPATKAN SHAF</div>
        <div className="shalat-sub">
            {isFriday ? "Harap tenang, khutbah Jum'at sedang berlangsung" : "Harap menonaktifkan ponsel Anda"}
        </div>
      </div>
    </div>
  );
}
