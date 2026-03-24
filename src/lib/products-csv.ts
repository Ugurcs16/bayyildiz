import fs from "node:fs";
import path from "node:path";

export type CsvRow = Record<string, string>;

let cachedRows: CsvRow[] | null = null;

function parseCsvLine(line: string): string[] {
  const cells: string[] = [];
  let current = "";
  let inQuotes = false;

  for (let i = 0; i < line.length; i += 1) {
    const ch = line[i];
    if (ch === '"') {
      const next = line[i + 1];
      if (inQuotes && next === '"') {
        current += '"';
        i += 1;
      } else {
        inQuotes = !inQuotes;
      }
      continue;
    }

    if (ch === "," && !inQuotes) {
      cells.push(current.trim());
      current = "";
      continue;
    }

    current += ch;
  }

  cells.push(current.trim());
  return cells;
}

export function loadProductsCsvRows(): CsvRow[] {
  if (cachedRows) return cachedRows;

  const csvPath = path.join(process.cwd(), "data/products.csv");
  if (!fs.existsSync(csvPath)) {
    cachedRows = [];
    return cachedRows;
  }

  const content = fs.readFileSync(csvPath, "utf8");
  const lines = content.split(/\r?\n/).filter((line) => line.trim().length > 0);
  if (lines.length < 2) {
    cachedRows = [];
    return cachedRows;
  }

  const headers = parseCsvLine(lines[0] ?? "");
  const rows: CsvRow[] = [];

  for (let i = 1; i < lines.length; i += 1) {
    const cells = parseCsvLine(lines[i] ?? "");
    if (cells.every((cell) => cell === "")) continue;

    const row: CsvRow = {};
    headers.forEach((header, idx) => {
      row[header] = cells[idx] ?? "";
    });
    rows.push(row);
  }

  cachedRows = rows;
  return rows;
}
