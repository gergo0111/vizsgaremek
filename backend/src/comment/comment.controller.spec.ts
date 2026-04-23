import { describe, it, expect, beforeEach, vi } from 'vitest';
import { Test, TestingModule } from '@nestjs/testing';
import { CommentController } from './comment.controller';
import { CommentService } from './comment.service';

describe('CommentController', () => {
  let controller: CommentController;
  let commentService: CommentService;

  const mockCommentService = {
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
      controllers: [CommentController],
      providers: [
        {
          provide: CommentService,
          useValue: mockCommentService,
        },
      ],
    }).compile();

    controller = module.get<CommentController>(CommentController);
    commentService = module.get<CommentService>(CommentService);
  });

  describe('POST /comments', () => {
    it('should create a new comment', async () => {
      const createCommentDto = {
        user_id: 1,
        munka_id: 1,
        uzenet: 'Great work!',
      };

      const mockCreatedComment = {
        comment_id: 1,
        ...createCommentDto,
        kuldesi_ido: new Date(),
        delete: false,
        isActive: true,
      };

      mockCommentService.create.mockResolvedValue(mockCreatedComment);

      const result = await controller.create(createCommentDto as any);

      expect(mockCommentService.create).toHaveBeenCalledWith(createCommentDto);
      expect(result).toEqual(mockCreatedComment);
    });
  });

  describe('GET /comments', () => {
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
      ];

      mockCommentService.findAll.mockResolvedValue(mockComments);

      const result = await controller.findAll();

      expect(mockCommentService.findAll).toHaveBeenCalled();
      expect(result).toEqual(mockComments);
    });
  });

  describe('GET /comments/deleted', () => {
    it('should return all deleted comments', async () => {
      const mockDeletedComments = [
        { comment_id: 1, uzenet: 'Deleted comment', isActive: false },
      ];

      mockCommentService.findDeleted.mockResolvedValue(mockDeletedComments);

      const result = await controller.findDeleted();

      expect(mockCommentService.findDeleted).toHaveBeenCalled();
      expect(result).toEqual(mockDeletedComments);
    });
  });

  describe('GET /comments/:id', () => {
    it('should return a comment by id', async () => {
      const mockComment = {
        comment_id: 1,
        user_id: 1,
        munka_id: 1,
        uzenet: 'Great work!',
        isActive: true,
      };

      mockCommentService.findOne.mockResolvedValue(mockComment);

      const result = await controller.findOne('1');

      expect(mockCommentService.findOne).toHaveBeenCalledWith(1);
      expect(result).toEqual(mockComment);
    });
  });

  describe('PATCH /comments/:id', () => {
    it('should update a comment', async () => {
      const updateCommentDto = {
        uzenet: 'Updated comment',
      };

      const mockUpdatedComment = {
        comment_id: 1,
        user_id: 1,
        munka_id: 1,
        uzenet: 'Updated comment',
        isActive: true,
      };

      mockCommentService.update.mockResolvedValue(mockUpdatedComment);

      const result = await controller.update('1', updateCommentDto as any);

      expect(mockCommentService.update).toHaveBeenCalledWith(1, updateCommentDto);
      expect(result.uzenet).toBe('Updated comment');
    });
  });

  describe('DELETE /comments/:id', () => {
    it('should delete a comment', async () => {
      const mockDeletedComment = {
        comment_id: 1,
        uzenet: 'Comment',
        isActive: false,
      };

      mockCommentService.delete.mockResolvedValue(mockDeletedComment);

      const result = await controller.remove('1');

      expect(mockCommentService.delete).toHaveBeenCalledWith(1);
      expect(result.isActive).toBe(false);
    });
  });

  describe('PATCH /comments/:id/restore', () => {
    it('should restore a deleted comment', async () => {
      const mockRestoredComment = {
        comment_id: 1,
        uzenet: 'Comment',
        isActive: true,
      };

      mockCommentService.restore.mockResolvedValue(mockRestoredComment);

      const result = await controller.restore('1');

      expect(mockCommentService.restore).toHaveBeenCalledWith(1);
      expect(result.isActive).toBe(true);
    });
  });
});
