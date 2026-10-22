import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

const dataFilePath = path.join(process.cwd(), 'mosqueData.json');

export async function GET() {
  try {
    if (fs.existsSync(dataFilePath)) {
      const data = fs.readFileSync(dataFilePath, 'utf8');
      return NextResponse.json(JSON.parse(data));
    }
  } catch (e) {
    console.error('Error reading local data:', e);
  }
  return NextResponse.json({ error: 'Not found' }, { status: 404 });
}

export async function POST(req: Request) {
  try {
    const newData = await req.json();
    
    // Merge with existing data if exists
    let existingData = {};
    if (fs.existsSync(dataFilePath)) {
        try {
            existingData = JSON.parse(fs.readFileSync(dataFilePath, 'utf8'));
        } catch (e) {}
    }

    const finalData = { ...existingData, ...newData };
    fs.writeFileSync(dataFilePath, JSON.stringify(finalData, null, 2), 'utf8');
    
    return NextResponse.json({ success: true, data: finalData });
  } catch (e) {
    console.error('Error writing local data:', e);
    return NextResponse.json({ error: 'Failed to save' }, { status: 500 });
  }
}
