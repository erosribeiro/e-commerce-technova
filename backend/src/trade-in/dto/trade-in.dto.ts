import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsEnum, IsNumber, Min } from 'class-validator';
import { ConditionGrade } from '@prisma/client';

export class CreateTradeInDto {
  @ApiProperty({ example: 'Smartphone' })
  @IsString()
  deviceCategory: string;

  @ApiProperty({ example: 'Samsung' })
  @IsString()
  deviceBrand: string;

  @ApiProperty({ example: 'Galaxy S22' })
  @IsString()
  deviceModel: string;

  @ApiProperty({ enum: ConditionGrade, example: ConditionGrade.B })
  @IsEnum(ConditionGrade)
  conditionGrade: ConditionGrade;
}

export class UpdateInspectionDto {
  @ApiProperty({ enum: ['RECEIVED', 'EVALUATED', 'CREDITED', 'REJECTED'] })
  @IsString()
  inspectionStatus: string;

  @ApiProperty({ example: 250.0, description: 'Valor final do crédito após inspeção' })
  @IsNumber()
  @Min(0)
  finalCreditValue: number;

  @ApiProperty({ required: false })
  @IsString()
  inspectionNotes?: string;
}
