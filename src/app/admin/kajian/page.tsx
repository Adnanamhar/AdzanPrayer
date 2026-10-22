'use client';

import { useState } from 'react';
import { useAdminStore } from '@/stores/adminStore';
import type { KajianItem, RecurrenceType } from '@/types/kajian';

const daysOfWeek = ['Ahad', 'Senin', 'Selasa', 'Rabu', 'Kamis', 'Jumat', 'Sabtu'];
const weekOptions = [
  { val: 0, label: 'Setiap Pekan' },
  { val: 1, label: 'Pekan Ke-1 Saja' },
  { val: 2, label: 'Pekan Ke-2 Saja' },
  { val: 3, label: 'Pekan Ke-3 Saja' },
  { val: 4, label: 'Pekan Ke-4 Saja' }
];

interface IosToggleProps {
  checked: boolean;
  onChange: (val: boolean) => void;
  label: string;
  activeColor?: string;
  description?: string;
}

function IosToggle({
  checked,
  onChange,
  label,
  activeColor = '#10B981',
  description
}: IosToggleProps) {
  return (
    <label
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: '9px',
        cursor: 'pointer',
        userSelect: 'none'
      }}
    >
      <div
        role="switch"
        aria-checked={checked}
        onClick={e => {
          e.preventDefault();
          onChange(!checked);
        }}
        style={{
          width: '42px',
          height: '24px',
          borderRadius: '9999px',
          backgroundColor: checked ? activeColor : '#CBD5E1',
          position: 'relative',
          transition: 'background-color 0.22s cubic-bezier(0.4, 0, 0.2, 1)',
          boxShadow: 'inset 0 1px 3px rgba(0,0,0,0.12)',
          cursor: 'pointer',
          flexShrink: 0
        }}
      >
        <div
          style={{
            width: '18px',
            height: '18px',
            borderRadius: '50%',
            backgroundColor: '#FFFFFF',
            position: 'absolute',
            top: '3px',
            left: '3px',
            transform: checked ? 'translateX(18px)' : 'translateX(0px)',
            transition: 'transform 0.22s cubic-bezier(0.4, 0, 0.2, 1)',
            boxShadow: '0 2px 5px rgba(0, 0, 0, 0.22)'
          }}
        />
      </div>
      <div style={{ display: 'flex', flexDirection: 'column' }}>
        <span style={{ fontSize: '12.5px', fontWeight: 600, color: '#334155', lineHeight: 1.2 }}>{label}</span>
        {description && <span style={{ fontSize: '11px', color: '#64748B' }}>{description}</span>}
      </div>
    </label>
  );
}

