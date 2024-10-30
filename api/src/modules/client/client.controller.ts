import {
    Controller,
    Get,
    Post,
    Body,
    UseGuards,
    Req,
    UseInterceptors,
    Patch,
    Param,
    Delete,
  } from "@nestjs/common";
  import { JWTUtil } from "../../jwt/jwt.service";
  import { ApiBearerAuth, ApiTags } from "@nestjs/swagger";
  import { AuthGuard } from "../auth/auth.guard";
  import { ClassSerializerInterceptor } from "@nestjs/common";
  import { SkipThrottle } from "@nestjs/throttler";
  import { ClientService } from "./client.service";
  import { ClientDto } from "./dto/client.dto";
  
  @SkipThrottle()
  @UseInterceptors(ClassSerializerInterceptor)
  @ApiBearerAuth()
  @UseGuards(AuthGuard)
  @Controller("client")
  @ApiTags("client")
  export class ClientController {
    constructor(
      private readonly clientService: ClientService,
      private readonly jwtUtil: JWTUtil,
    ) {}
  
    @Post("add")
    add(@Body() createClientDto: ClientDto, @Req() req) {
      const authHeader = req.headers.authorization;
      const token = this.jwtUtil.decode(authHeader);
      return this.clientService.createClient(token.sub, {
        ...createClientDto,
      });
    }
    @Get('list')
    findOne( @Req() req) {
      const authHeader = req.headers.authorization;
      const token = this.jwtUtil.decode(authHeader);
      return this.clientService.findOne(token.sub);
    }

    @Patch(':id')
    updateClient(@Param('id') id: string, @Body() updateClientDto: ClientDto) {
      return this.clientService.updateClient(+id, updateClientDto);
    }
  
    @Delete(':id')
    deleteClient(@Param('id') id: string) {
      return this.clientService.deleteClient(+id);
    }
  }
  