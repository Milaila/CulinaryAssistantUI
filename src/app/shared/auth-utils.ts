
export class AuthUtils {
  static get isAuthorized(): boolean {
    return !!this.getToken();
  }

  static getToken(): string {
    return localStorage.getItem('token');
  }

  static setToken(token: string): void {
    localStorage.setItem('token', token);
  }

  static clearToken(): void {
    localStorage.removeItem('token');
  }
}
