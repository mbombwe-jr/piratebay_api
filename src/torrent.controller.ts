import { Body, Controller, Get, Param, Post, Query, Req, Res } from '@nestjs/common';
import type { Request, Response } from 'express';
import { TorrentService } from './torrent.service';

const SORT_FILTERS: Record<string, number> = {
  title_asc: 1,
  title_desc: 2,
  time_desc: 3,
  time_asc: 4,
  size_desc: 5,
  size_asc: 6,
  seeds_desc: 7,
  seeds_asc: 8,
  leeches_desc: 9,
  leeches_asc: 10,
  uploader_asc: 11,
  uploader_desc: 12,
  category_asc: 13,
  category_desc: 14,
};

@Controller()
export class TorrentController {
  constructor(private readonly torrentService: TorrentService) {}

  @Get()
  index(@Res() res: Response) {
    res.status(200).json({
      message: 'Unofficial Pirate Bay API is active',
      endpoints: {
        search: {
          get: '/search?q=term&page=0&sort=seeds_desc&cat=300 OR /search/:term/:page/:cat?sort=seeds_desc',
          post: '/search { q: "term", page: 0, sort: "seeds_desc", cat: 300 }',
        },
        top: {
          get: '/top/:cat?sort=seeds_desc or /top?cat=0&sort=seeds_desc',
          post: '/top { cat: 0, sort: "seeds_desc" }',
        },
        top48h: {
          get: '/top48h/:cat?sort=seeds_desc or /top48h?cat=0&sort=seeds_desc',
          post: '/top48h { cat: 0, sort: "seeds_desc" }',
        },
        recent: {
          get: '/recent/:page?sort=seeds_desc or /recent?page=0&sort=seeds_desc',
          post: '/recent { page: 0, sort: "seeds_desc" }',
        },
        apiSearch: {
          get: '/api-search?q=query_params',
          post: '/api-search { q: "query_params" }',
        },
      },
    });
  }

  // --- TOP TORRENTS ---

  @Get(['top', 'top/0'])
  async getTop(
    @Query('cat') catQuery?: string,
    @Query('sort') sortQuery?: string,
  ) {
    const cat = parseInt(catQuery || '0', 10) || 0;
    const sortArg = SORT_FILTERS[sortQuery || ''] ? sortQuery || '' : '';
    const url = `${this.torrentService.getBaseUrl()}top/${cat}/${sortArg}`;
    return this.torrentService.parsePage(url, sortArg);
  }

  @Get('top/:cat')
  async getTopByCat(
    @Param('cat') catParam: string,
    @Query('sort') sortQuery?: string,
  ) {
    const cat = parseInt(catParam, 10) || 0;
    const sortArg = SORT_FILTERS[sortQuery || ''] ? sortQuery || '' : '';
    const url = `${this.torrentService.getBaseUrl()}top/${cat}/${sortArg}`;
    return this.torrentService.parsePage(url, sortArg);
  }

  @Post('top')
  async postTop(
    @Body('cat') catBody?: number | string,
    @Body('sort') sortBody?: string,
  ) {
    const cat = typeof catBody === 'number' ? catBody : parseInt(catBody || '0', 10) || 0;
    const sortArg = SORT_FILTERS[sortBody || ''] ? sortBody || '' : '';
    const url = `${this.torrentService.getBaseUrl()}top/${cat}/${sortArg}`;
    return this.torrentService.parsePage(url, sortArg);
  }

  // --- TOP 48 HOURS ---

  @Get(['top48h', 'top48h/0'])
  async getTop48h(
    @Query('cat') catQuery?: string,
    @Query('sort') sortQuery?: string,
  ) {
    const cat = parseInt(catQuery || '0', 10) || 0;
    const sortArg = SORT_FILTERS[sortQuery || ''] ? sortQuery || '' : '';
    const pythonUrl = cat === 0 
      ? `${this.torrentService.getBaseUrl()}top/48hall/` 
      : `${this.torrentService.getBaseUrl()}top/48h${cat}`;
    return this.torrentService.parsePage(pythonUrl, sortArg);
  }

  @Get('top48h/:cat')
  async getTop48hByCat(
    @Param('cat') catParam: string,
    @Query('sort') sortQuery?: string,
  ) {
    const cat = parseInt(catParam, 10) || 0;
    const sortArg = SORT_FILTERS[sortQuery || ''] ? sortQuery || '' : '';
    const pythonUrl = cat === 0 
      ? `${this.torrentService.getBaseUrl()}top/48hall/` 
      : `${this.torrentService.getBaseUrl()}top/48h${cat}`;
    return this.torrentService.parsePage(pythonUrl, sortArg);
  }

