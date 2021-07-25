import Client from './Client';
import { URLSearchParams } from 'url';
import axios, { AxiosResponse } from 'axios';
import { Cat, CatMinInfo, CatsList, FailAddCat } from '../../@types/common';

export default class CoreApi extends Client {
  // endpoint core API
  static api: string = '/core/cats';
  // получение http клиента
  static coreApiHttpClient = Client.getInstance();

  /**
   * Get-Метод получения кота по id [get-by-id]{@link https://meowle.qa-fintech.ru/api/core/api-docs-ui/#/%D0%9F%D0%BE%D0%B8%D1%81%D0%BA/get_cats_get_by_id}
   * @param id - id
   */
  static async getCatById(id: number): Promise<AxiosResponse<{ cat: Cat }>> {
    let response: AxiosResponse;
    try {
      const params = new URLSearchParams({ id: id.toString() });
      response = await this.coreApiHttpClient.get(`${this.api}/get-by-id?${params}`);
    } catch (error) {
      //console.error(error);
      if (axios.isAxiosError(error)) {
        response = error.response;
      } else {
        console.error(error);
      }
    }
    return response;
  }

  /**
   * Get-Метод получения всех котов [all]{@link https://meowle.qa-fintech.ru/api/core/api-docs-ui/#/%D0%9F%D0%BE%D0%B8%D1%81%D0%BA/get_cats_all}
   */
  static async getAllCats(): Promise<AxiosResponse<{ groups: { title: string; cats: Cat[] }[] }>> {
    let response: AxiosResponse;
    try {
      response = await this.coreApiHttpClient.get(`${this.api}/all`);
    } catch (error) {
      console.error(error);
    }
    return response;
  }

  /**
   * Get-Метод поиска кота по части начала имени [search-pattern]{@link https://meowle.qa-fintech.ru/api/core/api-docs-ui/#/%D0%9F%D0%BE%D0%B8%D1%81%D0%BA/get_cats_search_pattern}
   * @param name - имя
   * @param limit=10 - число записей
   */
  static async searchCatByPartName(name: string, limit: number = 10): Promise<AxiosResponse<CatsList>> {
    let response: AxiosResponse;
    try {
      const params = new URLSearchParams({ name, limit: limit.toString() });
      response = await this.coreApiHttpClient.get(`${this.api}/search-pattern?${params}`);
    } catch (error) {
      if (axios.isAxiosError(error)) {
        response = error.response;
      } else {
        console.error(error);
      }
    }
    return response;
  }

  /**
   * Post-Метод добавления кота по минимальному описанию [add]{@link https://meowle.qa-fintech.ru/api/core/api-docs-ui/#/%D0%94%D0%BE%D0%B1%D0%B0%D0%B2%D0%BB%D0%B5%D0%BD%D0%B8%D0%B5/post_cats_add}
   * @param cats минимальное описание кота
   * @param cats.name - имя
   * @param cats.description - описание
   * @param cats.gender - пол
   */
  static async addCat(cats: CatMinInfo[]): Promise<AxiosResponse<CatsList | FailAddCat>> {
    let response: AxiosResponse;
    try {
      response = await this.coreApiHttpClient.post(`${this.api}/add`, {
        cats: cats,
      });
    } catch (error) {
      console.error(error);
    }
    return response;
  }

  /**
   * Delete-Метод удаления кота по id [delete]{@link https://meowle.qa-fintech.ru/api/core/api-docs-ui/#/%D0%A3%D0%B4%D0%B0%D0%BB%D0%B5%D0%BD%D0%B8%D0%B5/delete_cats__catId__remove}
   * @param id - id
   */
  static async removeCat(id: number): Promise<AxiosResponse<Cat>> {
    let response: AxiosResponse;
    try {
      response = await this.coreApiHttpClient.delete(`${this.api}/${id}/remove`);
    } catch (error) {
      if (axios.isAxiosError(error)) {
        response = error.response;
      } else {
        console.error(error);
      }
    }
    return response;
  }
}
