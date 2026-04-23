import { describe, it, expect, beforeEach, vi } from 'vitest';
import { Test, TestingModule } from '@nestjs/testing';
import { MunkaController } from './munka.controller';
import { MunkaService } from './munka.service';
import type { Request } from 'express';

describe('MunkaController', () => {
  let controller: MunkaController;
  let munkaService: MunkaService;

  const mockMunkaService = {
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
      controllers: [MunkaController],
      providers: [
        {
          provide: MunkaService,
          useValue: mockMunkaService,
        },
      ],
    }).compile();

    controller = module.get<MunkaController>(MunkaController);
    munkaService = module.get<MunkaService>(MunkaService);
  });

  describe('POST /munka', () => {
    it('should create a new munka', async () => {
      const createMunkaDto = {
        nev: 'Project 1',
        leiras: 'Description',
        dolgozok: [1, 2],
        eszkozok: [1],
      };

      const mockCreatedMunka = {
        munka_id: 1,
        munka_neve: 'Project 1',
        leiras: 'Description',
        isActive: true,
      };

      mockMunkaService.create.mockResolvedValue(mockCreatedMunka);

      const result = await controller.create(createMunkaDto);

      expect(mockMunkaService.create).toHaveBeenCalledWith(createMunkaDto);
      expect(result).toEqual(mockCreatedMunka);
    });
  });

  describe('GET /munka', () => {
    it('should return all munka for admin', async () => {
      const mockMunkak = [
        {
          munka_id: 1,
          munka_neve: 'Project 1',
          isActive: true,
          feladat: [],
          munkaUsers: [],
        },
      ];

      mockMunkaService.findAll.mockResolvedValue(mockMunkak);

      const mockReq = {
        user: {
          isAdmin: true,
          user_id: 1,
        },
      } as any;

      const result = await controller.findAll(mockReq);

      expect(mockMunkaService.findAll).toHaveBeenCalledWith(true, 1);
      expect(result).toEqual(mockMunkak);
    });

    it('should return filtered munka for non-admin user', async () => {
      const mockMunkak = [
        {
          munka_id: 1,
          munka_neve: 'User Project',
          isActive: true,
          munkaUsers: [{ user_id: 2 }],
        },
      ];

      mockMunkaService.findAll.mockResolvedValue(mockMunkak);

      const mockReq = {
        user: {
          isAdmin: false,
          user_id: 2,
        },
      } as any;

      const result = await controller.findAll(mockReq);

      expect(mockMunkaService.findAll).toHaveBeenCalledWith(false, 2);
      expect(result).toEqual(mockMunkak);
    });
  });

  describe('GET /munka/deleted', () => {
    it('should return deleted munka for admin', async () => {
      const mockDeletedMunkak = [
        { munka_id: 1, munka_neve: 'Deleted Project', isActive: false },
      ];

      mockMunkaService.findDeleted.mockResolvedValue(mockDeletedMunkak);

      const mockReq = {
        user: {
          isAdmin: true,
          user_id: 1,
        },
      } as any;

      const result = await controller.findDeleted(mockReq);

      expect(mockMunkaService.findDeleted).toHaveBeenCalledWith(true, 1);
      expect(result).toEqual(mockDeletedMunkak);
    });
  });

  describe('GET /munka/:id', () => {
    it('should return a munka by id', async () => {
      const mockMunka = {
        munka_id: 1,
        munka_neve: 'Project',
        isActive: true,
      };

      mockMunkaService.findOne.mockResolvedValue(mockMunka);

      const result = await controller.findOne('1');

      expect(mockMunkaService.findOne).toHaveBeenCalledWith(1);
      expect(result).toEqual(mockMunka);
    });
  });

  describe('PATCH /munka/:id', () => {
    it('should update a munka', async () => {
      const updateMunkaDto = {
        munka_neve: 'Updated Project',
      };

      const mockUpdatedMunka = {
        munka_id: 1,
        munka_neve: 'Updated Project',
        isActive: true,
      };

      mockMunkaService.update.mockResolvedValue(mockUpdatedMunka);

      const result = await controller.update('1', updateMunkaDto as any);

      expect(mockMunkaService.update).toHaveBeenCalledWith(1, updateMunkaDto);
      expect(result).toEqual(mockUpdatedMunka);
    });
  });

  describe('DELETE /munka/:id', () => {
    it('should delete a munka', async () => {
      const mockDeletedMunka = {
        munka_id: 1,
        munka_neve: 'Project',
        isActive: false,
      };

      mockMunkaService.delete.mockResolvedValue(mockDeletedMunka);

      const result = await controller.remove('1');

      expect(mockMunkaService.delete).toHaveBeenCalledWith(1);
      expect(result.isActive).toBe(false);
    });
  });

  describe('PATCH /munka/:id/restore', () => {
    it('should restore a deleted munka', async () => {
      const mockRestoredMunka = {
        munka_id: 1,
        munka_neve: 'Project',
        isActive: true,
      };

      mockMunkaService.restore.mockResolvedValue(mockRestoredMunka);

      const result = await controller.restore('1');

      expect(mockMunkaService.restore).toHaveBeenCalledWith(1);
      expect(result.isActive).toBe(true);
    });
  });
});
