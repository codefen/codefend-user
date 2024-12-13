import { getCustomBaseAPi, getToken } from '@utils/helper.ts';
import type { HttpRequestOptions, HttpServiceInterface } from './http.service.ts';
import { baseUrl } from '@utils/config.ts';

export type RequestIdType = string | 'uniqueRequest';

export abstract class HttpService implements HttpServiceInterface {
  /**
   * Map que almacena los AbortController para cada solicitud HTTP.
   * Esto permite cancelar las solicitudes en curso. Al desmontar un componente por ejemplo
   */
  protected abortControllers: Map<string, AbortController>;
  protected baseUrl: string;
  /**
   * Token de sesión para autenticación.
   */
  protected session: string;

  constructor() {
    this.abortControllers = new Map();
    //Obtengo el Token(Si es que esta logeado) y la url de la API
    this.session = getToken();
    const customAPi = getCustomBaseAPi();
    this.baseUrl = customAPi ? customAPi : baseUrl;
  }

  /**
   * Método abstracto para realizar una solicitud HTTP GET.
   * Debe ser implementado por las clases hijas.
   *
   * @param options - Opciones para la solicitud HTTP.
   * @returns Una promesa que resuelve con la respuesta de la solicitud.
   */
  public get<T>(options: HttpRequestOptions): Promise<T> {
    throw new Error('Method not implemented.');
  }

  /**
   * Método abstracto para realizar una solicitud HTTP POST.
   * Debe ser implementado por las clases hijas.
   *
   * @param options - Opciones para la solicitud HTTP.
   * @returns Una promesa que resuelve con la respuesta de la solicitud.
   */
  public post<T>(options: HttpRequestOptions): Promise<T> {
    throw new Error('Method not implemented.');
  }

  /**
   * Obtiene o crea un nuevo AbortController para una solicitud HTTP.
   *
   * @param requestId - Identificador único de la solicitud.
   * @returns El AbortController correspondiente a la solicitud.
   */
  protected getAbortController(requestId: string): AbortController {
    if (!this.abortControllers.has(requestId)) {
      const abortController = new AbortController();
      this.abortControllers.set(requestId, abortController);
    }
    return this.abortControllers.get(requestId)!;
  }

  public updateUrlInstance(): void {
    this.session = getToken();
    const customAPi = getCustomBaseAPi();
    this.baseUrl = customAPi ? customAPi : baseUrl;
  }

  /**
   * @param requestId - Identificador único de la solicitud a cancelar.
   */
  public cancelRequest(requestId: RequestIdType): void {
    if (this.abortControllers.has(requestId)) {
      const abortController = this.abortControllers.get(requestId);
      abortController?.abort();
      this.abortControllers.delete(requestId);
    }
  }

  /**
   * Cancela todas las solicitudes HTTP en curso.
   */
  public cancelAll() {
    this.abortControllers.forEach(abort => abort.abort());
    this.abortControllers.clear();
  }

  /**
   * @param path - Ruta a agregar a la URL base.
   * @returns La URL completa.
   */
  protected getURL(path: string) {
    return path ? `${this.baseUrl}${path}` : this.baseUrl;
  }
}
