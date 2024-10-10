export interface Company {
    id: number;
    name: string;
}


export interface CompanyNameCheckRequest {
    UserName: string;
    CheckFor: string;
    CompanyName: string;
}

export interface CompanyNameCheckResponse {
    Message: string
}