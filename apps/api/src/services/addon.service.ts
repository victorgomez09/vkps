import { Template } from "@prisma/client";
import { ApiResponse } from "../types";
import { prisma } from "../config/database.config";

export const listAddons = async (): Promise<ApiResponse<Template[]>> => {
    const addon = await prisma.template.findMany({
        include: {
            env: true,
            type: true,
            versions: true,
            volumes: true,
        },
    });

    return {
        statusCode: 200,
        data: addon,
    };
};

export const getAddon = async (name: string): Promise<ApiResponse<Template>> => {
    const addon = await prisma.template.findFirst({
        where: {
            name,
        },
        include: {
            env: true,
            type: true,
            versions: true,
            volumes: true,
        },
    });
    delete addon.templateTypeId;
    addon.env.forEach((env) => {
        delete env.id;
        delete env.templateId;
    });
    addon.volumes.forEach((volume) => {
        delete volume.id;
        delete volume.templateId;
    });
    addon.versions.forEach((version) => {
        delete version.id;
        delete version.templateId;
    });
    delete addon.type.id;

    return {
        statusCode: 200,
        data: addon,
    };
};
