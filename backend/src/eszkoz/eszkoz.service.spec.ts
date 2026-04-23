import { describe, it, expect, beforeEach, vi } from 'vitest';
import { EszkozService } from './eszkoz.service';
import { PrismaService } from '../prisma.service';

describe('EszkozService', () => {
  let eszkozService: EszkozService;
  let prismaService: PrismaService;

  const mockPrismaEszkoz = {
    findMany: vi.fn(),
    findUnique: vi.fn(),
    create: vi.fn(),
    update: vi.fn(),
  };

  const mockPrisma = {
    eszkoz: mockPrismaEszkoz,
  };

  beforeEach(() => {
    vi.clearAllMocks();
    prismaService = mockPrisma as any;
    eszkozService = new EszkozService(prismaService);
  });

  describe('findAll', () => {
    it('should return all active eszkozok', async () => {
      const mockEszkozok = [
        { eszkoz_id: 1, nev: 'Laptop', tipus: 'Computer', darabszam: 5, hasznalatban: false, isActive: true },
        { eszkoz_id: 2, nev: 'Monitor', tipus: 'Display', darabszam: 10, hasznalatban: false, isActive: true },
      ];

      mockPrismaEszkoz.findMany.mockResolvedValue(mockEszkozok);

      const result = await eszkozService.findAll();

      expect(mockPrismaEszkoz.findMany).toHaveBeenCalledWith({
        where: { isActive: true },
      });
      expect(result).toEqual(mockEszkozok);
      expect(result).toHaveLength(2);
    });

    it('should return empty array when no active eszkozok exist', async () => {
      mockPrismaEszkoz.findMany.mockResolvedValue([]);

      const result = await eszkozService.findAll();

      expect(result).toEqual([]);
    });
  });

  describe('findOne', () => {
    it('should return an eszkoz by id', async () => {
      const mockEszkoz = {
        eszkoz_id: 1,
        nev: 'Laptop',
        tipus: 'Computer',
        darabszam: 5,
        hasznalatban: false,
        isActive: true,
      };

      mockPrismaEszkoz.findUnique.mockResolvedValue(mockEszkoz);

      const result = await eszkozService.findOne(1);

      expect(mockPrismaEszkoz.findUnique).toHaveBeenCalledWith({
        where: { eszkoz_id: 1 },
      });
      expect(result).toEqual(mockEszkoz);
    });

    it('should return null when eszkoz does not exist', async () => {
      mockPrismaEszkoz.findUnique.mockResolvedValue(null);

      const result = await eszkozService.findOne(999);

      expect(result).toBeNull();
    });
  });

  describe('create', () => {
    it('should create a new eszkoz with isActive set to true', async () => {
      const createEszkozDto = {
        nev: 'Projector',
        tipus: 'Display',
        darabszam: 2,
      };

      const mockCreatedEszkoz = {
        eszkoz_id: 1,
        ...createEszkozDto,
        hasznalatban: false,
        isActive: true,
      };

      mockPrismaEszkoz.create.mockResolvedValue(mockCreatedEszkoz);

      const result = await eszkozService.create(createEszkozDto as any);

      expect(mockPrismaEszkoz.create).toHaveBeenCalledWith({
        data: {
          ...createEszkozDto,
          isActive: true,
        },
      });
      expect(result.isActive).toBe(true);
    });
  });

  describe('update', () => {
    it('should update an eszkoz', async () => {
      const updateEszkozDto = {
        nev: 'Updated Laptop',
        darabszam: 6,
      };

      const mockUpdatedEszkoz = {
        eszkoz_id: 1,
        nev: 'Updated Laptop',
        tipus: 'Computer',
        darabszam: 6,
        hasznalatban: false,
        isActive: true,
      };

      mockPrismaEszkoz.update.mockResolvedValue(mockUpdatedEszkoz);

      const result = await eszkozService.update(1, updateEszkozDto as any);

      expect(mockPrismaEszkoz.update).toHaveBeenCalledWith({
        where: { eszkoz_id: 1 },
        data: updateEszkozDto,
      });
      expect(result.nev).toBe('Updated Laptop');
    });
  });

  describe('delete', () => {
    it('should soft delete an eszkoz', async () => {
      const mockDeletedEszkoz = {
        eszkoz_id: 1,
        nev: 'Laptop',
        isActive: false,
      };

      mockPrismaEszkoz.update.mockResolvedValue(mockDeletedEszkoz);

      const result = await eszkozService.delete(1);

      expect(mockPrismaEszkoz.update).toHaveBeenCalledWith({
        where: { eszkoz_id: 1 },
        data: { isActive: false },
      });
      expect(result.isActive).toBe(false);
    });
  });

  describe('restore', () => {
    it('should restore a deleted eszkoz', async () => {
      const mockRestoredEszkoz = {
        eszkoz_id: 1,
        nev: 'Laptop',
        isActive: true,
      };

      mockPrismaEszkoz.update.mockResolvedValue(mockRestoredEszkoz);

      const result = await eszkozService.restore(1);

      expect(mockPrismaEszkoz.update).toHaveBeenCalledWith({
        where: { eszkoz_id: 1 },
        data: { isActive: true },
      });
      expect(result.isActive).toBe(true);
    });
  });

  describe('findDeleted', () => {
    it('should return all inactive eszkozok', async () => {
      const mockDeletedEszkozok = [
        { eszkoz_id: 1, nev: 'Old Laptop', isActive: false },
        { eszkoz_id: 2, nev: 'Broken Monitor', isActive: false },
      ];

      mockPrismaEszkoz.findMany.mockResolvedValue(mockDeletedEszkozok);

      const result = await eszkozService.findDeleted();

      expect(mockPrismaEszkoz.findMany).toHaveBeenCalledWith({
        where: { isActive: false },
      });
      expect(result).toEqual(mockDeletedEszkozok);
      expect(result).toHaveLength(2);
    });
  });
});
