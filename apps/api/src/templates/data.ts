export type Template = {
    namespace: string;
    name: string;
    fancyName: string;
    description: string;
    image: string;
    replicas: number;
    volumes: {
        path: string;
        size: string;
        accessMode?: string[];
    }[];
    env: {
        [key: string]: string;
    };
    ports: {
        name: string;
        port: number;
        targetPort: number;
    }[];
};

export const templates: Template[] = [
    {
        namespace: 'default',
        name: 'postgresql',
        fancyName: 'PostgreSQL',
        description: 'PostgreSQL database',
        image: 'postgres',
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
    {
        namespace: 'default',
        name: 'redis',
        fancyName: 'Redis',
        description: 'Redis database',
        image: 'redis',
        replicas: 1,
        volumes: [],
        env: {},
        ports: [
            {
                name: 'redis',
                port: 6379,
                targetPort: 6379,
            },
        ],
    },
];