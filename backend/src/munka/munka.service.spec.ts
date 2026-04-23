import { describe, it, expect, beforeEach, vi } from 'vitest';
import { MunkaService } from './munka.service';
import { PrismaService } from '../prisma.service';

describe('MunkaService', () => {
  let munkaService: MunkaService;
  let prismaService: PrismaService;

  const mockPrismaMunka = {
    findMany: vi.fn(),
    findUnique: vi.fn(),
    create: vi.fn(),
    update: vi.fn(),
  };

  const mockPrismaMunkaUser = {
    create: vi.fn(),
    deleteMany: vi.fn(),
  };

  const mockPrismaMunkaEszkoz = {
    create: vi.fn(),
    deleteMany: vi.fn(),
  };

  const mockPrismaFeladat = {
    create: vi.fn(),
  };

  const mockPrismaEszkoz = {
    update: vi.fn(),
  };

  const mockPrisma = {
    munka: mockPrismaMunka,
    munkaUser: mockPrismaMunkaUser,
    munkaEszkoz: mockPrismaMunkaEszkoz,
    feladat: mockPrismaFeladat,
    eszkoz: mockPrismaEszkoz,
  };

  beforeEach(() => {
    vi.clearAllMocks();
    prismaService = mockPrisma as any;
    munkaService = new MunkaService(prismaService);
  });

  describe('findAll', () => {
    it('should return all active munka for admin', async () => {
      const mockMunkak = [
        {
          munka_id: 1,
          munka_neve: 'Project 1',
          leiras: 'Description',
          isActive: true,
          feladat: [],
          munkaUsers: [],
          munkaEszkozok: [],
        },
      ];

      mockPrismaMunka.findMany.mockResolvedValue(mockMunkak);

      const result = await munkaService.findAll(true);

      expect(mockPrismaMunka.findMany).toHaveBeenCalled();
      const call = (mockPrismaMunka.findMany as any).mock.calls[0][0];
      expect(call.where.isActive).toBe(true);
      expect(call.include.feladat).toBe(true);
      expect(result).toEqual(mockMunkak);
    });

    it('should return filtered munka for non-admin user', async () => {
      const userId = 1;
      const mockMunkak = [
        {
          munka_id: 1,
          munka_neve: 'User Project',
          isActive: true,
          munkaUsers: [{ user_id: userId }],
        },
      ];

      mockPrismaMunka.findMany.mockResolvedValue(mockMunkak);

      const result = await munkaService.findAll(false, userId);

      expect(mockPrismaMunka.findMany).toHaveBeenCalled();
      const call = (mockPrismaMunka.findMany as any).mock.calls[0][0];
      expect(call.where.isActive).toBe(true);
      expect(call.where.munkaUsers.some.user_id).toBe(userId);
      expect(result).toEqual(mockMunkak);
    });
  });

  describe('findOne', () => {
    it('should return a munka with all relations', async () => {
      const mockMunka = {
        munka_id: 1,
        munka_neve: 'Project',
        leiras: 'Description',
        feladat: [],
        munkaUsers: [],
        munkaEszkozok: [],
      };

      mockPrismaMunka.findUnique.mockResolvedValue(mockMunka);

      const result = await munkaService.findOne(1);

      expect(mockPrismaMunka.findUnique).toHaveBeenCalledWith({
        where: { munka_id: 1 },
        include: {
          feladat: true,
          munkaUsers: { include: { user: true } },
          munkaEszkozok: { include: { eszkoz: true } },
        },
      });
      expect(result).toEqual(mockMunka);
    });

    it('should return null when munka does not exist', async () => {
      mockPrismaMunka.findUnique.mockResolvedValue(null);

      const result = await munkaService.findOne(999);

      expect(result).toBeNull();
    });
  });

  describe('create', () => {
    it('should create a munka with workers and tools', async () => {
      const createMunkaDto = {
        nev: 'New Project',
        leiras: 'Project description',
        dolgozok: [1, 2],
        eszkozok: [1, 2],
        feladatok: ['Task 1', 'Task 2'],
        kezdetiDatum: new Date(),
        velemenyDatum: new Date(),
      };

      const mockCreatedMunka = {
        munka_id: 1,
        munka_neve: 'New Project',
        leiras: 'Project description',
        isActive: true,
        ertesitesIsActive: false,
      };

      mockPrismaMunka.create.mockResolvedValue(mockCreatedMunka);
      mockPrismaMunka.findUnique.mockResolvedValue(mockCreatedMunka);
      mockPrismaMunkaUser.create.mockResolvedValue({});
      mockPrismaEszkoz.update.mockResolvedValue({});

      const result = await munkaService.create(createMunkaDto);

      expect(mockPrismaMunka.create).toHaveBeenCalled();
      expect(mockPrismaMunkaUser.create).toHaveBeenCalledTimes(2); // For 2 users
      expect(mockPrismaEszkoz.update).toHaveBeenCalledTimes(2); // For 2 tools
      expect(result.munka_id).toBe(1);
    });

    it('should handle munka creation with minimal data', async () => {
      const createMunkaDto = {
        leiras: 'Description',
      };

      const mockCreatedMunka = {
        munka_id: 1,
        munka_neve: expect.any(String),
        isActive: true,
      };

      mockPrismaMunka.create.mockResolvedValue(mockCreatedMunka);
      mockPrismaMunka.findUnique.mockResolvedValue(mockCreatedMunka);

      const result = await munkaService.create(createMunkaDto);

      expect(mockPrismaMunka.create).toHaveBeenCalled();
      expect(result.munka_id).toBe(1);
    });
  });

  describe('update', () => {
    it('should update a munka', async () => {
      const updateMunkaDto = {
        munka_neve: 'Updated Project',
        leiras: 'Updated description',
      };

      const mockUpdatedMunka = {
        munka_id: 1,
        ...updateMunkaDto,
        isActive: true,
      };

      mockPrismaMunka.update.mockResolvedValue(mockUpdatedMunka);
      mockPrismaMunka.findUnique.mockResolvedValue(mockUpdatedMunka);

      const result = await munkaService.update(1, updateMunkaDto as any);

      expect(mockPrismaMunka.update).toHaveBeenCalled();
      const call = (mockPrismaMunka.update as any).mock.calls[0][0];
      expect(call.where.munka_id).toBe(1);
      expect(call.data.munka_neve).toBe('Updated Project');
      expect(result.munka_neve).toBe('Updated Project');
    });
  });

  describe('delete', () => {
    it('should soft delete a munka', async () => {
      const mockDeletedMunka = {
        munka_id: 1,
        munka_neve: 'Project',
        isActive: false,
      };

      mockPrismaMunka.update.mockResolvedValue(mockDeletedMunka);

      const result = await munkaService.delete(1);

      expect(mockPrismaMunka.update).toHaveBeenCalledWith({
        where: { munka_id: 1 },
        data: { isActive: false },
      });
      expect(result.isActive).toBe(false);
    });
  });

  describe('restore', () => {
    it('should restore a deleted munka', async () => {
      const mockRestoredMunka = {
        munka_id: 1,
        munka_neve: 'Project',
        isActive: true,
      };

      mockPrismaMunka.update.mockResolvedValue(mockRestoredMunka);

      const result = await munkaService.restore(1);

      expect(mockPrismaMunka.update).toHaveBeenCalledWith({
        where: { munka_id: 1 },
        data: { isActive: true },
      });
      expect(result.isActive).toBe(true);
    });
  });

  describe('findDeleted', () => {
    it('should return all inactive munka', async () => {
      const mockDeletedMunkak = [
        { munka_id: 1, munka_neve: 'Deleted Project 1', isActive: false },
        { munka_id: 2, munka_neve: 'Deleted Project 2', isActive: false },
      ];

      mockPrismaMunka.findMany.mockResolvedValue(mockDeletedMunkak);

      const result = await munkaService.findDeleted();

      expect(mockPrismaMunka.findMany).toHaveBeenCalled();
      const call = (mockPrismaMunka.findMany as any).mock.calls[0][0];
      expect(call.where.isActive).toBe(false);
      expect(result).toEqual(mockDeletedMunkak);
    });
  });
});
