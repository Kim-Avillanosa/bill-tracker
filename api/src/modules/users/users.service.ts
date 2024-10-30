import { BadRequestException, Injectable } from "@nestjs/common";
import { CreateUserDto } from "./dto/create-user.dto";
import { UpdateUserDto } from "./dto/update-user.dto";
import { InjectRepository } from "@nestjs/typeorm";
import { User } from "./entities/user.entity";
import { Repository, UpdateResult } from "typeorm";

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private usersRepository: Repository<User>,

  ) {}

  async create(createUserDto: CreateUserDto): Promise<User> {
    var userCount = await this.usersRepository.count({
      where: {
        email: createUserDto.email,
      },
    });

    if (userCount > 0) {
      throw new BadRequestException(
        `Apologies, but it appears that this email address is already in use within our system. If you believe this is a mistake or need assistance, please reach out to our support team for further help. Thank you!`,
      );
    }

    var request = this.usersRepository.create(createUserDto);
    return this.usersRepository.save(request);
  }

  findAll(): Promise<User[]> {
    var response = this.usersRepository.find({
      select: ["id", "email", "created_at", "updated_at"],
    });

    return response;
  }

  findOne(id: number): Promise<User> {
    return this.usersRepository.findOne({
      select: ["id", "email", "created_at", "updated_at"],
      where: {
        id: id,
      },
    });
  }

  findByEmail(email): Promise<User> {
    return this.usersRepository.findOne({
      where: {
        email: email,
      },
    });
  }

  async update(
    id: number,
    updateUserDto: UpdateUserDto,
  ): Promise<UpdateResult> {
    return this.usersRepository.update(id, updateUserDto);
  }

  async remove(id: number): Promise<void> {
    this.usersRepository.delete(id);
  }
}