  @Post('top48h')
  async postTop48h(
    @Body('cat') catBody?: number | string,
    @Body('sort') sortBody?: string,
  ) {
    const cat = typeof catBody === 'number' ? catBody : parseInt(catBody || '0', 10) || 0;
    const sortArg = SORT_FILTERS[sortBody || ''] ? sortBody || '' : '';
    const pythonUrl = cat === 0 
      ? `${this.torrentService.getBaseUrl()}top/48hall/` 
      : `${this.torrentService.getBaseUrl()}top/48h${cat}`;
    return this.torrentService.parsePage(pythonUrl, sortArg);
  }

  // --- RECENT TORRENTS ---

  @Get('recent')
  async getRecent(
    @Query('page') pageQuery?: string,
    @Query('sort') sortQuery?: string,
  ) {
    const page = parseInt(pageQuery || '0', 10) || 0;
    const sortArg = SORT_FILTERS[sortQuery || ''] ? sortQuery || '' : '';
    const url = `${this.torrentService.getBaseUrl()}recent/${page}`;
    return this.torrentService.parsePage(url, sortArg);
  }

  @Get('recent/:page')
  async getRecentByPage(
    @Param('page') pageParam: string,
    @Query('sort') sortQuery?: string,
  ) {
    const page = parseInt(pageParam, 10) || 0;
    const sortArg = SORT_FILTERS[sortQuery || ''] ? sortQuery || '' : '';
    const url = `${this.torrentService.getBaseUrl()}recent/${page}`;
    return this.torrentService.parsePage(url, sortArg);
  }

  @Post('recent')
  async postRecent(
    @Body('page') pageBody?: number | string,
    @Body('sort') sortBody?: string,
  ) {
    const page = typeof pageBody === 'number' ? pageBody : parseInt(pageBody || '0', 10) || 0;
    const sortArg = SORT_FILTERS[sortBody || ''] ? sortBody || '' : '';
    const url = `${this.torrentService.getBaseUrl()}recent/${page}`;
    return this.torrentService.parsePage(url, sortArg);
  }

  // --- SEARCH TORRENTS ---

  @Get('search')
  async getSearch(
    @Query('q') q?: string,
    @Query('page') pageQuery?: string,
    @Query('sort') sortQuery?: string,
    @Query('cat') catQuery?: string,
  ) {
    if (!q) {
      return 'No search term entered<br/>Format for search: /search/search_term/page_no(optional)/cat_no(optional)/';
    }
    const page = parseInt(pageQuery || '0', 10) || 0;
    const sortArg = SORT_FILTERS[sortQuery || ''] ? SORT_FILTERS[sortQuery || ''] : '0';
    const cat = parseInt(catQuery || '0', 10) || 0;
    const url = `${this.torrentService.getBaseUrl()}search/${q}/${page}/${sortArg}/${cat}`;
    return this.torrentService.parsePage(url);
  }

  @Get(['search/:term', 'search/:term/:page', 'search/:term/:page/:cat'])
  async getSearchByTerm(
    @Param('term') term: string,
    @Param('page') pageParam?: string,
    @Param('cat') catParam?: string,
    @Query('sort') sortQuery?: string,
  ) {
    const page = parseInt(pageParam || '0', 10) || 0;
    const sortArg = SORT_FILTERS[sortQuery || ''] ? SORT_FILTERS[sortQuery || ''] : '0';
    const cat = parseInt(catParam || '0', 10) || 0;
    const url = `${this.torrentService.getBaseUrl()}search/${term}/${page}/${sortArg}/${cat}`;
    return this.torrentService.parsePage(url);
  }

  @Post('search')
  async postSearch(
    @Body('q') q: string,
    @Body('page') pageBody?: number | string,
    @Body('sort') sortBody?: string,
    @Body('cat') catBody?: number | string,
  ) {
    if (!q) {
      return { error: 'No search term entered' };
    }
    const page = typeof pageBody === 'number' ? pageBody : parseInt(pageBody || '0', 10) || 0;
    const sortArg = SORT_FILTERS[sortBody || ''] ? SORT_FILTERS[sortBody || ''] : '0';
    const cat = typeof catBody === 'number' ? catBody : parseInt(catBody || '0', 10) || 0;
    const url = `${this.torrentService.getBaseUrl()}search/${q}/${page}/${sortArg}/${cat}`;
    return this.torrentService.parsePage(url);
  }

  // --- API PASSTHROUGH SEARCH ---

  @Get('api-search')
  async getApiSearch(@Req() req: Request) {
    const queryIndex = req.url.indexOf('?');
    const queryString = queryIndex !== -1 ? req.url.substring(queryIndex + 1) : '';
    const url = `${this.torrentService.getBaseUrl()}s/?${queryString}`;
    return this.torrentService.parsePage(url);
  }

  @Post('api-search')
  async postApiSearch(@Body('q') q: string) {
    const url = `${this.torrentService.getBaseUrl()}s/?q=${encodeURIComponent(q || '')}`;
    return this.torrentService.parsePage(url);
  }
}
