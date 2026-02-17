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
  Query,
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
@ApiTags("Client")
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
  @Get("list")
  findAll(
    @Req() req,
    @Query("limit") limit?: number,
    @Query("offset") offset?: number,
    @Query("search") search?: string,
  ) {
    const authHeader = req.headers.authorization;
    const token = this.jwtUtil.decode(authHeader);
    return this.clientService.findAll(token.sub, { limit, offset, search });
  }

  @Get(":id")
  findOne(@Param("id") id: number, @Req() req) {
    const authHeader = req.headers.authorization;
    const token = this.jwtUtil.decode(authHeader);
    return this.clientService.findOne(id, token.sub);
  }

  @Patch(":id")
  updateClient(@Param("id") id: string, @Body() updateClientDto: ClientDto, @Req() req) {
    const authHeader = req.headers.authorization;
    const token = this.jwtUtil.decode(authHeader);
    return this.clientService.updateClient(+id, token.sub, updateClientDto);
  }

  @Delete(":id")
  deleteClient(@Param("id") id: string, @Req() req) {
    const authHeader = req.headers.authorization;
    const token = this.jwtUtil.decode(authHeader);
    return this.clientService.deleteClient(+id, token.sub);
  }
}
