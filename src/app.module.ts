import { Module } from '@nestjs/common';
import { TorrentController } from './torrent.controller';
import { TorrentService } from './torrent.service';

@Module({
  imports: [],
  controllers: [TorrentController],
  providers: [TorrentService],
})
export class AppModule {}
