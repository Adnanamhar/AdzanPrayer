export interface CityLocation {
  name: string;
  province: string;
  lat: number;
  lng: number;
  timezone: 'WIB' | 'WITA' | 'WIT';
  kemenagCityId: string;
}

export const INDONESIAN_CITIES: CityLocation[] = [
  // DKI JAKARTA
  { name: 'Kota Jakarta Pusat', province: 'DKI Jakarta', lat: -6.1805, lng: 106.8284, timezone: 'WIB', kemenagCityId: '1301' },
  { name: 'Kota Jakarta Selatan', province: 'DKI Jakarta', lat: -6.2615, lng: 106.8106, timezone: 'WIB', kemenagCityId: '1302' },
  { name: 'Kota Jakarta Timur', province: 'DKI Jakarta', lat: -6.2250, lng: 106.9004, timezone: 'WIB', kemenagCityId: '1303' },
  { name: 'Kota Jakarta Barat', province: 'DKI Jakarta', lat: -6.1683, lng: 106.7589, timezone: 'WIB', kemenagCityId: '1304' },
  { name: 'Kota Jakarta Utara', province: 'DKI Jakarta', lat: -6.1384, lng: 106.8640, timezone: 'WIB', kemenagCityId: '1305' },

  // JAWA BARAT
  { name: 'Kota Bandung', province: 'Jawa Barat', lat: -6.9175, lng: 107.6191, timezone: 'WIB', kemenagCityId: '1201' },
  { name: 'Kab. Bandung', province: 'Jawa Barat', lat: -7.0253, lng: 107.5198, timezone: 'WIB', kemenagCityId: '1202' },
  { name: 'Kab. Bandung Barat', province: 'Jawa Barat', lat: -6.8439, lng: 107.5028, timezone: 'WIB', kemenagCityId: '1203' },
  { name: 'Kota Bekasi', province: 'Jawa Barat', lat: -6.2383, lng: 106.9756, timezone: 'WIB', kemenagCityId: '1221' },
  { name: 'Kab. Bekasi', province: 'Jawa Barat', lat: -6.2407, lng: 107.1473, timezone: 'WIB', kemenagCityId: '1205' },
  { name: 'Kota Bogor', province: 'Jawa Barat', lat: -6.5971, lng: 106.8060, timezone: 'WIB', kemenagCityId: '1222' },
  { name: 'Kab. Bogor', province: 'Jawa Barat', lat: -6.5518, lng: 106.6291, timezone: 'WIB', kemenagCityId: '1206' },
  { name: 'Kota Depok', province: 'Jawa Barat', lat: -6.4025, lng: 106.7942, timezone: 'WIB', kemenagCityId: '1223' },
  { name: 'Kota Cimahi', province: 'Jawa Barat', lat: -6.8723, lng: 107.5420, timezone: 'WIB', kemenagCityId: '1224' },
  { name: 'Kota Cirebon', province: 'Jawa Barat', lat: -6.7320, lng: 108.5523, timezone: 'WIB', kemenagCityId: '1225' },
  { name: 'Kota Sukabumi', province: 'Jawa Barat', lat: -6.9277, lng: 106.9299, timezone: 'WIB', kemenagCityId: '1226' },
  { name: 'Kota Tasikmalaya', province: 'Jawa Barat', lat: -7.3274, lng: 108.2207, timezone: 'WIB', kemenagCityId: '1227' },
  { name: 'Kota Banjar', province: 'Jawa Barat', lat: -7.3699, lng: 108.5337, timezone: 'WIB', kemenagCityId: '1228' },
  { name: 'Kab. Karawang', province: 'Jawa Barat', lat: -6.3042, lng: 107.3069, timezone: 'WIB', kemenagCityId: '1215' },
  { name: 'Kab. Garut', province: 'Jawa Barat', lat: -7.2279, lng: 107.9087, timezone: 'WIB', kemenagCityId: '1211' },

  // BANTEN
  { name: 'Kota Serang', province: 'Banten', lat: -6.1104, lng: 106.1640, timezone: 'WIB', kemenagCityId: '1101' },
  { name: 'Kota Tangerang', province: 'Banten', lat: -6.1783, lng: 106.6319, timezone: 'WIB', kemenagCityId: '1102' },
  { name: 'Kota Tangerang Selatan', province: 'Banten', lat: -6.2885, lng: 106.7179, timezone: 'WIB', kemenagCityId: '1103' },
  { name: 'Kota Cilegon', province: 'Banten', lat: -6.0170, lng: 106.0538, timezone: 'WIB', kemenagCityId: '1104' },
  { name: 'Kab. Lebak', province: 'Banten', lat: -6.6432, lng: 106.2199, timezone: 'WIB', kemenagCityId: '1105' },

  // JAWA TENGAH & DIY
  { name: 'Kota Semarang', province: 'Jawa Tengah', lat: -6.9667, lng: 110.4167, timezone: 'WIB', kemenagCityId: '1401' },
  { name: 'Kota Surakarta (Solo)', province: 'Jawa Tengah', lat: -7.5755, lng: 110.8243, timezone: 'WIB', kemenagCityId: '1402' },
  { name: 'Kota Magelang', province: 'Jawa Tengah', lat: -7.4706, lng: 110.2178, timezone: 'WIB', kemenagCityId: '1403' },
  { name: 'Kota Pekalongan', province: 'Jawa Tengah', lat: -6.8886, lng: 109.6753, timezone: 'WIB', kemenagCityId: '1404' },
  { name: 'Kota Salatiga', province: 'Jawa Tengah', lat: -7.3305, lng: 110.5084, timezone: 'WIB', kemenagCityId: '1405' },
  { name: 'Kota Tegal', province: 'Jawa Tengah', lat: -6.8694, lng: 109.1402, timezone: 'WIB', kemenagCityId: '1406' },
  { name: 'Kab. Banyumas (Purwokerto)', province: 'Jawa Tengah', lat: -7.4313, lng: 109.2478, timezone: 'WIB', kemenagCityId: '1408' },
  { name: 'Kab. Kudus', province: 'Jawa Tengah', lat: -6.8048, lng: 110.8405, timezone: 'WIB', kemenagCityId: '1420' },
  { name: 'Kota Yogyakarta', province: 'DI Yogyakarta', lat: -7.7956, lng: 110.3695, timezone: 'WIB', kemenagCityId: '1501' },
  { name: 'Kab. Sleman', province: 'DI Yogyakarta', lat: -7.7156, lng: 110.3556, timezone: 'WIB', kemenagCityId: '1502' },
  { name: 'Kab. Bantul', province: 'DI Yogyakarta', lat: -7.8897, lng: 110.3289, timezone: 'WIB', kemenagCityId: '1503' },

  // JAWA TIMUR
  { name: 'Kota Surabaya', province: 'Jawa Timur', lat: -7.2575, lng: 112.7521, timezone: 'WIB', kemenagCityId: '1601' },
  { name: 'Kota Malang', province: 'Jawa Timur', lat: -7.9797, lng: 112.6304, timezone: 'WIB', kemenagCityId: '1634' },
  { name: 'Kab. Malang', province: 'Jawa Timur', lat: -8.1667, lng: 112.6667, timezone: 'WIB', kemenagCityId: '1614' },
  { name: 'Kota Batu', province: 'Jawa Timur', lat: -7.8712, lng: 112.5270, timezone: 'WIB', kemenagCityId: '1638' },
  { name: 'Kab. Sidoarjo', province: 'Jawa Timur', lat: -7.4478, lng: 112.7183, timezone: 'WIB', kemenagCityId: '1602' },
  { name: 'Kab. Gresik', province: 'Jawa Timur', lat: -7.1566, lng: 112.6555, timezone: 'WIB', kemenagCityId: '1603' },
  { name: 'Kota Kediri', province: 'Jawa Timur', lat: -7.8480, lng: 112.0178, timezone: 'WIB', kemenagCityId: '1606' },
  { name: 'Kota Madiun', province: 'Jawa Timur', lat: -7.6298, lng: 111.5239, timezone: 'WIB', kemenagCityId: '1608' },
  { name: 'Kota Blitar', province: 'Jawa Timur', lat: -8.0983, lng: 112.1681, timezone: 'WIB', kemenagCityId: '1605' },
  { name: 'Kota Pasuruan', province: 'Jawa Timur', lat: -7.6453, lng: 112.9075, timezone: 'WIB', kemenagCityId: '1609' },
  { name: 'Kota Probolinggo', province: 'Jawa Timur', lat: -7.7543, lng: 113.2159, timezone: 'WIB', kemenagCityId: '1610' },
  { name: 'Kab. Jember', province: 'Jawa Timur', lat: -8.1724, lng: 113.7007, timezone: 'WIB', kemenagCityId: '1622' },
  { name: 'Kab. Banyuwangi', province: 'Jawa Timur', lat: -8.2192, lng: 114.3692, timezone: 'WIB', kemenagCityId: '1624' },
  { name: 'Kab. Bojonegoro', province: 'Jawa Timur', lat: -7.1502, lng: 111.8818, timezone: 'WIB', kemenagCityId: '1618' },
  { name: 'Kab. Lamongan', province: 'Jawa Timur', lat: -7.1197, lng: 112.4145, timezone: 'WIB', kemenagCityId: '1628' },
  { name: 'Kab. Tuban', province: 'Jawa Timur', lat: -6.8976, lng: 112.0649, timezone: 'WIB', kemenagCityId: '1627' },

  // SUMATERA
  { name: 'Kota Medan', province: 'Sumatera Utara', lat: 3.5952, lng: 98.6722, timezone: 'WIB', kemenagCityId: '0201' },
  { name: 'Kota Banda Aceh', province: 'Aceh', lat: 5.5483, lng: 95.3238, timezone: 'WIB', kemenagCityId: '0101' },
  { name: 'Kota Padang', province: 'Sumatera Barat', lat: -0.9471, lng: 100.4172, timezone: 'WIB', kemenagCityId: '0301' },
  { name: 'Kota Pekanbaru', province: 'Riau', lat: 0.5071, lng: 101.4478, timezone: 'WIB', kemenagCityId: '0401' },
  { name: 'Kota Batam', province: 'Kepulauan Riau', lat: 1.1301, lng: 104.0529, timezone: 'WIB', kemenagCityId: '3101' },
  { name: 'Kota Tanjungpinang', province: 'Kepulauan Riau', lat: 0.9167, lng: 104.4500, timezone: 'WIB', kemenagCityId: '3102' },
  { name: 'Kota Palembang', province: 'Sumatera Selatan', lat: -2.9909, lng: 104.7566, timezone: 'WIB', kemenagCityId: '0601' },
  { name: 'Kota Jambi', province: 'Jambi', lat: -1.6101, lng: 103.6131, timezone: 'WIB', kemenagCityId: '0501' },
  { name: 'Kota Bengkulu', province: 'Bengkulu', lat: -3.8004, lng: 102.2655, timezone: 'WIB', kemenagCityId: '0701' },
  { name: 'Kota Bandar Lampung', province: 'Lampung', lat: -5.4500, lng: 105.2667, timezone: 'WIB', kemenagCityId: '0801' },
  { name: 'Kota Pangkalpinang', province: 'Bangka Belitung', lat: -2.1333, lng: 106.1167, timezone: 'WIB', kemenagCityId: '2901' },

  // BALI & NUSA TENGGARA
  { name: 'Kota Denpasar', province: 'Bali', lat: -8.6705, lng: 115.2126, timezone: 'WITA', kemenagCityId: '1701' },
  { name: 'Kota Mataram', province: 'Nusa Tenggara Barat', lat: -8.5833, lng: 116.1167, timezone: 'WITA', kemenagCityId: '1801' },
  { name: 'Kota Bima', province: 'Nusa Tenggara Barat', lat: -8.4608, lng: 118.7268, timezone: 'WITA', kemenagCityId: '1802' },
  { name: 'Kota Kupang', province: 'Nusa Tenggara Timur', lat: -10.1772, lng: 123.6070, timezone: 'WITA', kemenagCityId: '1901' },

  // KALIMANTAN
  { name: 'Kota Pontianak', province: 'Kalimantan Barat', lat: -0.0263, lng: 109.3425, timezone: 'WIB', kemenagCityId: '2001' },
  { name: 'Kota Palangka Raya', province: 'Kalimantan Tengah', lat: -2.2084, lng: 113.9167, timezone: 'WIB', kemenagCityId: '2101' },
  { name: 'Kota Banjarmasin', province: 'Kalimantan Selatan', lat: -3.3167, lng: 114.5901, timezone: 'WITA', kemenagCityId: '2201' },
  { name: 'Kota Banjarbaru', province: 'Kalimantan Selatan', lat: -3.4402, lng: 114.8306, timezone: 'WITA', kemenagCityId: '2202' },
  { name: 'Kota Samarinda', province: 'Kalimantan Timur', lat: -0.5022, lng: 117.1536, timezone: 'WITA', kemenagCityId: '2301' },
  { name: 'Kota Balikpapan', province: 'Kalimantan Timur', lat: -1.2379, lng: 116.8529, timezone: 'WITA', kemenagCityId: '2302' },
  { name: 'Kota Bontang', province: 'Kalimantan Timur', lat: 0.1333, lng: 117.5000, timezone: 'WITA', kemenagCityId: '2303' },
  { name: 'Kota Tarakan', province: 'Kalimantan Utara', lat: 3.3000, lng: 117.6333, timezone: 'WITA', kemenagCityId: '3401' },

  // SULAWESI
  { name: 'Kota Makassar', province: 'Sulawesi Selatan', lat: -5.1477, lng: 119.4327, timezone: 'WITA', kemenagCityId: '2601' },
  { name: 'Kota Manado', province: 'Sulawesi Utara', lat: 1.4748, lng: 124.8428, timezone: 'WITA', kemenagCityId: '2401' },
  { name: 'Kota Palu', province: 'Sulawesi Tengah', lat: -0.9003, lng: 119.8779, timezone: 'WITA', kemenagCityId: '2501' },
  { name: 'Kota Kendari', province: 'Sulawesi Tenggara', lat: -3.9972, lng: 122.5127, timezone: 'WITA', kemenagCityId: '2701' },
  { name: 'Kota Gorontalo', province: 'Gorontalo', lat: 0.5435, lng: 123.0568, timezone: 'WITA', kemenagCityId: '3001' },
  { name: 'Kota Mamuju', province: 'Sulawesi Barat', lat: -2.6748, lng: 118.8888, timezone: 'WITA', kemenagCityId: '3301' },

  // MALUKU & PAPUA
  { name: 'Kota Ambon', province: 'Maluku', lat: -3.6554, lng: 128.1908, timezone: 'WIT', kemenagCityId: '2801' },
  { name: 'Kota Ternate', province: 'Maluku Utara', lat: 0.7903, lng: 127.3828, timezone: 'WIT', kemenagCityId: '3201' },
  { name: 'Kota Jayapura', province: 'Papua', lat: -2.5916, lng: 140.6690, timezone: 'WIT', kemenagCityId: '3501' },
  { name: 'Kota Sorong', province: 'Papua Barat Daya', lat: -0.8762, lng: 131.2558, timezone: 'WIT', kemenagCityId: '3601' }
];
