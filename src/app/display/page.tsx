import './display.css';
import DisplayEngine from './components/DisplayEngine';

export const metadata = {
  title: 'Display Adzan Masjid',
  description: 'Digital Signage TV Masjid',
};

export default function DisplayPage() {
  return (
    <DisplayEngine />
  );
}
