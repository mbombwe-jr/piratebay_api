import { Injectable, Logger } from '@nestjs/common';
import axios from 'axios';
import * as cheerio from 'cheerio';

export interface Torrent {
  title: string;
  magnet: string;
  time: Date;
  size: number;
  size_str: string;
  uploader: string;
  seeds: number;
  leeches: number;
  category: string;
  subcat: string;
  id: string;
}

@Injectable()
export class TorrentService {
  private readonly logger = new Logger(TorrentService.name);
  private readonly baseUrl = process.env.BASE_URL || 'https://thepiratebay.bond/';

  async parsePage(url: string, sort?: string): Promise<Torrent[]> {
    try {
      this.logger.log(`Fetching page: ${url}`);
      const response = await axios.get(url, {
        headers: {
          'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36',
        },
      });

      const $ = cheerio.load(response.data);
      const searchResultTable = $('#searchResult');
      if (searchResultTable.length === 0) {
        return [];
      }

      const torrents: Torrent[] = [];

      searchResultTable.find('tr').each((i, row) => {
        if (i === 0) return; // Skip header row
        const tds = $(row).find('td');
        if (tds.length < 7) return;

        // Column 0: Category
        const categoryText = tds.eq(0).text().trim();
        const catParts = categoryText.split('>').map((s) => s.trim());
        const category = catParts[0] || '';
        const subcat = catParts.slice(1).join(' ') || '';

        // Column 1: Title and Link
        const titleLink = tds.eq(1).find('a');
        const title = titleLink.text().trim();
        const id = titleLink.attr('href') || '';

        // Column 2: Date
        const timeStr = tds.eq(2).text().trim().replace(/\u00a0/g, ' ');

        // Column 3: Magnet
        const magnet = tds.eq(3).find('a[href^="magnet:"]').attr('href') || '';

        // Column 4: Size
        const sizeStr = tds.eq(4).text().trim().replace(/\u00a0/g, ' ');

        // Column 5: Seeds
        const seeds = parseInt(tds.eq(5).text().trim(), 10) || 0;

        // Column 6: Leeches
        const leeches = parseInt(tds.eq(6).text().trim(), 10) || 0;

        // Column 7: Uploader
        const uploader = tds.eq(7).text().trim() || '';

        if (title) {
          torrents.push({
            title,
            magnet,
            time: this.convertToDate(timeStr),
            size: this.convertToBytes(sizeStr),
            size_str: sizeStr,
            uploader,
            seeds,
            leeches,
            category,
            subcat,
            id,
          });
        }
      });

      if (sort) {
        const [field, direction] = sort.split('_');
        if (field) {
          const isDesc = direction?.toUpperCase() === 'DESC';
          torrents.sort((a, b) => {
            let valA = a[field as keyof Torrent];
            let valB = b[field as keyof Torrent];

            if (valA instanceof Date && valB instanceof Date) {
              return isDesc ? valB.getTime() - valA.getTime() : valA.getTime() - valB.getTime();
            }

            if (typeof valA === 'string' && typeof valB === 'string') {
              return isDesc ? valB.localeCompare(valA) : valA.localeCompare(valB);
            }

            if (typeof valA === 'number' && typeof valB === 'number') {
              return isDesc ? valB - valA : valA - valB;
            }

            return 0;
          });
        }
      }

      return torrents;
    } catch (error) {
      this.logger.error(`Error parsing page: ${error.message}`);
      return [];
    }
  }

  convertToBytes(sizeStr: string): number {
    const cleanStr = sizeStr.trim().replace(/\u00a0/g, ' ');
    const parts = cleanStr.split(/\s+/);
    if (parts.length < 2) return 0;
    const magnitude = parseFloat(parts[0]);
    const unit = parts[1].replace(/i/g, ''); // Normalize GiB -> GB, MiB -> MB, etc.
    const multipliers = ['B', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB'];
    const exp = multipliers.indexOf(unit);
    const multiplier = exp > 0 ? Math.pow(1024, exp) : 1;
    return magnitude * multiplier;
  }

  convertToDate(dateStr: string): Date {
    const str = dateStr.trim().replace(/\u00a0/g, ' ');

    // 1. "X min(s) ago"
    if (/^[0-9]+\s+min(s)?\s+ago$/i.test(str)) {
      const minutes = parseInt(str.split(/\s+/)[0], 10);
      const date = new Date();
      date.setMinutes(date.getMinutes() - minutes);
      date.setSeconds(0, 0);
      return date;
    }

    // 2. "MM-DD HH:mm" (e.g., "04-25 16:35" or "07-06 15:37")
    if (/^[0-9]+-[0-9]+\s+[0-9]+:[0-9]+$/.test(str)) {
      const currentYear = new Date().getFullYear();
      const [datePart, timePart] = str.split(/\s+/);
      const [month, day] = datePart.split('-').map(Number);
      const [hour, minute] = timePart.split(':').map(Number);
      return new Date(currentYear, month - 1, day, hour, minute, 0, 0);
    }

    // 3. "Today HH:mm"
    if (/^Today\s+[0-9]+:[0-9]+$/i.test(str)) {
      const timePart = str.replace(/Today\s+/i, '');
      const [hour, minute] = timePart.split(':').map(Number);
      const date = new Date();
      date.setHours(hour, minute, 0, 0);
      return date;
    }

    // 4. "Y-day HH:mm"
    if (/^Y-day\s+[0-9]+:[0-9]+$/i.test(str)) {
      const timePart = str.replace(/Y-day\s+/i, '');
      const [hour, minute] = timePart.split(':').map(Number);
      const date = new Date();
      date.setDate(date.getDate() - 1);
      date.setHours(hour, minute, 0, 0);
      return date;
    }

    // 5. "MM-DD YYYY" (e.g. "01-01 2016")
    const parts = str.split(/\s+/);
    if (parts.length === 2 && parts[0].includes('-')) {
      const [month, day] = parts[0].split('-').map(Number);
      const year = parseInt(parts[1], 10);
      if (!isNaN(month) && !isNaN(day) && !isNaN(year)) {
        return new Date(year, month - 1, day, 0, 0, 0, 0);
      }
    }

    const parsed = Date.parse(str);
    return isNaN(parsed) ? new Date() : new Date(parsed);
  }

  getBaseUrl(): string {
    return this.baseUrl;
  }
}
