export interface Service {
    id: string;
    name: string;
    description: string;
    isActive: boolean;
    icon?: string;
    comingSoon?: boolean;
}

export interface ServiceProvider {
    id: string;
    name: string;
    description: string;
    serviceId: string;
    rating?: number;
    pricing?: {
        basePrice: number;
        currency: string;
    };
}

export interface ServiceCategory {
    id: string;
    name: string;
    description: string;
    services: Service[];
}