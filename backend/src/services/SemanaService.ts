import { SemanaModel } from '../models/SemanaModel';
import { prisma } from '../config/prisma';
import type { Semana } from '@prisma/client';

/**
 * SemanaService — lógica de negocio para semanas.
 */
export class SemanaService {
  async findAll(): Promise<Semana[]> {
    const model = new SemanaModel('', 0, '', '');
    return model.findAll();
  }

  async findById(id: string): Promise<Semana | null> {
    const model = new SemanaModel(id, 0, '', '');
    return model.findById(id);
  }
}
