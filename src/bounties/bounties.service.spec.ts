import { Test, TestingModule } from '@nestjs/testing';
import { getModelToken } from '@nestjs/mongoose';
import { NotFoundException } from '@nestjs/common';
import { BountiesService } from './bounties.service';
import { Bounty } from './schemas/bounty.schema';
import { BountyEstado } from './enums/bounty-estado.enum';

const mockBounty = {
  _id: '507f1f77bcf86cd799439011',
  cantidadBellys: 500000000,
  estado: BountyEstado.WANTED,
  pirata: '507f1f77bcf86cd799439012',
};

const mockBountyModel = {
  find: jest.fn(),
  findById: jest.fn(),
  findByIdAndUpdate: jest.fn(),
  findByIdAndDelete: jest.fn(),
  constructor: jest.fn(),
};

// Mock para new this.bountyModel(dto).save()
const mockSave = jest.fn().mockResolvedValue(mockBounty);
const mockModelConstructor = jest.fn().mockImplementation(() => ({
  save: mockSave,
}));
Object.assign(mockModelConstructor, mockBountyModel);

describe('BountiesService', () => {
  let service: BountiesService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        BountiesService,
        {
          provide: getModelToken(Bounty.name),
          useValue: mockModelConstructor,
        },
      ],
    }).compile();

    service = module.get<BountiesService>(BountiesService);

    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('findAll', () => {
    it('debe retornar un arreglo de bounties', async () => {
      // Arrange
      const bounties = [mockBounty];
      mockBountyModel.find.mockReturnValue({
        populate: jest.fn().mockReturnValue({
          exec: jest.fn().mockResolvedValue(bounties),
        }),
      });

      // Act
      const result = await service.findAll();

      // Assert
      expect(result).toEqual(bounties);
      expect(mockBountyModel.find).toHaveBeenCalled();
    });
  });

  describe('findActive', () => {
    it('debe retornar solo bounties con estado Wanted', async () => {
      // Arrange
      const activeBounties = [mockBounty];
      mockBountyModel.find.mockReturnValue({
        populate: jest.fn().mockReturnValue({
          exec: jest.fn().mockResolvedValue(activeBounties),
        }),
      });

      // Act
      const result = await service.findActive();

      // Assert
      expect(result).toEqual(activeBounties);
      expect(mockBountyModel.find).toHaveBeenCalledWith({
        estado: BountyEstado.WANTED,
      });
    });
  });

  describe('findOne', () => {
    it('debe retornar una bounty por ID', async () => {
      // Arrange
      mockBountyModel.findById.mockReturnValue({
        populate: jest.fn().mockReturnValue({
          exec: jest.fn().mockResolvedValue(mockBounty),
        }),
      });

      // Act
      const result = await service.findOne(mockBounty._id);

      // Assert
      expect(result).toEqual(mockBounty);
      expect(mockBountyModel.findById).toHaveBeenCalledWith(mockBounty._id);
    });

    it('debe lanzar NotFoundException si no existe', async () => {
      // Arrange
      const fakeId = '507f1f77bcf86cd799439099';
      mockBountyModel.findById.mockReturnValue({
        populate: jest.fn().mockReturnValue({
          exec: jest.fn().mockResolvedValue(null),
        }),
      });

      // Act & Assert
      await expect(service.findOne(fakeId)).rejects.toThrow(NotFoundException);
    });
  });

  describe('create', () => {
    it('debe crear y retornar una bounty', async () => {
      // Arrange
      const dto = {
        cantidadBellys: 500000000,
        estado: BountyEstado.WANTED,
        pirata: '507f1f77bcf86cd799439012',
      };
      mockSave.mockResolvedValue(mockBounty);

      // Act
      const result = await service.create(dto);

      // Assert
      expect(result).toEqual(mockBounty);
      expect(mockSave).toHaveBeenCalled();
    });
  });

  describe('update', () => {
    it('debe actualizar y retornar la bounty', async () => {
      // Arrange
      const updated = { ...mockBounty, cantidadBellys: 600000000 };
      mockBountyModel.findByIdAndUpdate.mockReturnValue({
        populate: jest.fn().mockReturnValue({
          exec: jest.fn().mockResolvedValue(updated),
        }),
      });

      // Act
      const result = await service.update(mockBounty._id, {
        cantidadBellys: 600000000,
      });

      // Assert
      expect(result).toEqual(updated);
    });

    it('debe lanzar NotFoundException si no existe al actualizar', async () => {
      // Arrange
      mockBountyModel.findByIdAndUpdate.mockReturnValue({
        populate: jest.fn().mockReturnValue({
          exec: jest.fn().mockResolvedValue(null),
        }),
      });

      // Act & Assert
      await expect(
        service.update('fakeId', { cantidadBellys: 1 }),
      ).rejects.toThrow(NotFoundException);
    });
  });

  describe('remove', () => {
    it('debe eliminar y retornar la bounty', async () => {
      // Arrange
      mockBountyModel.findByIdAndDelete.mockReturnValue({
        exec: jest.fn().mockResolvedValue(mockBounty),
      });

      // Act
      const result = await service.remove(mockBounty._id);

      // Assert
      expect(result).toEqual(mockBounty);
    });

    it('debe lanzar NotFoundException si no existe al eliminar', async () => {
      // Arrange
      mockBountyModel.findByIdAndDelete.mockReturnValue({
        exec: jest.fn().mockResolvedValue(null),
      });

      // Act & Assert
      await expect(service.remove('fakeId')).rejects.toThrow(
        NotFoundException,
      );
    });
  });
});
