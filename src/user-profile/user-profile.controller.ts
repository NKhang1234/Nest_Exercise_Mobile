import { Controller, Get, Put, Body, Req, UseGuards } from '@nestjs/common';
import { Request } from 'express';
import { UserProfileService } from './user-profile.service';
import { UpdateUserProfileDto } from './dto/update-user-profile.dto';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBearerAuth,
} from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RequestWithUser } from '../common/interfaces/request-with-user.interface';

@ApiTags('user-profile')
@ApiBearerAuth('JWT-auth')
@UseGuards(JwtAuthGuard)
@Controller('user-profile')
export class UserProfileController {
  constructor(private readonly userProfileService: UserProfileService) {}

  @Get()
  @ApiOperation({ summary: 'Get current user profile' })
  @ApiResponse({ status: 200, description: 'Returns the current user profile' })
  @ApiResponse({ status: 404, description: 'User profile not found' })
  async findOne(@Req() req: RequestWithUser) {
    const userId = req.user.id;
    return this.userProfileService.findOne(userId);
  }

  @Put()
  @ApiOperation({ summary: 'Update user profile' })
  @ApiResponse({
    status: 200,
    description: 'User profile updated successfully',
  })
  @ApiResponse({ status: 404, description: 'User profile not found' })
  async update(
    @Body() updateUserProfileDto: UpdateUserProfileDto,
    @Req() req: RequestWithUser,
  ) {
    const userId = req.user.id;
    return this.userProfileService.update(userId, updateUserProfileDto);
  }

  @Get('statistics')
  @ApiOperation({ summary: 'Get user statistics' })
  @ApiResponse({ status: 200, description: 'Returns the user statistics' })
  async getStatistics(@Req() req: RequestWithUser) {
    const userId = req.user.id;
    return this.userProfileService.getStatistics(userId);
  }
}
