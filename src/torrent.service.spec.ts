import { Test, TestingModule } from '@nestjs/testing';
import { TorrentService } from './torrent.service';

describe('TorrentService', () => {
  let service: TorrentService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [TorrentService],
    }).compile();

    service = module.get<TorrentService>(TorrentService);
  });

  describe('convertToBytes', () => {
    it('should convert sizes properly', () => {
      expect(service.convertToBytes('5 B')).toBe(5);
      expect(service.convertToBytes('50 KiB')).toBe(50 * 1024);
      expect(service.convertToBytes('100 MiB')).toBe(100 * 1024 * 1024);
      expect(service.convertToBytes('1.0 GiB')).toBe(1 * 1024 * 1024 * 1024);
      expect(service.convertToBytes('45 TiB')).toBe(45 * Math.pow(1024, 4));
      expect(service.convertToBytes('50 PiB')).toBe(50 * Math.pow(1024, 5));
      expect(service.convertToBytes('4.3 EiB')).toBe(4.3 * Math.pow(1024, 6));
    });
  });

  describe('convertToDate', () => {
    it('should convert relative minutes ago', () => {
      const now = new Date();
      now.setSeconds(0, 0);
      const tenMinsAgo = service.convertToDate('10 mins ago');
      const diffMs = now.getTime() - tenMinsAgo.getTime();
      const diffMins = Math.round(diffMs / 60000);
      expect(diffMins).toBe(10);
    });

    it('should convert Today HH:mm', () => {
      const parsed = service.convertToDate('Today 15:30');
      expect(parsed.getHours()).toBe(15);
      expect(parsed.getMinutes()).toBe(30);
    });

    it('should convert Y-day HH:mm', () => {
      const parsed = service.convertToDate('Y-day 08:15');
      const yesterday = new Date();
      yesterday.setDate(yesterday.getDate() - 1);
      expect(parsed.getDate()).toBe(yesterday.getDate());
      expect(parsed.getHours()).toBe(8);
      expect(parsed.getMinutes()).toBe(15);
    });

    it('should convert MM-DD HH:mm', () => {
      const parsed = service.convertToDate('07-06 12:00');
      expect(parsed.getMonth()).toBe(6); // July is 6 in JS Date (0-indexed)
      expect(parsed.getDate()).toBe(6);
      expect(parsed.getHours()).toBe(12);
    });

    it('should convert MM-DD YYYY', () => {
      const parsed = service.convertToDate('01-01 2016');
      expect(parsed.getFullYear()).toBe(2016);
      expect(parsed.getMonth()).toBe(0); // January
      expect(parsed.getDate()).toBe(1);
    });
  });
});