export default function KajianPage() {
  const { data, updateData, isLoading } = useAdminStore();
  const [filterMode, setFilterMode] = useState<'active' | 'expired' | 'all'>('active');
  const [searchQuery, setSearchQuery] = useState('');
  const [recFilter, setRecFilter] = useState<string>('all');
  const [deleteConfirmId, setDeleteConfirmId] = useState<string | null>(null);
  const [previewKajianId, setPreviewKajianId] = useState<string | null>(null);

  if (isLoading) return <div>Memuat data...</div>;

  const handleChange = (idx: number, field: keyof KajianItem, val: any) => {
    const newKajian = [...data.kajianList];
    newKajian[idx] = { ...newKajian[idx], [field]: val };
    updateData({ kajianList: newKajian });
  };

  const handleAdd = () => {
    const todayStr = new Date().toISOString().split('T')[0];
    const newItem: KajianItem = {
      id: `kajian-${Date.now()}`,
      title: 'Kajian Rutin Tematik',
      ustadz: 'Ustadz Pembina',
      date: todayStr,
      startTime: "Ba'da Maghrib",
      endTime: '',
      note: 'Terbuka untuk umum',
      priority: 1,
      recurrence: 'weekly',
      recurringDay: new Date().getDay(),
      recurringWeek: 0,
      isActive: true,
      isPublic: true,
      audience: 'all'
    };
    updateData({ kajianList: [newItem, ...data.kajianList] });
    setPreviewKajianId(newItem.id);
    setFilterMode('active');
  };

  const handleDuplicate = (idx: number) => {
    const source = data.kajianList[idx];
    const cloned: KajianItem = {
      ...source,
      id: `kajian-${Date.now()}`,
      title: `${source.title} (Salinan)`,
      isPublic: source.isPublic !== false
    };
    const updated = [...data.kajianList];
    updated.splice(idx + 1, 0, cloned);
    updateData({ kajianList: updated });
  };

  const handleReschedule = (idx: number) => {
    // Jadwalkan ulang ke hari ini atau besok
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    const dateStr = tomorrow.toISOString().split('T')[0];

    const updated = [...data.kajianList];
    updated[idx] = {
      ...updated[idx],
      date: dateStr,
      isActive: true
    };
    updateData({ kajianList: updated });
    setFilterMode('active');
    setPreviewKajianId(updated[idx].id);
  };

  const handleDel = (id: string) => {
    const newKajian = data.kajianList.filter(k => k.id !== id);
    updateData({ kajianList: newKajian });
    setDeleteConfirmId(null);
    if (previewKajianId === id) {
      setPreviewKajianId(newKajian[0]?.id || null);
    }
  };

  const waktuOptions = [
    "Ba'da Shubuh",
    "Ba'da Dzuhur",
    "Ba'da Ashar",
    "Ba'da Maghrib",
    "Ba'da Isya",
    "Pukul 06:00 WIB",
    "Pukul 08:30 WIB",
    "Pukul 09:00 WIB"
  ];

  // Helper untuk menentukan status event
  const getKajianStatus = (k: KajianItem) => {
    if (k.isActive === false) return { label: 'Nonaktif', color: '#64748B', bg: '#F1F5F9', isExpired: false };

    const rec = k.recurrence || 'none';
    if (rec === 'daily') return { label: 'Rutin Harian', color: '#7C3AED', bg: '#F3E8FF', isExpired: false };
    if (rec === 'weekly') {
      const dayName = daysOfWeek[k.recurringDay ?? 0];
      return { label: `Rutin Tiap ${dayName}`, color: '#2563EB', bg: '#EFF6FF', isExpired: false };
    }
    if (rec === 'monthly') {
      const dayName = daysOfWeek[k.recurringDay ?? 0];
      const wLabel = k.recurringWeek ? `Pekan ke-${k.recurringWeek}` : 'Setiap Pekan';
      return { label: `Bulanan (${wLabel} ${dayName})`, color: '#0891B2', bg: '#ECFEFF', isExpired: false };
    }

    // Untuk sekali jalan (one-off)
    if (!k.date) return { label: 'Tanggal Belum Diisi', color: '#DC2626', bg: '#FEF2F2', isExpired: false };

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const parts = k.date.split('-');
    if (parts.length === 3) {
      const kDate = new Date(parseInt(parts[0]), parseInt(parts[1]) - 1, parseInt(parts[2]));
      kDate.setHours(0, 0, 0, 0);

      if (kDate.getTime() === today.getTime()) {
        return { label: '🟢 Berlangsung Hari Ini', color: '#16A34A', bg: '#DCFCE7', isExpired: false };
      } else if (kDate.getTime() > today.getTime()) {
        return { label: '🔵 Mendatang', color: '#2563EB', bg: '#DBEAFE', isExpired: false };
      } else {
        return { label: '⚪ Sudah Terlewat (Arsip)', color: '#64748B', bg: '#F1F5F9', isExpired: true };
      }
    }

    return { label: 'Mendatang', color: '#2563EB', bg: '#DBEAFE', isExpired: false };
  };

  // Hitung jumlah item tiap kategori
  const activeCount = data.kajianList.filter(k => k.isActive !== false && !getKajianStatus(k).isExpired).length;
  const expiredCount = data.kajianList.filter(k => getKajianStatus(k).isExpired || k.isActive === false).length;
  const allCount = data.kajianList.length;

  // Filter list berdasarkan tab kategori, search query, dan filter frekuensi
  const filteredList = data.kajianList
    .map((k, idx) => ({ k, idx }))
    .filter(({ k }) => {
      const status = getKajianStatus(k);

      // 1. Tab kategori filter
      if (filterMode === 'active') {
        if (k.isActive === false || status.isExpired) return false;
      } else if (filterMode === 'expired') {
        if (!status.isExpired && k.isActive !== false) return false;
      }

      // 2. Search query filter (judul & ustadz)
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase().trim();
        const matchTitle = (k.title || '').toLowerCase().includes(q);
        const matchUstadz = (k.ustadz || '').toLowerCase().includes(q);
        if (!matchTitle && !matchUstadz) return false;
      }

      // 3. Recurrence filter
      if (recFilter !== 'all') {
        const rec = k.recurrence || 'none';
        if (rec !== recFilter) return false;
      }

      return true;
    });

  const previewItem = data.kajianList.find(k => k.id === previewKajianId) || data.kajianList[0];

  return (
    <div>
      {/* CARD 1: LIVE TV SLIDE PREVIEW (100% IDENTIK DENGAN TV) */}
      {previewItem && (() => {
        let dateLabel = '-';
        if (previewItem.recurrence === 'weekly') {
          dateLabel = `Setiap Hari ${daysOfWeek[previewItem.recurringDay ?? 0]}`;
        } else if (previewItem.recurrence === 'daily') {
          dateLabel = 'Setiap Hari (Rutin)';
        } else if (previewItem.recurrence === 'monthly') {
          const wLabel = weekOptions.find(w => w.val === previewItem.recurringWeek)?.label || 'Setiap Pekan';
          dateLabel = `Bulanan (${wLabel} ${daysOfWeek[previewItem.recurringDay ?? 0]})`;
        } else if (previewItem.date) {
          const parts = previewItem.date.split('-');
          if (parts.length === 3) {
            const dObj = new Date(parseInt(parts[0]), parseInt(parts[1]) - 1, parseInt(parts[2]));
            dateLabel = dObj.toLocaleDateString('id-ID', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' });
          }
        }

        const audienceMap: Record<string, { label: string; icon: string }> = {
          ikhwan: { label: 'Khusus Ikhwan', icon: '🧔' },
          akhwat: { label: 'Khusus Akhwat', icon: '🧕' },
          all: { label: 'Ikhwan & Akhwat', icon: '👥' }
        };
        const aud = audienceMap[previewItem.audience || 'all'] || { label: 'Ikhwan & Akhwat', icon: '👥' };
        const isPublic = previewItem.isPublic !== false;
        const publicLabel = isPublic ? '✨ Terbuka Untuk Umum' : '🔒 Khusus Jamaah Masjid';

        return (
          <div className="card" style={{ background: '#0B0D1B', borderColor: '#1E293B', color: '#fff' }}>
            <div className="card-title" style={{ color: '#F8FAFC', borderBottomColor: '#1E293B', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <span>📺</span> Live Preview Slide Kajian (Sesuai Tampilan TV)
              </span>
              <span style={{ fontSize: '12px', background: '#334155', color: '#94A3B8', padding: '4px 10px', borderRadius: '6px' }}>
                Menampilkan: {previewItem.title || 'Untitled'}
              </span>
            </div>

            {/* Poster Flyer Container Recreation Matching TV Exactly */}
            <div style={{ maxWidth: '880px', margin: '0 auto', background: 'radial-gradient(circle at 88% 18%, rgba(212, 175, 55, 0.16) 0%, transparent 45%), radial-gradient(circle at 12% 82%, rgba(30, 58, 138, 0.25) 0%, transparent 50%), linear-gradient(145deg, #070914 0%, #0F1326 50%, #080A14 100%)', borderRadius: '18px', padding: '24px 28px 22px 28px', border: '2px solid rgba(212, 175, 55, 0.45)', boxShadow: '0 16px 40px rgba(0,0,0,0.6)', position: 'relative', overflow: 'hidden', display: 'flex', flexDirection: 'column', gap: '16px' }}>
              {/* Header */}
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1.5px solid rgba(212, 175, 55, 0.35)', paddingBottom: '12px' }}>
                <div style={{ background: 'linear-gradient(135deg, #D4AF37 0%, #F5DE88 50%, #C5A059 100%)', color: '#121324', fontSize: '11.5px', fontWeight: 900, letterSpacing: '2px', padding: '6px 16px', borderRadius: '9999px', textTransform: 'uppercase', display: 'inline-flex', alignItems: 'center', gap: '6px', boxShadow: '0 4px 14px rgba(212, 175, 55, 0.35)' }}>
                  <span>🕌</span> KAJIAN RUTIN MASJID
                </div>
                <div style={{ fontSize: '13.5px', fontWeight: 700, color: '#F5DE88', display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <span>✦</span> {data.mosqueName || 'Majelis Taklim'}
                </div>
              </div>

              {/* 1. TEMA & JUDUL KAJIAN (FULL WIDTH) */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                <div style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', fontSize: '10.5px', fontWeight: 800, letterSpacing: '2px', color: '#F5DE88', textTransform: 'uppercase' }}>
                  <span>✦</span> TEMA / JUDUL KAJIAN
                </div>
                <div style={{ fontSize: '26px', fontWeight: 900, color: '#FFFFFF', lineHeight: 1.25, letterSpacing: '-0.3px', textShadow: '0 2px 10px rgba(0,0,0,0.6)' }}>
                  {previewItem.title || 'Judul Kajian Akan Muncul Di Sini'}
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginTop: '2px' }}>
                  <span style={{ background: 'rgba(255, 255, 255, 0.08)', border: '1px solid rgba(255, 255, 255, 0.16)', color: '#E2E8F0', fontSize: '11px', fontWeight: 700, padding: '4px 12px', borderRadius: '9999px' }}>
                    {aud.icon} {aud.label}
                  </span>
                  <span style={{ background: isPublic ? 'rgba(212, 175, 55, 0.16)' : 'rgba(255, 255, 255, 0.08)', border: `1px solid ${isPublic ? 'rgba(212, 175, 55, 0.45)' : 'rgba(255, 255, 255, 0.2)'}`, color: isPublic ? '#F5DE88' : '#CBD5E1', fontSize: '11px', fontWeight: 700, padding: '4px 12px', borderRadius: '9999px' }}>
                    {publicLabel}
                  </span>
                </div>
              </div>

              {/* 2. NARASUMBER / PEMATERI (FULL WIDTH STRIP DI BAWAH JUDUL) */}
              <div style={{ background: 'linear-gradient(135deg, rgba(212, 175, 55, 0.16) 0%, rgba(20, 24, 48, 0.78) 100%)', border: '1.5px solid rgba(212, 175, 55, 0.45)', borderLeft: '5px solid #D4AF37', borderRadius: '16px', padding: '12px 20px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '16px', boxShadow: '0 6px 20px rgba(0,0,0,0.35)', minHeight: '68px', boxSizing: 'border-box', width: '100%' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '14px', minWidth: 0 }}>
                  <div style={{ width: '44px', height: '44px', borderRadius: '50%', background: 'linear-gradient(135deg, #F5DE88 0%, #D4AF37 50%, #99731E 100%)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '20px', flexShrink: 0, boxShadow: '0 4px 14px rgba(212, 175, 55, 0.4)' }}>
                    🎙️
                  </div>
                  <div style={{ display: 'flex', flexDirection: 'column', minWidth: 0 }}>
                    <span style={{ fontSize: '9px', fontWeight: 800, color: '#F5DE88', letterSpacing: '1.6px', textTransform: 'uppercase' }}>Narasumber / Pemateri</span>
                    <span style={{ fontSize: '18px', fontWeight: 900, color: '#FFFFFF', lineHeight: 1.25, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{previewItem.ustadz || 'Nama Pemateri / Ustadz'}</span>
                  </div>
                </div>
                <div style={{ background: 'rgba(212, 175, 55, 0.16)', border: '1px solid rgba(212, 175, 55, 0.4)', color: '#F5DE88', fontSize: '11px', fontWeight: 700, padding: '4px 14px', borderRadius: '9999px', whiteSpace: 'nowrap', flexShrink: 0 }}>
                  Pengisi Majelis Taklim
                </div>
              </div>

              {/* 3. 3-Column Schedule Grid (Hari, Waktu, Lokasi) */}
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '12px' }}>
                <div style={{ background: 'linear-gradient(135deg, rgba(255, 255, 255, 0.08) 0%, rgba(255, 255, 255, 0.02) 100%)', border: '1px solid rgba(212, 175, 55, 0.35)', borderRadius: '14px', padding: '12px 14px', display: 'flex', alignItems: 'center', gap: '12px', minHeight: '74px', boxSizing: 'border-box' }}>
                  <div style={{ width: '38px', height: '38px', borderRadius: '10px', background: 'linear-gradient(135deg, rgba(212, 175, 55, 0.25) 0%, rgba(212, 175, 55, 0.08) 100%)', border: '1px solid rgba(212, 175, 55, 0.4)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '18px', flexShrink: 0 }}>
                    📅
                  </div>
                  <div style={{ display: 'flex', flexDirection: 'column', minWidth: 0, flex: 1 }}>
                    <span style={{ fontSize: '9px', fontWeight: 800, color: '#F5DE88', letterSpacing: '1.5px' }}>HARI / TANGGAL</span>
                    <span style={{ fontSize: '13.5px', fontWeight: 800, color: '#FFFFFF', lineHeight: 1.35, display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>{dateLabel}</span>
                  </div>
                </div>

                <div style={{ background: 'linear-gradient(135deg, rgba(255, 255, 255, 0.08) 0%, rgba(255, 255, 255, 0.02) 100%)', border: '1px solid rgba(212, 175, 55, 0.35)', borderRadius: '14px', padding: '12px 14px', display: 'flex', alignItems: 'center', gap: '12px', minHeight: '74px', boxSizing: 'border-box' }}>
                  <div style={{ width: '38px', height: '38px', borderRadius: '10px', background: 'linear-gradient(135deg, rgba(212, 175, 55, 0.25) 0%, rgba(212, 175, 55, 0.08) 100%)', border: '1px solid rgba(212, 175, 55, 0.4)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '18px', flexShrink: 0 }}>
                    ⏰
                  </div>
                  <div style={{ display: 'flex', flexDirection: 'column', minWidth: 0, flex: 1 }}>
                    <span style={{ fontSize: '9px', fontWeight: 800, color: '#F5DE88', letterSpacing: '1.5px' }}>WAKTU PELAKSANAAN</span>
                    <span style={{ fontSize: '13.5px', fontWeight: 800, color: '#FFFFFF', lineHeight: 1.35, display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
                      {previewItem.startTime || '-'} {previewItem.endTime ? `- ${previewItem.endTime}` : '- Selesai'}
                    </span>
                  </div>
                </div>

                <div style={{ background: 'linear-gradient(135deg, rgba(255, 255, 255, 0.08) 0%, rgba(255, 255, 255, 0.02) 100%)', border: '1px solid rgba(212, 175, 55, 0.35)', borderRadius: '14px', padding: '12px 14px', display: 'flex', alignItems: 'center', gap: '12px', minHeight: '74px', boxSizing: 'border-box' }}>
                  <div style={{ width: '38px', height: '38px', borderRadius: '10px', background: 'linear-gradient(135deg, rgba(212, 175, 55, 0.25) 0%, rgba(212, 175, 55, 0.08) 100%)', border: '1px solid rgba(212, 175, 55, 0.4)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '18px', flexShrink: 0 }}>
                    📍
                  </div>
                  <div style={{ display: 'flex', flexDirection: 'column', minWidth: 0, flex: 1 }}>
                    <span style={{ fontSize: '9px', fontWeight: 800, color: '#F5DE88', letterSpacing: '1.5px' }}>LOKASI / TEMPAT</span>
                    <span style={{ fontSize: '13.5px', fontWeight: 800, color: '#FFFFFF', lineHeight: 1.35, display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
                      {data.mosqueName || 'Ruang Utama Masjid'}
                    </span>
                  </div>
                </div>
              </div>

              {/* 4. Notes & Persiapan Jamaah Banner (HANYA TEKS YANG DIINPUTKAN) */}
              <div style={{ background: 'linear-gradient(135deg, rgba(212, 175, 55, 0.12) 0%, rgba(255, 255, 255, 0.03) 100%)', border: '1px solid rgba(212, 175, 55, 0.35)', borderRadius: '14px', padding: '10px 16px', display: 'flex', alignItems: 'center', gap: '12px', minHeight: '52px', boxSizing: 'border-box' }}>
                <div style={{ width: '34px', height: '34px', borderRadius: '8px', background: 'rgba(212, 175, 55, 0.22)', border: '1px solid rgba(212, 175, 55, 0.38)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '16px', flexShrink: 0 }}>
                  📝
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', minWidth: 0, flex: 1 }}>
                  <span style={{ fontSize: '9px', fontWeight: 800, color: '#F5DE88', letterSpacing: '1.5px' }}>CATATAN &amp; PERSIAPAN JAMAAH</span>
                  <span style={{ fontSize: '12.5px', fontWeight: 600, color: '#F1F5F9', lineHeight: 1.35, display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
                    {previewItem.note || 'Silakan hadir tepat waktu mengajak keluarga & kerabat untuk menuntut ilmu bersama.'}
                  </span>
                </div>
              </div>

              {/* 5. Footer (Quote Hadits Bersih Tanpa Duplikasi Badge) */}
              <div style={{ background: 'rgba(0, 0, 0, 0.45)', borderRadius: '12px', padding: '10px 16px', display: 'flex', justifyContent: 'center', alignItems: 'center', textAlign: 'center', border: '1px solid rgba(212, 175, 55, 0.3)', minHeight: '38px', boxSizing: 'border-box' }}>
                <span style={{ fontSize: '11.5px', fontStyle: 'italic', color: 'rgba(255, 255, 255, 0.9)' }}>
                  &ldquo;Barangsiapa menempuh jalan untuk menuntut ilmu, Allah mudahkan baginya jalan ke surga.&rdquo; (HR. Muslim)
                </span>
              </div>
            </div>
          </div>
        );
      })()}

      {/* CARD 2: KAJIAN LIST & CRUD CONTROLS */}
      <div className="card">
        {/* TOP TOOLBAR: TABS & ADD BUTTON */}
        <div className="card-title" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', width: '100%', flexWrap: 'wrap', gap: '12px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '16px', flexWrap: 'wrap' }}>
            <span>Daftar Jadwal Kajian</span>
            {/* CATEGORY TABS */}
            <div style={{ display: 'flex', background: '#F1F5F9', borderRadius: '8px', padding: '3px', gap: '2px' }}>
              <button
                type="button"
                className="btn"
                style={{
                  padding: '5px 14px',
                  fontSize: '12px',
                  fontWeight: filterMode === 'active' ? 700 : 500,
                  background: filterMode === 'active' ? '#fff' : 'transparent',
                  color: filterMode === 'active' ? '#2563EB' : '#64748B',
                  boxShadow: filterMode === 'active' ? '0 1px 3px rgba(0,0,0,0.1)' : 'none',
                  borderRadius: '6px'
                }}
                onClick={() => setFilterMode('active')}
              >
                🟢 Aktif & Mendatang ({activeCount})
              </button>
              <button
                type="button"
                className="btn"
                style={{
                  padding: '5px 14px',
                  fontSize: '12px',
                  fontWeight: filterMode === 'expired' ? 700 : 500,
                  background: filterMode === 'expired' ? '#fff' : 'transparent',
                  color: filterMode === 'expired' ? '#DC2626' : '#64748B',
                  boxShadow: filterMode === 'expired' ? '0 1px 3px rgba(0,0,0,0.1)' : 'none',
                  borderRadius: '6px'
                }}
                onClick={() => setFilterMode('expired')}
              >
                📦 Sudah Terlewat / Arsip ({expiredCount})
              </button>
              <button
                type="button"
                className="btn"
                style={{
                  padding: '5px 14px',
                  fontSize: '12px',
                  fontWeight: filterMode === 'all' ? 700 : 500,
                  background: filterMode === 'all' ? '#fff' : 'transparent',
                  color: filterMode === 'all' ? '#0F172A' : '#64748B',
                  boxShadow: filterMode === 'all' ? '0 1px 3px rgba(0,0,0,0.1)' : 'none',
                  borderRadius: '6px'
                }}
                onClick={() => setFilterMode('all')}
              >
                📑 Semua ({allCount})
              </button>
            </div>
          </div>
          <button className="btn btn-primary" onClick={handleAdd}>
            + Tambah Kajian Baru
          </button>
        </div>

        {/* SEARCH BAR & FILTER FREKUENSI */}
        <div style={{ display: 'flex', gap: '12px', marginBottom: '20px', flexWrap: 'wrap', alignItems: 'center' }}>
          <div style={{ flex: '1', minWidth: '240px', position: 'relative' }}>
            <input
              type="text"
              className="form-control"
              placeholder="🔍 Cari berdasarkan tema atau nama ustadz..."
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              style={{ paddingLeft: '14px' }}
            />
          </div>
          <div style={{ minWidth: '180px' }}>
            <select
              className="form-control"
              value={recFilter}
              onChange={e => setRecFilter(e.target.value)}
            >
              <option value="all">Semua Frekuensi</option>
              <option value="weekly">Rutin Mingguan</option>
              <option value="daily">Rutin Harian</option>
              <option value="monthly">Rutin Bulanan</option>
              <option value="none">Sekali Saja</option>
            </select>
          </div>
        </div>

        {/* KAJIAN ITEMS LIST */}
        {filteredList.map(({ k, idx }) => {
          const status = getKajianStatus(k);
          const isCustomWaktu = !waktuOptions.includes(k.startTime) && k.startTime !== '';
          const recType = k.recurrence || 'none';

          return (
            <div
              key={k.id}
              style={{
                border: previewKajianId === k.id ? '2px solid #2563EB' : status.isExpired ? '1px dashed #CBD5E1' : '1px solid #E2E8F0',
                borderRadius: '16px',
                padding: '20px 24px',
                marginBottom: '16px',
                background: status.isExpired || k.isActive === false ? '#F8FAFC' : '#FFFFFF',
                boxShadow: '0 2px 4px rgba(0,0,0,0.02)',
                position: 'relative',
                transition: 'border 0.2s'
              }}
            >
              {/* TOP ACTIONS & STATUS */}
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px', flexWrap: 'wrap', gap: '8px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px', flexWrap: 'wrap' }}>
                  <span
                    style={{
                      background: status.bg,
                      color: status.color,
                      fontSize: '12px',
                      fontWeight: 700,
                      padding: '4px 12px',
                      borderRadius: '8px',
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '4px'
                    }}
                  >
                    {status.label}
                  </span>

                  <IosToggle
                    checked={k.isActive !== false}
                    onChange={val => handleChange(idx, 'isActive', val)}
                    label={k.isActive !== false ? 'Aktif di TV' : 'Nonaktif di TV'}
                    activeColor="#10B981"
                  />
                </div>

                <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                  {status.isExpired && (
                    <button
                      type="button"
                      className="btn"
                      style={{ background: '#DCFCE7', color: '#16A34A', fontSize: '12px', padding: '6px 12px', fontWeight: 700 }}
                      onClick={() => handleReschedule(idx)}
                      title="Jadwalkan ulang kajian ini agar aktif kembali"
                    >
                      📅 Jadwalkan Ulang
                    </button>
                  )}

                  <button
                    className="btn"
                    style={{ background: '#F1F5F9', color: '#0F172A', fontSize: '12px', padding: '6px 12px' }}
                    onClick={() => setPreviewKajianId(k.id)}
                  >
                    👁️ Preview Slide
                  </button>

                  <button
                    type="button"
                    className="btn"
                    style={{ background: '#F1F5F9', color: '#0F172A', fontSize: '12px', padding: '6px 12px' }}
                    onClick={() => handleDuplicate(idx)}
                    title="Salin / Duplikat Kajian"
                  >
                    📋 Duplikat
                  </button>

                  {deleteConfirmId === k.id ? (
                    <div style={{ display: 'flex', alignItems: 'center', gap: '4px', background: '#FEF2F2', padding: '2px 6px', borderRadius: '8px', border: '1px solid #FECACA' }}>
                      <span style={{ fontSize: '11px', fontWeight: 700, color: '#DC2626' }}>Hapus?</span>
                      <button
                        type="button"
                        className="btn"
                        style={{ background: '#DC2626', color: '#fff', fontSize: '11px', padding: '3px 8px', borderRadius: '6px' }}
                        onClick={() => handleDel(k.id)}
                      >
                        Ya
                      </button>
                      <button
                        type="button"
                        className="btn"
                        style={{ background: '#E2E8F0', color: '#0F172A', fontSize: '11px', padding: '3px 8px', borderRadius: '6px' }}
                        onClick={() => setDeleteConfirmId(null)}
                      >
                        Batal
                      </button>
                    </div>
                  ) : (
                    <button
                      type="button"
                      className="btn"
                      style={{ background: '#FEE2E2', color: '#DC2626', fontSize: '12px', padding: '6px 12px' }}
                      onClick={() => setDeleteConfirmId(k.id)}
                    >
                      🗑️ Hapus
                    </button>
                  )}
                </div>
              </div>

              {/* FORM FIELDS */}
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '16px' }}>
                <div className="form-group" style={{ marginBottom: 0 }}>
                  <label className="form-label">Tema / Judul Kajian</label>
                  <input
                    type="text"
                    className="form-control"
                    value={k.title}
                    placeholder="Misal: Kajian Kitab Bulughul Maram"
                    onChange={e => handleChange(idx, 'title', e.target.value)}
                  />
                </div>

                <div className="form-group" style={{ marginBottom: 0 }}>
                  <label className="form-label">Pemateri (Ustadz)</label>
                  <input
                    type="text"
                    className="form-control"
                    value={k.ustadz}
                    placeholder="Misal: Ustadz Dr. Syafiq Riza Basalamah"
                    onChange={e => handleChange(idx, 'ustadz', e.target.value)}
                  />
                </div>

                {/* AUDIENCE / SASARAN PESERTA */}
                <div className="form-group" style={{ marginBottom: 0 }}>
                  <label className="form-label">Peserta / Sasaran Jama&apos;ah</label>
                  <select
                    className="form-control"
                    value={k.audience || 'all'}
                    onChange={e => handleChange(idx, 'audience', e.target.value as any)}
                  >
                    <option value="all">Ikhwan &amp; Akhwat (Umum)</option>
                    <option value="ikhwan">Khusus Ikhwan</option>
                    <option value="akhwat">Khusus Akhwat</option>
                  </select>
                </div>

                {/* AKSES JAMAAH: TERBUKA UNTUK UMUM ATAU KHUSUS */}
                <div className="form-group" style={{ marginBottom: 0 }}>
                  <label className="form-label">Akses Jama&apos;ah</label>
                  <div style={{ display: 'flex', alignItems: 'center', height: '42px', paddingLeft: '4px' }}>
                    <IosToggle
                      checked={k.isPublic !== false}
                      onChange={val => handleChange(idx, 'isPublic', val)}
                      label={k.isPublic !== false ? '✨ Terbuka Untuk Umum' : '🔒 Khusus Jamaah Masjid'}
                      activeColor="#D4AF37"
                    />
                  </div>
                </div>

                {/* RECURRENCE SELECTOR */}
                <div className="form-group" style={{ marginBottom: 0 }}>
                  <label className="form-label">Frekuensi / Jadwal Berulang</label>
                  <select
                    className="form-control"
                    value={recType}
                    onChange={e => handleChange(idx, 'recurrence', e.target.value as RecurrenceType)}
                  >
                    <option value="weekly">Setiap Pekan (Rutin Mingguan)</option>
                    <option value="none">Sekali Saja (Tanggal Tertentu)</option>
                    <option value="monthly">Bulanan (Pekan Tertentu Tiap Bulan)</option>
                    <option value="daily">Setiap Hari (Rutin Harian)</option>
                  </select>
                </div>

                {/* JIKA RECURRENCE: WEEKLY */}
                {recType === 'weekly' && (
                  <div className="form-group" style={{ marginBottom: 0 }}>
                    <label className="form-label">Pilih Hari Rutin</label>
                    <select
                      className="form-control"
                      value={k.recurringDay ?? 0}
                      onChange={e => handleChange(idx, 'recurringDay', parseInt(e.target.value))}
                    >
                      {daysOfWeek.map((day, dIdx) => (
                        <option key={dIdx} value={dIdx}>Setiap Hari {day}</option>
                      ))}
                    </select>
                  </div>
                )}

                {/* JIKA RECURRENCE: MONTHLY */}
                {recType === 'monthly' && (
                  <div className="form-group" style={{ marginBottom: 0, display: 'flex', gap: '8px' }}>
                    <div style={{ flex: 1 }}>
                      <label className="form-label">Pekan Ke-</label>
                      <select
                        className="form-control"
                        value={k.recurringWeek ?? 1}
                        onChange={e => handleChange(idx, 'recurringWeek', parseInt(e.target.value))}
                      >
                        {weekOptions.map(w => (
                          <option key={w.val} value={w.val}>{w.label}</option>
                        ))}
                      </select>
                    </div>
                    <div style={{ flex: 1 }}>
                      <label className="form-label">Hari</label>
                      <select
                        className="form-control"
                        value={k.recurringDay ?? 0}
                        onChange={e => handleChange(idx, 'recurringDay', parseInt(e.target.value))}
                      >
                        {daysOfWeek.map((day, dIdx) => (
                          <option key={dIdx} value={dIdx}>{day}</option>
                        ))}
                      </select>
                    </div>
                  </div>
                )}

                {/* JIKA RECURRENCE: NONE (TANGGAL TERTENTU) */}
                {recType === 'none' && (
                  <div className="form-group" style={{ marginBottom: 0 }}>
                    <label className="form-label">Tanggal Pelaksanaan</label>
                    <input
                      type="date"
                      className="form-control"
                      style={{ cursor: 'pointer' }}
                      value={k.date}
                      onClick={e => (e.target as HTMLInputElement).showPicker()}
                      onChange={e => handleChange(idx, 'date', e.target.value)}
                    />
                  </div>
                )}

                {/* WAKTU MULAI */}
                <div className="form-group" style={{ marginBottom: 0 }}>
                  <label className="form-label">Waktu Kajian</label>
                  <div style={{ display: 'flex', gap: '8px' }}>
                    <select
                      className="form-control"
                      style={{ width: isCustomWaktu ? '40%' : '100%', cursor: 'pointer' }}
                      value={isCustomWaktu ? 'lainnya' : k.startTime}
                      onChange={e => {
                        if (e.target.value !== 'lainnya') {
                          handleChange(idx, 'startTime', e.target.value);
                        } else {
                          handleChange(idx, 'startTime', ' ');
                        }
                      }}
                    >
                      <option value="">-- Pilih Waktu --</option>
                      {waktuOptions.map(opt => (
                        <option key={opt} value={opt}>{opt}</option>
                      ))}
                      <option value="lainnya">Lainnya...</option>
                    </select>

                    {isCustomWaktu && (
                      <input
                        type="text"
                        className="form-control"
                        style={{ width: '60%' }}
                        placeholder="Ketik waktu..."
                        value={k.startTime.trim()}
                        onChange={e => handleChange(idx, 'startTime', e.target.value)}
                      />
                    )}
                  </div>
                </div>

                <div className="form-group" style={{ gridColumn: '1 / -1', marginBottom: 0 }}>
                  <label className="form-label">Keterangan Tambahan / Lokasi / Fasilitas</label>
                  <input
                    type="text"
                    className="form-control"
                    value={k.note || ''}
                    onChange={e => handleChange(idx, 'note', e.target.value)}
                    placeholder="Misal: Disediakan konsumsi & snack ba'da sholat"
                  />
                </div>
              </div>
            </div>
          );
        })}

        {filteredList.length === 0 && (
          <div style={{ textAlign: 'center', color: '#64748B', padding: '48px 0', background: '#F8FAFC', borderRadius: '16px', border: '2px dashed #E2E8F0' }}>
            {filterMode === 'expired' ? (
              <span>Tidak ada jadwal kajian yang sudah terlewat atau diarsipkan.</span>
            ) : filterMode === 'active' ? (
              <span>Tidak ada kajian aktif atau mendatang yang cocok dengan pencarian.<br />Klik <strong>+ Tambah Kajian Baru</strong> untuk membuat jadwal kajian.</span>
            ) : (
              <span>Tidak ada jadwal kajian yang cocok dengan filter pencarian.</span>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
