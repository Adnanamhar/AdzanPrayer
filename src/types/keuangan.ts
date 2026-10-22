export interface KeuanganEntry {
  desc: string;
  amount: number;
}

export interface KeuanganData {
  periode: string;
  pemasukan: KeuanganEntry[];
  pengeluaran: KeuanganEntry[];
}
