import { Body, Controller, Get, Param, Post } from "@nestjs/common";
import { Application } from "@prisma/client";
import { LogLines } from "engine";

import { ApiResponse } from "src/dtos/api-response.dto";
import { ApplicationResponse, CreateApplication } from "src/dtos/application.dto";
import { ApplicationService } from "src/services/application.service";

@Controller('applications')
export class ApplicationController {

    constructor(private service: ApplicationService) { }

    @Get()
    async findAll(): Promise<ApiResponse<ApplicationResponse[]>> {
        try {
            return {
                statusCode: 200,
                data: await this.service.findAll()
            }
        } catch (error) {
            return {
                statusCode: 500,
                error: error
            }
        }

    }

    @Get(':id')
    async findById(@Param('id') id: string): Promise<ApiResponse<ApplicationResponse>> {
        try {
            return {
                statusCode: 200,
                data: await this.service.findById(id)
            }
        } catch (error) {
            return {
                statusCode: 500,
                error
            }
        }
    }

    @Get(':name/logs')
    async findLogs(@Param('name') name: string): Promise<ApiResponse<LogLines[]>> {
        try {
            return {
                statusCode: 200,
                data: await this.service.findLogs(name)
            }
        } catch (error) {
            return {
                statusCode: 500,
                error
            }
        }

    }

    @Post()
    async create(@Body() data: CreateApplication): Promise<ApiResponse<Application>> {
        try {
            return {
                statusCode: 200,
                data: await this.service.create(data)
            }
        } catch (error) {
            return {
                statusCode: 500,
                error
            }
        }
    }
}