import {
  Controller,
  Get,
  Res,
  Param,
  HttpException,
  HttpStatus,
} from "@nestjs/common";
import { Response } from "express";
import * as path from "path";
import * as fs from "fs";

@Controller("files")
export class FilesController {
  @Get(":filename")
  async downloadFile(
    @Param("filename") filename: string,
    @Res() res: Response,
  ) {
    const filePath = path.join("public", "invoices", filename);

    if (!fs.existsSync(filePath)) {
      throw new HttpException("File not found", HttpStatus.NOT_FOUND);
    }

    res.download(filePath, (err) => {
      if (err) {
        throw new HttpException(
          "Error downloading file",
          HttpStatus.INTERNAL_SERVER_ERROR,
        );
      }
    });
  }
}
