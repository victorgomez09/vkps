import { Template } from "@prisma/client";
import { ApiResponse } from "../types";
import { prisma } from "../config/database.config";

export const listTemplates = async (): Promise<ApiResponse<Template[]>> => {
    const templates = await prisma.template.findMany({
        include: {
            env: true,
            type: true,
            versions: true,
            volumes: true
        }
    })

    return {
        statusCode: 200,
        data: templates
    }
};

export const getTemplate = async (name: string): Promise<ApiResponse<Template>> => {
    const template = await prisma.template.findFirst({
        where: {
            name
        },
        include: {
            env: true,
            type: true,
            versions: true,
            volumes: true
        },
    })
    delete template.templateTypeId
    template.env.forEach(env => { delete env.id; delete env.templateId})
    template.volumes.forEach(volume => { delete volume.id; delete volume.templateId})
    template.versions.forEach(version => { delete version.id; delete version.templateId})
    delete template.type.id

    return {
        statusCode: 200,
        data: template
    }
};