export interface IGenericResponse {
  status?: number;
  message: string;
}

export function GenericResponse(response: IGenericResponse) {
    return response;
}