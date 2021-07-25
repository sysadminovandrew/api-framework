import Client from './Client';
import { AxiosResponse } from 'axios';
import { Cat } from '../../@types/common';

export default class LikeApi extends Client {
  // endpoint likes API
  static api: string = '/likes/cats';
  // получение http клиента
  static coreApiHttpClient = Client.getInstance();

  /**
   * Поставить/убрать лайк/дизлайк коту по ID [likes]{@link https://meowle.qa-fintech.ru/api/likes/api-docs-ui/#/%D0%9B%D0%B0%D0%B9%D0%BA%2F%D0%94%D0%B8%D0%B7%D0%BB%D0%B0%D0%B9%D0%BA/post_cats__catId__likes}
   */
  static async likes(id: number, voice: { like?: boolean; dislike?: boolean }): Promise<AxiosResponse<Cat>> {
    let response: AxiosResponse;
    try {
      response = await this.coreApiHttpClient.post(`${this.api}/${id}/likes`, voice);
    } catch (error) {
      console.error(error);
    }
    return response;
  }
}
