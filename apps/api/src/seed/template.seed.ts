import { TemplateType } from "@prisma/client";

import { prisma } from "../config/database.config"

const databaseTemplates = [
    {
        namespace: 'default',
        name: 'mysql',
        fancyName: 'MySQL',
        description: 'MySQL database',
        image: 'mysql',
        versions: ['5.7.44', '5.7', '5', '8.0.35', '8.0', '8.2.0', '8.2', '8'],
        replicas: 1,
        volumes: [
            {
                path: '/var/lib/mysql',
                size: '1Gi',
                accessMode: ['ReadWriteOnce'],
            },
        ],
        env: {
            MYSQL_ROOT_PASSWORD: 'root',
            MYSQL_USER: 'mysql',
            MYSQL_PASSWORD: 'mysql',
            MYSQL_DATABASE: 'mysql_db'
        },
        ports: [
            {
                name: 'mysql',
                port: 3306,
                targetPort: 3306,
            },
        ],
    },
    {
        namespace: 'default',
        name: 'mongodb',
        fancyName: 'MongoDB',
        description: 'MongoDB database',
        image: 'mongodb',
        versions: ['4.4.25', '4.4', '4', '5.0.22', '5.0', '5', '6.0.11', '6.0', '6', '7.0.3', '7.0', '7'],
        replicas: 1,
        volumes: [
            {
                path: '/data/db',
                size: '1Gi',
                accessMode: ['ReadWriteOnce'],
            },
        ],
        env: {
            MONGO_INITDB_ROOT_USERNAME: 'mongod',
            MONGO_INITDB_ROOT_PASSWORD: 'mongod',
            MONGO_INITDB_DATABASE: 'mongod',
        },
        ports: [
            {
                name: 'mongod',
                port: 27017,
                targetPort: 27017,
            },
        ],
    },
    {
        namespace: 'default',
        name: 'postgresql',
        fancyName: 'PostgreSQL',
        description: 'PostgreSQL database',
        image: 'postgres',
        versions: ['12', '12.17', '13', '13.13', '14', '14.10', '15', '15.5', '16', '16.1'],
        replicas: 1,
        volumes: [
            {
                path: '/var/lib/postgresql/data',
                size: '1Gi',
                accessMode: ['ReadWriteOnce'],
            },
        ],
        env: {
            POSTGRES_PASSWORD: 'postgres',
            POSTGRES_USER: 'postgres',
            POSTGRES_DB: 'postgres',
        },
        ports: [
            {
                name: 'postgresql',
                port: 5432,
                targetPort: 5432,
            },
        ],
    },
];

const seedDatabaseTemplates = async () => {
    let databaseType: TemplateType = await prisma.templateType.findFirst({where: {type: 'DATABASE'}})
    if (!databaseType) {
        databaseType = await prisma.templateType.create({
            data: {
                type: 'DATABASE'
            }
        })
    }
    databaseTemplates.forEach(async template => {
        if (!await prisma.template.findFirst({where: {
            name: template.name
        }})) {
            const templateCreated = await prisma.template.create({
                data: {
                    name: template.name,
                    fancyName: template.fancyName,
                    description: template.description,
                    image: template.image,
                    type: {
                        connect: {id: databaseType.id}
                    }
                }
            })

            template.versions.forEach(async version => {
                await prisma.templateVersion.create({
                    data: {
                        version,
                        template: {
                            connect: {id: templateCreated.id}
                        }
                    }
                })
            });

            Object.entries(template.env).forEach(async ([key, value]) => {
                await prisma.templateEnv.create({
                    data: {
                        key,
                        value,
                        template: {
                            connect: {id: templateCreated.id}
                        }
                    }
                })
            })

            template.volumes.forEach(async volume => {
                await prisma.templateVolume.create({
                    data: {
                        path: volume.path,
                        template: {
                            connect: {id: templateCreated.id}
                        }
                    }
                })
            })
        }
    })
}

export const seedTemplatesData = async () => {
    console.log(new Date().toLocaleString(), 'Populating database templates');
    await seedDatabaseTemplates();
    console.log(new Date().toLocaleString(), 'Database templates populated');
}