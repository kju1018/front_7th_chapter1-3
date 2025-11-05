import fs from 'fs';
import path from 'path';

export default async function globalSetup() {
  const rootDir = process.cwd(); // ✅ 항상 프로젝트 루트 기준
  const dbDir = path.join(rootDir, 'src', '__mocks__', 'response');

  const dbPath = path.join(dbDir, 'e2e.json');
  const seedPath = path.join(dbDir, 'e2e-template.json');

  fs.copyFileSync(seedPath, dbPath);
  console.log('✅ e2e.json 초기화 완료');
}
