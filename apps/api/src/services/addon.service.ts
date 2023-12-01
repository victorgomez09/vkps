import { Addon } from "@prisma/client";
import { ApiResponse } from "../types";
import { prisma } from "../config/database.config";

export const listAddons = async (): Promise<ApiResponse<Addon[]>> => {
    const addons = await prisma.addon.findMany({
        include: {
            env: true,
            type: true,
            versions: true,
            volumes: true,
        },
    });

    return {
        statusCode: 200,
        data: addons,
    };
};

export const getAddon = async (name: string): Promise<ApiResponse<Addon>> => {
    const addon = await prisma.addon.findFirst({
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
    delete addon.addonTypeId;
    addon.env.forEach((env) => {
        delete env.id;
        delete env.addonId;
    });
    addon.volumes.forEach((volume) => {
        delete volume.id;
        delete volume.addonId;
    });
    addon.versions.forEach((version) => {
        delete version.id;
        delete version.addonId;
    });
    delete addon.type.id;

    return {
        statusCode: 200,
        data: addon,
    };
};
