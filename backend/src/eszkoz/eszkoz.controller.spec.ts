import { describe, it, expect, beforeEach, vi } from 'vitest';
import { Test, TestingModule } from '@nestjs/testing';
import { EszkozController } from './eszkoz.controller';
import { EszkozService } from './eszkoz.service';

describe('EszkozController', () => {
  let controller: EszkozController;
  let eszkozService: EszkozService;

  const mockEszkozService = {
    findAll: vi.fn(),
    findOne: vi.fn(),
    create: vi.fn(),
    update: vi.fn(),
    delete: vi.fn(),
    restore: vi.fn(),
    findDeleted: vi.fn(),
  };

  beforeEach(async () => {
    vi.clearAllMocks();

    const module: TestingModule = await Test.createTestingModule({
      controllers: [EszkozController],
      providers: [
        {
          provide: EszkozService,
          useValue: mockEszkozService,
        },
      ],
    }).compile();

    controller = module.get<EszkozController>(EszkozController);
    eszkozService = module.get<EszkozService>(EszkozService);
  });

  describe('POST /eszkozok', () => {
    it('should create a new eszkoz', async () => {
      const createEszkozDto = {
        nev: 'Laptop',
        tipus: 'Computer',
        darabszam: 5,
      };

      const mockCreatedEszkoz = {
        eszkoz_id: 1,
        ...createEszkozDto,
        hasznalatban: false,
        isActive: true,
      };

      mockEszkozService.create.mockResolvedValue(mockCreatedEszkoz);

      const result = await controller.create(createEszkozDto as any);

      expect(mockEszkozService.create).toHaveBeenCalledWith(createEszkozDto);
      expect(result).toEqual(mockCreatedEszkoz);
    });
  });

  describe('GET /eszkozok', () => {
    it('should return all active eszkozok', async () => {
      const mockEszkozok = [
        { eszkoz_id: 1, nev: 'Laptop', tipus: 'Computer', darabszam: 5, hasznalatban: false, isActive: true },
        { eszkoz_id: 2, nev: 'Monitor', tipus: 'Display', darabszam: 10, hasznalatban: false, isActive: true },
      ];

      mockEszkozService.findAll.mockResolvedValue(mockEszkozok);

      const result = await controller.findAll();

      expect(mockEszkozService.findAll).toHaveBeenCalled();
      expect(result).toEqual(mockEszkozok);
      expect(result).toHaveLength(2);
    });
  });

  describe('GET /eszkozok/deleted', () => {
    it('should return all deleted eszkozok', async () => {
      const mockDeletedEszkozok = [
        { eszkoz_id: 1, nev: 'Old Laptop', isActive: false },
        { eszkoz_id: 2, nev: 'Broken Monitor', isActive: false },
      ];

      mockEszkozService.findDeleted.mockResolvedValue(mockDeletedEszkozok);

      const result = await controller.findDeleted();

      expect(mockEszkozService.findDeleted).toHaveBeenCalled();
      expect(result).toEqual(mockDeletedEszkozok);
    });
  });

  describe('GET /eszkozok/:id', () => {
    it('should return an eszkoz by id', async () => {
      const mockEszkoz = {
        eszkoz_id: 1,
        nev: 'Laptop',
        tipus: 'Computer',
        darabszam: 5,
        hasznalatban: false,
        isActive: true,
      };

      mockEszkozService.findOne.mockResolvedValue(mockEszkoz);

      const result = await controller.findOne('1');

      expect(mockEszkozService.findOne).toHaveBeenCalledWith(1);
      expect(result).toEqual(mockEszkoz);
    });

    it('should return null when eszkoz does not exist', async () => {
      mockEszkozService.findOne.mockResolvedValue(null);

      const result = await controller.findOne('999');

      expect(mockEszkozService.findOne).toHaveBeenCalledWith(999);
      expect(result).toBeNull();
    });
  });

  describe('PATCH /eszkozok/:id', () => {
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

      mockEszkozService.update.mockResolvedValue(mockUpdatedEszkoz);

      const result = await controller.update('1', updateEszkozDto as any);

      expect(mockEszkozService.update).toHaveBeenCalledWith(1, updateEszkozDto);
      expect(result).toEqual(mockUpdatedEszkoz);
    });
  });

  describe('DELETE /eszkozok/:id', () => {
    it('should delete an eszkoz', async () => {
      const mockDeletedEszkoz = {
        eszkoz_id: 1,
        nev: 'Laptop',
        isActive: false,
      };

      mockEszkozService.delete.mockResolvedValue(mockDeletedEszkoz);

      const result = await controller.remove('1');

      expect(mockEszkozService.delete).toHaveBeenCalledWith(1);
      expect(result.isActive).toBe(false);
    });
  });

  describe('PATCH /eszkozok/:id/restore', () => {
    it('should restore a deleted eszkoz', async () => {
      const mockRestoredEszkoz = {
        eszkoz_id: 1,
        nev: 'Laptop',
        isActive: true,
      };

      mockEszkozService.restore.mockResolvedValue(mockRestoredEszkoz);

      const result = await controller.restore('1');

      expect(mockEszkozService.restore).toHaveBeenCalledWith(1);
      expect(result.isActive).toBe(true);
    });
  });
});
