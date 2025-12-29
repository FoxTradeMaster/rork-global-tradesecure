import * as XLSX from 'xlsx';
import * as DocumentPicker from 'expo-document-picker';
import * as FileSystem from 'expo-file-system';
import { Platform } from 'react-native';

export interface ParsedRow {
  [key: string]: string | number | boolean | null;
}

export interface ParseResult {
  success: boolean;
  data: ParsedRow[];
  headers: string[];
  error?: string;
  fileName?: string;
}

export async function pickAndParseFile(): Promise<ParseResult> {
  try {
    console.log('[FileParser] Starting document picker...');
    
    const result = await DocumentPicker.getDocumentAsync({
      type: [
        'text/csv',
        'text/comma-separated-values',
        'application/csv',
        'application/vnd.ms-excel',
        'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
        '*/*'
      ],
      copyToCacheDirectory: true,
    });

    console.log('[FileParser] Document picker result:', result);

    if (result.canceled || !result.assets || result.assets.length === 0) {
      console.log('[FileParser] User cancelled file selection');
      return { success: false, data: [], headers: [], error: 'File selection cancelled' };
    }

    const file = result.assets[0];
    const fileName = file.name;
    const fileUri = file.uri;
    
    console.log('[FileParser] Selected file:', fileName, 'URI:', fileUri);

    const isCSV = fileName.toLowerCase().endsWith('.csv');
    const isExcel = fileName.toLowerCase().endsWith('.xlsx') || fileName.toLowerCase().endsWith('.xls');

    if (!isCSV && !isExcel) {
      return { 
        success: false, 
        data: [], 
        headers: [], 
        error: 'Unsupported file type. Please use CSV or Excel (.xlsx, .xls) files.' 
      };
    }

    let fileContent: string;
    
    if (Platform.OS === 'web') {
      const response = await fetch(fileUri);
      if (isCSV) {
        fileContent = await response.text();
      } else {
        const arrayBuffer = await response.arrayBuffer();
        return parseExcelBuffer(arrayBuffer, fileName);
      }
    } else {
      if (isCSV) {
        fileContent = await FileSystem.readAsStringAsync(fileUri);
      } else {
        const base64 = await FileSystem.readAsStringAsync(fileUri, {
          encoding: 'base64',
        });
        return parseExcelBase64(base64, fileName);
      }
    }

    return parseCSV(fileContent, fileName);
  } catch (error) {
    console.error('[FileParser] Error picking/parsing file:', error);
    return { 
      success: false, 
      data: [], 
      headers: [], 
      error: `Error processing file: ${error instanceof Error ? error.message : 'Unknown error'}` 
    };
  }
}

function parseCSV(content: string, fileName: string): ParseResult {
  try {
    console.log('[FileParser] Parsing CSV content...');
    
    const lines = content.split(/\r?\n/).filter(line => line.trim());
    
    if (lines.length === 0) {
      return { success: false, data: [], headers: [], error: 'File is empty' };
    }

    const headers = parseCSVLine(lines[0]);
    console.log('[FileParser] CSV Headers:', headers);
    
    const data: ParsedRow[] = [];
    
    for (let i = 1; i < lines.length; i++) {
      const values = parseCSVLine(lines[i]);
      if (values.length === 0 || values.every(v => !v.trim())) continue;
      
      const row: ParsedRow = {};
      headers.forEach((header, index) => {
        const value = values[index] || '';
        row[header] = parseValue(value);
      });
      data.push(row);
    }

    console.log('[FileParser] Parsed', data.length, 'rows from CSV');
    
    return { success: true, data, headers, fileName };
  } catch (error) {
    console.error('[FileParser] CSV parsing error:', error);
    return { 
      success: false, 
      data: [], 
      headers: [], 
      error: `CSV parsing error: ${error instanceof Error ? error.message : 'Unknown error'}` 
    };
  }
}

function parseCSVLine(line: string): string[] {
  const result: string[] = [];
  let current = '';
  let inQuotes = false;
  
  for (let i = 0; i < line.length; i++) {
    const char = line[i];
    
    if (char === '"') {
      if (inQuotes && line[i + 1] === '"') {
        current += '"';
        i++;
      } else {
        inQuotes = !inQuotes;
      }
    } else if (char === ',' && !inQuotes) {
      result.push(current.trim());
      current = '';
    } else {
      current += char;
    }
  }
  
  result.push(current.trim());
  return result;
}

function parseExcelBuffer(buffer: ArrayBuffer, fileName: string): ParseResult {
  try {
    console.log('[FileParser] Parsing Excel from ArrayBuffer...');
    
    const workbook = XLSX.read(buffer, { type: 'array' });
    return extractWorkbookData(workbook, fileName);
  } catch (error) {
    console.error('[FileParser] Excel parsing error:', error);
    return { 
      success: false, 
      data: [], 
      headers: [], 
      error: `Excel parsing error: ${error instanceof Error ? error.message : 'Unknown error'}` 
    };
  }
}

function parseExcelBase64(base64: string, fileName: string): ParseResult {
  try {
    console.log('[FileParser] Parsing Excel from Base64...');
    
    const workbook = XLSX.read(base64, { type: 'base64' });
    return extractWorkbookData(workbook, fileName);
  } catch (error) {
    console.error('[FileParser] Excel parsing error:', error);
    return { 
      success: false, 
      data: [], 
      headers: [], 
      error: `Excel parsing error: ${error instanceof Error ? error.message : 'Unknown error'}` 
    };
  }
}

function extractWorkbookData(workbook: XLSX.WorkBook, fileName: string): ParseResult {
  const sheetName = workbook.SheetNames[0];
  const sheet = workbook.Sheets[sheetName];
  
  const jsonData = XLSX.utils.sheet_to_json(sheet, { 
    header: 1,
    defval: ''
  }) as unknown as (string | number)[][];
  
  if (jsonData.length === 0) {
    return { success: false, data: [], headers: [], error: 'Excel file is empty' };
  }

  const headers = (jsonData[0] as (string | number)[]).map(h => String(h).trim());
  console.log('[FileParser] Excel Headers:', headers);
  
  const data: ParsedRow[] = [];
  
  for (let i = 1; i < jsonData.length; i++) {
    const values = jsonData[i] as (string | number)[];
    if (!values || values.every(v => v === '' || v === null || v === undefined)) continue;
    
    const row: ParsedRow = {};
    headers.forEach((header, index) => {
      const value = values[index];
      row[header] = value !== undefined && value !== null ? parseValue(String(value)) : null;
    });
    data.push(row);
  }

  console.log('[FileParser] Parsed', data.length, 'rows from Excel');
  
  return { success: true, data, headers, fileName };
}

function parseValue(value: string): string | number | boolean | null {
  const trimmed = value.trim();
  
  if (trimmed === '') return null;
  
  if (trimmed.toLowerCase() === 'true') return true;
  if (trimmed.toLowerCase() === 'false') return false;
  
  const num = Number(trimmed);
  if (!isNaN(num) && trimmed !== '') return num;
  
  return trimmed;
}

export function normalizeHeader(header: string): string {
  return header
    .toLowerCase()
    .replace(/[^a-z0-9]/g, '_')
    .replace(/_+/g, '_')
    .replace(/^_|_$/g, '');
}

export function findMatchingHeader(headers: string[], possibleNames: string[]): string | null {
  for (const name of possibleNames) {
    const normalized = normalizeHeader(name);
    const found = headers.find(h => normalizeHeader(h) === normalized);
    if (found) return found;
  }
  return null;
}
