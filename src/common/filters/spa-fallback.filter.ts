import { ExceptionFilter, Catch, ArgumentsHost, NotFoundException } from '@nestjs/common';
import { Request, Response } from 'express';
import { join } from 'path';
import { existsSync } from 'fs';

@Catch(NotFoundException)
export class SpaFallbackFilter implements ExceptionFilter {
  private readonly dashboardDist: string;

  constructor() {
    this.dashboardDist = join(process.cwd(), 'dashboard-dist');
  }

  catch(exception: NotFoundException, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const req = ctx.getRequest<Request>();
    const res = ctx.getResponse<Response>();

    // Let API routes return their own 404 responses
    if (req.path.startsWith('/api/')) {
      const status = exception.getStatus();
      const exceptionResponse = exception.getResponse();
      const body =
        typeof exceptionResponse === 'string'
          ? { statusCode: status, message: exceptionResponse }
          : exceptionResponse;
      res.status(status).json(body);
      return;
    }

    // No dashboard built — pass through 404
    if (!existsSync(this.dashboardDist)) {
      res.status(404).json({
        statusCode: 404,
        message: `Cannot ${req.method} ${req.path}`,
      });
      return;
    }

    // SPA fallback: serve index.html for client-side routing
    res.sendFile(join(this.dashboardDist, 'index.html'));
  }
}
