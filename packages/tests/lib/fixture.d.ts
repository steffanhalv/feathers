export declare class Service {
    events: string[];
    find(): Promise<{
        id: number;
        description: string;
    }[]>;
    get(name: string, params: any): Promise<{
        id: string;
        description: string;
    }>;
    create(data: any): Promise<any>;
    update(id: any, data: any): Promise<any>;
    patch(id: any, data: any): Promise<any>;
    remove(id: any): Promise<{
        id: any;
    }>;
    customMethod(data: any, params: any): Promise<{
        data: any;
        method: string;
        provider: any;
    }>;
    internalMethod(): Promise<void>;
}
export declare const verify: {
    find(data: any): void;
    get(id: any, data: any): void;
    create(original: any, current: any): void;
    update(id: any, original: any, current: any): void;
    patch(id: any, original: any, current: any): void;
    remove(id: any, data: any): void;
};
