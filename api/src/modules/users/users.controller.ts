import {
    Controller,
    Get,
    Post,
    Body,
    Patch,
    Param,
    Delete,
    UseGuards,
    UseInterceptors,
  } from '@nestjs/common';
  import { UsersService } from './users.service';
  import { CreateUserDto } from "./dto/create-user.dto";
  import { UpdateUserDto } from "./dto/update-user.dto";
  import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
  import { AuthGuard } from "../auth/auth.guard";
  import { ClassSerializerInterceptor } from '@nestjs/common';
  import { SkipThrottle } from '@nestjs/throttler';
  
  @SkipThrottle()
  @UseInterceptors(ClassSerializerInterceptor)
  @ApiBearerAuth()
  @Controller('users')
  @ApiTags('users')
  export class UsersController {
    constructor(private readonly usersService: UsersService) {}
  
    @Post("register")
    create(@Body() createUserDto: CreateUserDto) {
      return this.usersService.create(createUserDto);
    }
  
    @Get(':id')
    findOne(@Param('id') id: string) {
      return this.usersService.findOne(+id);
    }
  }
  