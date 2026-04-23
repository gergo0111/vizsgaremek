import { describe, it, expect, beforeEach, vi } from 'vitest';
import { CommentService } from './comment.service';
import { PrismaService } from '../prisma.service';

describe('CommentService', () => {
  let commentService: CommentService;
  let prismaService: PrismaService;

  const mockPrismaComment = {
    findMany: vi.fn(),
    findUnique: vi.fn(),
    create: vi.fn(),
    update: vi.fn(),
  };

  const mockPrisma = {
    comment: mockPrismaComment,
  };

  beforeEach(() => {
    vi.clearAllMocks();
    prismaService = mockPrisma as any;
    commentService = new CommentService(prismaService);
  });

  describe('findAll', () => {
    it('should return all active comments', async () => {
      const mockComments = [
        {
          comment_id: 1,
          user_id: 1,
          munka_id: 1,
          uzenet: 'Great work!',
          kuldesi_ido: new Date(),
          delete: false,
          isActive: true,
        },
        {
          comment_id: 2,
          user_id: 2,
          munka_id: 1,
          uzenet: 'Well done!',
          kuldesi_ido: new Date(),
          delete: false,
          isActive: true,
        },
      ];

      mockPrismaComment.findMany.mockResolvedValue(mockComments);

      const result = await commentService.findAll();

      expect(mockPrismaComment.findMany).toHaveBeenCalledWith({
        where: { isActive: true },
      });
      expect(result).toEqual(mockComments);
      expect(result).toHaveLength(2);
    });

    it('should return empty array when no active comments exist', async () => {
      mockPrismaComment.findMany.mockResolvedValue([]);

      const result = await commentService.findAll();

      expect(result).toEqual([]);
    });
  });

  describe('findOne', () => {
    it('should return a comment by id', async () => {
      const mockComment = {
        comment_id: 1,
        user_id: 1,
        munka_id: 1,
        uzenet: 'Great work!',
        kuldesi_ido: new Date(),
        delete: false,
        isActive: true,
      };

      mockPrismaComment.findUnique.mockResolvedValue(mockComment);

      const result = await commentService.findOne(1);

      expect(mockPrismaComment.findUnique).toHaveBeenCalledWith({
        where: { comment_id: 1 },
      });
      expect(result).toEqual(mockComment);
    });

    it('should return null when comment does not exist', async () => {
      mockPrismaComment.findUnique.mockResolvedValue(null);

      const result = await commentService.findOne(999);

      expect(result).toBeNull();
    });
  });

  describe('create', () => {
    it('should create a new comment', async () => {
      const createCommentDto = {
        user_id: 1,
        munka_id: 1,
        uzenet: 'New comment',
      };

      const mockCreatedComment = {
        comment_id: 1,
        ...createCommentDto,
        kuldesi_ido: new Date(),
        delete: false,
        isActive: true,
      };

      mockPrismaComment.create.mockResolvedValue(mockCreatedComment);

      const result = await commentService.create(createCommentDto as any);

      expect(mockPrismaComment.create).toHaveBeenCalledWith({
        data: createCommentDto,
      });
      expect(result.comment_id).toBe(1);
      expect(result.uzenet).toBe('New comment');
    });
  });

  describe('update', () => {
    it('should update a comment', async () => {
      const updateCommentDto = {
        uzenet: 'Updated comment',
      };

      const mockUpdatedComment = {
        comment_id: 1,
        user_id: 1,
        munka_id: 1,
        ...updateCommentDto,
        kuldesi_ido: new Date(),
        delete: false,
        isActive: true,
      };

      mockPrismaComment.update.mockResolvedValue(mockUpdatedComment);

      const result = await commentService.update(1, updateCommentDto as any);

      expect(mockPrismaComment.update).toHaveBeenCalledWith({
        where: { comment_id: 1 },
        data: updateCommentDto,
      });
      expect(result.uzenet).toBe('Updated comment');
    });
  });

  describe('delete', () => {
    it('should soft delete a comment', async () => {
      const mockDeletedComment = {
        comment_id: 1,
        uzenet: 'Comment',
        isActive: false,
      };

      mockPrismaComment.update.mockResolvedValue(mockDeletedComment);

      const result = await commentService.delete(1);

      expect(mockPrismaComment.update).toHaveBeenCalledWith({
        where: { comment_id: 1 },
        data: { isActive: false },
      });
      expect(result.isActive).toBe(false);
    });
  });

  describe('restore', () => {
    it('should restore a deleted comment', async () => {
      const mockRestoredComment = {
        comment_id: 1,
        uzenet: 'Comment',
        isActive: true,
      };

      mockPrismaComment.update.mockResolvedValue(mockRestoredComment);

      const result = await commentService.restore(1);

      expect(mockPrismaComment.update).toHaveBeenCalledWith({
        where: { comment_id: 1 },
        data: { isActive: true },
      });
      expect(result.isActive).toBe(true);
    });
  });

  describe('findDeleted', () => {
    it('should return all inactive comments', async () => {
      const mockDeletedComments = [
        { comment_id: 1, uzenet: 'Deleted comment 1', isActive: false },
        { comment_id: 2, uzenet: 'Deleted comment 2', isActive: false },
      ];

      mockPrismaComment.findMany.mockResolvedValue(mockDeletedComments);

      const result = await commentService.findDeleted();

      expect(mockPrismaComment.findMany).toHaveBeenCalledWith({
        where: { isActive: false },
      });
      expect(result).toEqual(mockDeletedComments);
      expect(result).toHaveLength(2);
    });
  });
});
