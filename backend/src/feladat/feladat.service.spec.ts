import { describe, it, expect, beforeEach, vi } from 'vitest';
import { FeladatService } from './feladat.service';
import { PrismaService } from '../prisma.service';

describe('FeladatService', () => {
  let feladatService: FeladatService;
  let prismaService: PrismaService;

  const mockPrismaFeladat = {
    findMany: vi.fn(),
    findUnique: vi.fn(),
    create: vi.fn(),
    update: vi.fn(),
  };

  const mockPrisma = {
    feladat: mockPrismaFeladat,
  };

  beforeEach(() => {
    vi.clearAllMocks();
    prismaService = mockPrisma as any;
    feladatService = new FeladatService(prismaService);
  });

  describe('findAll', () => {
    it('should return all active feladatok', async () => {
      const mockFeladatok = [
        { feladat_id: 1, munka_id: 1, leiras: 'Task 1', isCompleted: false, isActive: true },
        { feladat_id: 2, munka_id: 1, leiras: 'Task 2', isCompleted: false, isActive: true },
      ];

      mockPrismaFeladat.findMany.mockResolvedValue(mockFeladatok);

      const result = await feladatService.findAll();

      expect(mockPrismaFeladat.findMany).toHaveBeenCalledWith({
        where: { isActive: true },
      });
      expect(result).toEqual(mockFeladatok);
      expect(result).toHaveLength(2);
    });

    it('should return empty array when no active feladatok exist', async () => {
      mockPrismaFeladat.findMany.mockResolvedValue([]);

      const result = await feladatService.findAll();

      expect(result).toEqual([]);
    });
  });

  describe('findOne', () => {
    it('should return a feladat by id', async () => {
      const mockFeladat = {
        feladat_id: 1,
        munka_id: 1,
        leiras: 'Task 1',
        isCompleted: false,
        isActive: true,
      };

      mockPrismaFeladat.findUnique.mockResolvedValue(mockFeladat);

      const result = await feladatService.findOne(1);

      expect(mockPrismaFeladat.findUnique).toHaveBeenCalledWith({
        where: { feladat_id: 1 },
      });
      expect(result).toEqual(mockFeladat);
    });

    it('should return null when feladat does not exist', async () => {
      mockPrismaFeladat.findUnique.mockResolvedValue(null);

      const result = await feladatService.findOne(999);

      expect(result).toBeNull();
    });
  });

  describe('create', () => {
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

      mockPrismaFeladat.create.mockResolvedValue(mockCreatedFeladat);

      const result = await feladatService.create(createFeladatDto as any);

      expect(mockPrismaFeladat.create).toHaveBeenCalledWith({
        data: createFeladatDto,
      });
      expect(result.feladat_id).toBe(1);
      expect(result.leiras).toBe('New task');
    });
  });

  describe('update', () => {
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

      mockPrismaFeladat.update.mockResolvedValue(mockUpdatedFeladat);

      const result = await feladatService.update(1, updateFeladatDto as any);

      expect(mockPrismaFeladat.update).toHaveBeenCalledWith({
        where: { feladat_id: 1 },
        data: updateFeladatDto,
      });
      expect(result.isCompleted).toBe(true);
      expect(result.leiras).toBe('Updated task');
    });
  });

  describe('delete', () => {
    it('should soft delete a feladat', async () => {
      const mockDeletedFeladat = {
        feladat_id: 1,
        leiras: 'Task',
        isActive: false,
      };

      mockPrismaFeladat.update.mockResolvedValue(mockDeletedFeladat);

      const result = await feladatService.delete(1);

      expect(mockPrismaFeladat.update).toHaveBeenCalledWith({
        where: { feladat_id: 1 },
        data: { isActive: false },
      });
      expect(result.isActive).toBe(false);
    });
  });

  describe('restore', () => {
    it('should restore a deleted feladat', async () => {
      const mockRestoredFeladat = {
        feladat_id: 1,
        leiras: 'Task',
        isActive: true,
      };

      mockPrismaFeladat.update.mockResolvedValue(mockRestoredFeladat);

      const result = await feladatService.restore(1);

      expect(mockPrismaFeladat.update).toHaveBeenCalledWith({
        where: { feladat_id: 1 },
        data: { isActive: true },
      });
      expect(result.isActive).toBe(true);
    });
  });

  describe('findDeleted', () => {
    it('should return all inactive feladatok', async () => {
      const mockDeletedFeladatok = [
        { feladat_id: 1, leiras: 'Deleted task 1', isActive: false },
        { feladat_id: 2, leiras: 'Deleted task 2', isActive: false },
      ];

      mockPrismaFeladat.findMany.mockResolvedValue(mockDeletedFeladatok);

      const result = await feladatService.findDeleted();

      expect(mockPrismaFeladat.findMany).toHaveBeenCalledWith({
        where: { isActive: false },
      });
      expect(result).toEqual(mockDeletedFeladatok);
      expect(result).toHaveLength(2);
    });
  });
});
