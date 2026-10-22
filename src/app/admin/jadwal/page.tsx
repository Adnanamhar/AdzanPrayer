'use client';

import { useAdminStore } from '@/stores/adminStore';
import { NumberStepper } from '../components/NumberStepper';
import { useState, useRef, useEffect, useMemo } from 'react';
import { INDONESIAN_CITIES, CityLocation } from '@/lib/indonesian-cities';

export default function JadwalPage() {
  const { data, updateData, isLoading } = useAdminStore();
  const [geoLoading, setGeoLoading] = useState(false);
  const [geoMsg, setGeoMsg] = useState({ text: '', type: '' });

  // Autocomplete state
  const [searchQuery, setSearchQuery] = useState('');
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (data?.locationName && !searchQuery) {
      setSearchQuery(data.locationName);
    }
  }, [data?.locationName]);

  // Click outside to close dropdown
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const filteredCities = useMemo(() => {
    if (!searchQuery.trim()) {
      return INDONESIAN_CITIES.slice(0, 10);
    }
    const q = searchQuery.toLowerCase().trim();
    return INDONESIAN_CITIES.filter(
      c => c.name.toLowerCase().includes(q) || c.province.toLowerCase().includes(q)
    ).slice(0, 12);
  }, [searchQuery]);

  const selectCity = (city: CityLocation) => {
    setSearchQuery(city.name);
    updateData({
      locationName: city.name,
      timezone: city.timezone,
      kemenagCityId: city.kemenagCityId,
      coords: {
        lat: city.lat,
        lng: city.lng
      }
    });
    setIsOpen(false);
    setGeoMsg({ 
      text: `✓ Lokasi diatur ke ${city.name} (${city.province}, ${city.timezone})`, 
      type: 'success' 
    });
    setTimeout(() => setGeoMsg({ text: '', type: '' }), 4000);
  };

  if (isLoading) return <div>Memuat data...</div>;

  const handleCoordsChange = (field: 'lat' | 'lng', value: string) => {
    updateData({
      coords: {
        ...data.coords,
        [field]: parseFloat(value) || 0
      }
    });
  };

  const handleOffsetChange = (prayer: string, value: number) => {
    updateData({
      offsets: {
        ...data.offsets,
        [prayer]: value
      }
    });
  };

  const getLocation = () => {
    if (!navigator.geolocation) {
        setGeoMsg({ text: "Browser Anda tidak mendukung Geolocation.", type: 'error' });
        return;
    }
    setGeoLoading(true);
    setGeoMsg({ text: '', type: '' });
    navigator.geolocation.getCurrentPosition(
        async (position) => {
            const lat = position.coords.latitude;
            const lng = position.coords.longitude;
            
            // Reverse Geocoding via Nominatim (OpenStreetMap)
            let cityName = data.locationName;
            try {
                const res = await fetch(`https://nominatim.openstreetmap.org/reverse?lat=${lat}&lon=${lng}&format=json`);
                const json = await res.json();
                cityName = json.address.city || json.address.regency || json.address.county || json.address.town || data.locationName;
            } catch (e) {}

            updateData({
                coords: { lat, lng },
                locationName: cityName
            });
            setSearchQuery(cityName);
            setGeoLoading(false);
            setGeoMsg({ text: "Lokasi berhasil diperbarui dari GPS!", type: 'success' });
            setTimeout(() => setGeoMsg({ text: '', type: '' }), 4000);
        },
        (error) => {
            setGeoLoading(false);
            setGeoMsg({ text: "Gagal mengambil lokasi. Pastikan izin aktif.", type: 'error' });
            setTimeout(() => setGeoMsg({ text: '', type: '' }), 4000);
        }
    );
  };

  return (
    <div>
      <div className="card">
        <div className="card-title" style={{ display: 'flex', justifyContent: 'space-between', width: '100%', alignItems: 'center', flexWrap: 'wrap', gap: '10px' }}>
            <span>Lokasi & Metode Kalkulasi</span>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                {geoMsg.text && (
                    <span style={{ fontSize: '13px', fontWeight: 600, color: geoMsg.type === 'success' ? '#16A34A' : '#DC2626' }}>
                        {geoMsg.text}
                    </span>
                )}
                <button className="btn" style={{ background: '#E2E8F0', color: '#0F172A', fontSize: '13px', padding: '8px 16px' }} onClick={getLocation} disabled={geoLoading}>
                    {geoLoading ? '📍 Mencari Lokasi...' : '📍 Gunakan GPS Saat Ini'}
                </button>
            </div>
        </div>

        {/* Quick city selection chips */}
        <div style={{ marginBottom: '20px' }}>
          <div style={{ fontSize: '12px', fontWeight: 600, color: '#64748B', marginBottom: '8px' }}>
            ⚡ Pilih Cepat Kota Besar:
          </div>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
            {[
              'Kota Jakarta Pusat', 
              'Kota Surabaya', 
              'Kota Bandung', 
              'Kota Malang', 
              'Kota Semarang', 
              'Kota Yogyakarta', 
              'Kota Medan', 
              'Kota Makassar',
              'Kota Denpasar'
            ].map(cityName => {
              const city = INDONESIAN_CITIES.find(c => c.name === cityName);
              if (!city) return null;
              const isSelected = data.locationName === city.name;
              return (
                <button
                  key={cityName}
                  type="button"
                  onClick={() => selectCity(city)}
                  style={{
                    padding: '5px 12px',
                    borderRadius: '20px',
                    fontSize: '12px',
                    fontWeight: isSelected ? 700 : 500,
                    background: isSelected ? '#1E293B' : '#F1F5F9',
                    color: isSelected ? '#FFFFFF' : '#334155',
                    border: isSelected ? '1px solid #0F172A' : '1px solid #E2E8F0',
                    cursor: 'pointer',
                    transition: 'all 0.15s ease'
                  }}
                >
                  {isSelected ? `✓ ${cityName}` : cityName}
                </button>
              );
            })}
          </div>
        </div>
        
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
          {/* Autocomplete Input */}
          <div className="form-group" style={{ position: 'relative' }} ref={dropdownRef}>
              <label className="form-label">
                Nama Kota / Kabupaten
                <span style={{ fontSize: '12px', fontWeight: 400, color: '#64748B', marginLeft: '6px' }}>
                  (Ketik untuk rekomendasi otomatis)
                </span>
              </label>
              <div style={{ position: 'relative' }}>
                <input 
                    type="text" 
                    className="form-control" 
                    value={searchQuery} 
                    onChange={(e) => {
                      setSearchQuery(e.target.value);
                      updateData({ locationName: e.target.value });
                      setIsOpen(true);
                    }}
                    onFocus={() => setIsOpen(true)}
                    placeholder="Ketik nama kota... (Contoh: Surabaya, Bandung, Malang)"
                    style={{ paddingRight: '36px' }}
                />
                <span style={{ position: 'absolute', right: '12px', top: '50%', transform: 'translateY(-50%)', pointerEvents: 'none', color: '#94A3B8' }}>
                  🔍
                </span>
              </div>

              {/* Autocomplete Dropdown */}
              {isOpen && filteredCities.length > 0 && (
                <div style={{
                  position: 'absolute',
                  top: '100%',
                  left: 0,
                  right: 0,
                  maxHeight: '260px',
                  overflowY: 'auto',
                  background: '#FFFFFF',
                  borderRadius: '10px',
                  border: '1px solid #CBD5E1',
                  boxShadow: '0 10px 25px -5px rgba(0,0,0,0.15), 0 8px 10px -6px rgba(0,0,0,0.1)',
                  zIndex: 50,
                  marginTop: '4px'
                }}>
                  <div style={{ padding: '8px 12px', background: '#F8FAFC', borderBottom: '1px solid #E2E8F0', fontSize: '11px', fontWeight: 600, color: '#64748B', textTransform: 'uppercase' }}>
                    Pilih Kota / Kabupaten ({filteredCities.length} Ditemukan)
                  </div>
                  {filteredCities.map((city, idx) => (
                    <div
                      key={idx}
                      onClick={() => selectCity(city)}
                      style={{
                        padding: '10px 14px',
                        cursor: 'pointer',
                        borderBottom: idx === filteredCities.length - 1 ? 'none' : '1px solid #F1F5F9',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        transition: 'background 0.15s ease'
                      }}
                      onMouseEnter={(e) => e.currentTarget.style.background = '#F1F5F9'}
                      onMouseLeave={(e) => e.currentTarget.style.background = '#FFFFFF'}
                    >
                      <div>
                        <div style={{ fontWeight: 600, fontSize: '13px', color: '#0F172A' }}>
                          {city.name}
                        </div>
                        <div style={{ fontSize: '11px', color: '#64748B', marginTop: '2px' }}>
                          {city.province} • Lat: {city.lat.toFixed(4)}, Lng: {city.lng.toFixed(4)}
                        </div>
                      </div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                        <span style={{ fontSize: '11px', background: '#E0F2FE', color: '#0369A1', padding: '2px 8px', borderRadius: '4px', fontWeight: 600 }}>
                          {city.timezone}
                        </span>
                        <span style={{ fontSize: '11px', background: '#FEF3C7', color: '#92400E', padding: '2px 8px', borderRadius: '4px', fontWeight: 600 }}>
                          ID: {city.kemenagCityId}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              )}
          </div>

          <div className="form-group">
              <label className="form-label">Zona Waktu Masjid</label>
              <select 
                  className="form-control"
                  value={data.timezone || 'WIB'}
                  onChange={(e) => updateData({ timezone: e.target.value as 'WIB' | 'WITA' | 'WIT' })}
                  style={{ cursor: 'pointer' }}
              >
                  <option value="WIB">WIB — Waktu Indonesia Barat (UTC+7)</option>
                  <option value="WITA">WITA — Waktu Indonesia Tengah (UTC+8)</option>
                  <option value="WIT">WIT — Waktu Indonesia Timur (UTC+9)</option>
              </select>
          </div>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
          <div className="form-group">
            <label className="form-label">ID Kota Kemenag (SIHAT)</label>
            <input 
              type="text" 
              className="form-control" 
              value={data.kemenagCityId || ''} 
              onChange={(e) => updateData({ kemenagCityId: e.target.value })}
              placeholder="Contoh: 1614 (Kab. Malang)"
            />
            <p style={{ fontSize: '12px', color: '#64748B', marginTop: '6px' }}>
              Jadwal prioritas dari Kemenag. Jika offline otomatis hitung astronomis.
            </p>
          </div>

          <div className="form-group">
            <label className="form-label">Koreksi Tanggal Hijriah (Hari)</label>
            <div style={{ maxWidth: '200px' }}>
              <NumberStepper 
                value={data.hijriOffset || 0}
                onChange={(val) => updateData({ hijriOffset: val })}
              />
            </div>
            <p style={{ fontSize: '12px', color: '#64748B', marginTop: '6px' }}>
              Sesuaikan jika ketetapan hilal berbeda (-2, -1, 0, +1, +2 hari).
            </p>
          </div>
        </div>
        
        <details style={{ marginTop: '16px', background: '#F8FAFC', padding: '16px', borderRadius: '12px', border: '1px solid #E2E8F0' }}>
            <summary style={{ cursor: 'pointer', fontWeight: 600, color: '#475569' }}>⚙️ Pengaturan Kordinat Lanjutan (Manual)</summary>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px', marginTop: '16px' }}>
                <div className="form-group" style={{ marginBottom: 0 }}>
                    <label className="form-label">Latitude</label>
                    <input 
                        type="number" 
                        step="0.0001" 
                        className="form-control" 
                        value={data.coords.lat} 
                        onChange={(e) => handleCoordsChange('lat', e.target.value)}
                    />
                </div>
                <div className="form-group" style={{ marginBottom: 0 }}>
                    <label className="form-label">Longitude</label>
                    <input 
                        type="number" 
                        step="0.0001" 
                        className="form-control" 
                        value={data.coords.lng} 
                        onChange={(e) => handleCoordsChange('lng', e.target.value)}
                    />
                </div>
            </div>
        </details>
      </div>

      <div className="card">
        <div className="card-title">Koreksi Waktu Sholat (Menit)</div>
        <p style={{ fontSize: '14px', color: '#64748B', marginBottom: '24px' }}>Jika jadwal di TV kurang akurat (+/-), sesuaikan di sini.</p>
        
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '24px' }}>
            {['imsak', 'fajr', 'sunrise', 'dhuhr', 'asr', 'maghrib', 'isha'].map(p => (
                <div className="form-group" style={{ marginBottom: 0 }} key={p}>
                    <label className="form-label" style={{ textTransform: 'capitalize' }}>{p}</label>
                    <NumberStepper 
                        value={data.offsets[p as keyof typeof data.offsets]}
                        onChange={(val) => handleOffsetChange(p, val)}
                    />
                </div>
            ))}
        </div>
      </div>
    </div>
  );
}
