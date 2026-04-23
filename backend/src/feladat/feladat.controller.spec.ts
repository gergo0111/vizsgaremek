import { describe, it, expect, beforeEach, vi } from 'vitest';
import { Test, TestingModule } from '@nestjs/testing';
import { FeladatController } from './feladat.controller';
import { FeladatService } from './feladat.service';

describe('FeladatController', () => {
  let controller: FeladatController;
  let feladatService: FeladatService;

  const mockFeladatService = {
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
      controllers: [FeladatController],
      providers: [
        {
          provide: FeladatService,
          useValue: mockFeladatService,
        },
      ],
    }).compile();

    controller = module.get<FeladatController>(FeladatController);
    feladatService = module.get<FeladatService>(FeladatService);
  });

  describe('POST /feladatok', () => {
    it('should create a new feladat', async () => {
      const createFeladatDto = {
        munka_id: 1,
        leiras: 'New task',
      };

      const mockCreatedFeladat = {
        feladat_id: 1,
        ...createFeladatDto,
        isCompleted: false,
        isActive: true,
      };

      mockFeladatService.create.mockResolvedValue(mockCreatedFeladat);

      const result = await controller.create(createFeladatDto as any);

      expect(mockFeladatService.create).toHaveBeenCalledWith(createFeladatDto);
      expect(result).toEqual(mockCreatedFeladat);
    });
  });

  describe('GET /feladatok', () => {
    it('should return all active feladatok', async () => {
      const mockFeladatok = [
        { feladat_id: 1, munka_id: 1, leiras: 'Task 1', isCompleted: false, isActive: true },
        { feladat_id: 2, munka_id: 1, leiras: 'Task 2', isCompleted: false, isActive: true },
      ];

      mockFeladatService.findAll.mockResolvedValue(mockFeladatok);

      const result = await controller.findAll();

      expect(mockFeladatService.findAll).toHaveBeenCalled();
      expect(result).toEqual(mockFeladatok);
    });
  });

  describe('GET /feladatok/deleted', () => {
    it('should return all deleted feladatok', async () => {
      const mockDeletedFeladatok = [
        { feladat_id: 1, leiras: 'Deleted task 1', isActive: false },
      ];

      mockFeladatService.findDeleted.mockResolvedValue(mockDeletedFeladatok);

      const result = await controller.findDeleted();

      expect(mockFeladatService.findDeleted).toHaveBeenCalled();
      expect(result).toEqual(mockDeletedFeladatok);
    });
  });

  describe('GET /feladatok/:id', () => {
    it('should return a feladat by id', async () => {
      const mockFeladat = {
        feladat_id: 1,
        munka_id: 1,
        leiras: 'Task',
        isCompleted: false,
        isActive: true,
      };

      mockFeladatService.findOne.mockResolvedValue(mockFeladat);

      const result = await controller.findOne('1');

      expect(mockFeladatService.findOne).toHaveBeenCalledWith(1);
      expect(result).toEqual(mockFeladat);
    });
  });

  describe('PATCH /feladatok/:id', () => {
    it('should update a feladat', async () => {
      const updateFeladatDto = {
        leiras: 'Updated task',
        isCompleted: true,
      };

      const mockUpdatedFeladat = {
        feladat_id: 1,
        munka_id: 1,
        ...updateFeladatDto,
        isActive: true,
      };

      mockFeladatService.update.mockResolvedValue(mockUpdatedFeladat);

      const result = await controller.update('1', updateFeladatDto as any);

      expect(mockFeladatService.update).toHaveBeenCalledWith(1, updateFeladatDto);
      expect(result.isCompleted).toBe(true);
    });
  });

  describe('DELETE /feladatok/:id', () => {
    it('should delete a feladat', async () => {
      const mockDeletedFeladat = {
        feladat_id: 1,
        leiras: 'Task',
        isActive: false,
      };

      mockFeladatService.delete.mockResolvedValue(mockDeletedFeladat);

      const result = await controller.remove('1');

      expect(mockFeladatService.delete).toHaveBeenCalledWith(1);
      expect(result.isActive).toBe(false);
    });
  });

  describe('PATCH /feladatok/:id/restore', () => {
    it('should restore a deleted feladat', async () => {
      const mockRestoredFeladat = {
        feladat_id: 1,
        leiras: 'Task',
        isActive: true,
      };

      mockFeladatService.restore.mockResolvedValue(mockRestoredFeladat);

      const result = await controller.restore('1');

      expect(mockFeladatService.restore).toHaveBeenCalledWith(1);
      expect(result.isActive).toBe(true);
    });
  });
});
