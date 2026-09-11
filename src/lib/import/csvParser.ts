// src/lib/import/csvParser.ts
/**
 * RFC 4180 compliant CSV parser with support for quoted strings,
 * commas inside values, and line breaks within quotes.
 */

export interface ParsedCsvRow {
  lineNumber: number;
  data: Record<string, string>;
}

export function parseCsv(csvText: string): { headers: string[]; rows: ParsedCsvRow[] } {
  const lines: string[][] = [];
  let currentField = '';
  let currentRow: string[] = [];
  let inQuotes = false;

  const text = csvText.replace(/\r\n/g, '\n').replace(/\r/g, '\n');

  for (let i = 0; i < text.length; i++) {
    const char = text[i];
    const nextChar = text[i + 1];

    if (char === '"') {
      if (inQuotes && nextChar === '"') {
        currentField += '"';
        i++; // skip escaped quote
      } else {
        inQuotes = !inQuotes;
      }
    } else if (char === ',' && !inQuotes) {
      currentRow.push(currentField.trim());
      currentField = '';
    } else if (char === '\n' && !inQuotes) {
      currentRow.push(currentField.trim());
      currentField = '';
      if (currentRow.some((field) => field.length > 0)) {
        lines.push(currentRow);
      }
      currentRow = [];
    } else {
      currentField += char;
    }
  }

  // Final field & row if not empty
  if (currentField.length > 0 || currentRow.length > 0) {
    currentRow.push(currentField.trim());
    if (currentRow.some((field) => field.length > 0)) {
      lines.push(currentRow);
    }
  }

  if (lines.length === 0) {
    return { headers: [], rows: [] };
  }

  const rawHeaders = lines[0].map((h) => h.trim());
  const rows: ParsedCsvRow[] = [];

  for (let idx = 1; idx < lines.length; idx++) {
    const line = lines[idx];
    const rowData: Record<string, string> = {};
    for (let c = 0; c < rawHeaders.length; c++) {
      const headerKey = rawHeaders[c];
      if (headerKey) {
        rowData[headerKey] = line[c] || '';
      }
    }
    rows.push({
      lineNumber: idx + 1,
      data: rowData,
    });
  }

  return { headers: rawHeaders, rows };
}

/**
 * Intelligent Header Normalizer Dictionary
 * Maps common real-world Indian client spreadsheet headers to VDR product schema fields.
 */
export const SYNONYM_MAP: Record<string, string[]> = {
  name: ['name', 'product', 'product_name', 'productname', 'item_name', 'item', 'title', 'model_name'],
  brand: ['brand', 'make', 'manufacturer', 'company', 'brand_name'],
  category: ['category', 'type', 'cat', 'product_type', 'appliance_type', 'equipment_type'],
  model: ['model', 'model_number', 'model_no', 'modelno', 'series', 'model_series'],
  sku: ['sku', 'product_code', 'item_code', 'part_number', 'item_sku', 'code'],
  tonnageOrCapacity: ['tonnage', 'capacity', 'cap', 'ton', 'size', 'tonnage_or_capacity', 'capacity_ton'],
  starRating: ['star', 'star_rating', 'rating', 'bee_star', 'bee_rating', 'stars'],
  coolingType: ['cooling_type', 'cooling', 'system_type', 'technology'],
  refrigerant: ['refrigerant', 'gas', 'refrigerant_type', 'gas_type'],
  iseer: ['iseer', 'iseer_rating', 'energy_efficiency', 'cop'],
  powerConsumption: ['power', 'power_consumption', 'powerconsumption', 'units', 'electricity', 'wattage'],
  coilMaterial: ['coil', 'coil_material', 'condenser', 'condenser_coil', 'copper'],
  shortSummary: ['short_summary', 'summary', 'subtitle', 'one_liner', 'brief'],
  description: ['description', 'details', 'product_description', 'overview', 'about'],
  suitableFor: ['suitable_for', 'room_size', 'coverage', 'ideal_for', 'application'],
  features: ['features', 'highlights', 'key_features', 'feature_list'],
  specs: ['specs', 'specifications', 'tech_specs', 'technical_specifications'],
  images: ['images', 'image_urls', 'photos', 'image_url', 'photo_urls'],
  warranty: ['warranty', 'warranty_terms', 'guarantee'],
  availability: ['availability', 'stock', 'stock_status', 'showroom_availability', 'status_stock'],
  isDemo: ['is_demo', 'demo', 'sample'],
};

export function normalizeRowHeaders(rawRow: Record<string, string>): Record<string, string> {
  const normalized: Record<string, string> = {};

  const cleanHeader = (h: string) =>
    h
      .toLowerCase()
      .replace(/[^a-z0-9]/g, '_')
      .replace(/^_+|_+$/g, '');

  for (const [rawKey, val] of Object.entries(rawRow)) {
    const cleanedKey = cleanHeader(rawKey);
    let matchedSchemaKey = cleanedKey;

    for (const [schemaField, synonyms] of Object.entries(SYNONYM_MAP)) {
      if (schemaField === cleanedKey || synonyms.includes(cleanedKey)) {
        matchedSchemaKey = schemaField;
        break;
      }
    }

    normalized[matchedSchemaKey] = val;
  }

  return normalized;
}
