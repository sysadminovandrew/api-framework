import { allure } from 'allure-mocha/runtime';
import { assert } from 'chai';
//import { AxiosResponse } from 'axios';
import CoreApi from '../../src/http/CoreApi';
import LikeApi from '../../src/http/LikeApi';
import { Cat } from '../../@types/common';


export const getRandomInt = (max: number) => Math.floor(Math.random() * max);

export default class TestSteps {
  public static common = {
    stepSetRemoveCatTestCaseParams: TestSteps.setRemoveCatTestCaseParams,
    stepGetRandomCat: TestSteps.getRandomCat,
    stepRemoveRandomCat: TestSteps.removeRandomCat,
    stepCheckIfCatRemoved: TestSteps.checkIfCatRemoved,
    stepSetLikeOrDislikeTestCaseParams : TestSteps.setLikeOrDislikeTestCaseParams,
    stepLikeCat: TestSteps.likeCat,
    stepDislikeCat: TestSteps.dislikeCat,
    equal : TestSteps.equal,
  };

  /**
   * Установка аттрибутов тест-кейса "Удаление кота по id"
   */
  private static setRemoveCatTestCaseParams() {
    allure.link(
      'https://meowle.qa-fintech.ru/api/core/api-docs-ui/#/%D0%A3%D0%B4%D0%B0%D0%BB%D0%B5%D0%BD%D0%B8%D0%B5/delete_cats__catId__remove',
      '/api/core/remove'
    );
    allure.feature('Удалить кота по id');
    allure.severity('BLOCKER');
    allure.writeEnvironmentInfo({ lib: 'axios', v: '0.21.1' });
  }

  /**
   * Получение случайного кота из response от getAllCats (/cats/all)
   * @return {Cat} random_cat - найденный случайный кот
   */
  private static async getRandomCat(): Promise<Cat>/*Promise<AxiosResponse<{ cat: Cat }>>*/ {
    return await allure.step('Поиск случайного кота', async () => {
      console.log('Выполняем запрос GET /all');
      const search_response = await CoreApi.getAllCats();
      console.log('Получен ответ на запрос GET /all');

      const groups_amount = search_response.data.groups.length;
      assert.notEqual(groups_amount, 0, 'В базе нет имён!');

      console.log('Выбор случайной группы');
      const random_group_id = getRandomInt(groups_amount);
      const random_group = search_response.data.groups[random_group_id];
      const cats_in_group = random_group.cats.length;
      assert.notEqual(cats_in_group, 0, 'Группа не содержит имён!');

      console.log('Выбор случайного кота в группе');
      const random_cat_id = getRandomInt(cats_in_group);
      const random_cat = random_group.cats[random_cat_id];

      allure.attachment('Cat', JSON.stringify(random_cat, null, 2), 'application/json');
      console.log(`Найден случайный кот: ${random_cat.name}, id=${random_cat.id}`);
      return random_cat;
    });
  }

  /**
   * Удаление случайного кота
   * @param {Cat} random_cat - случайный кот, которого удаляем
   */
  private static async removeRandomCat(random_cat : Cat) {
    await allure.step('Удаление кота', async () => {
      console.log(`Выполняем запрос REMOVE /${random_cat.id}/remove`);
      const remove_response = await CoreApi.removeCat(random_cat.id);
      console.log(`Получен ответ на запрос REMOVE /${random_cat.id}/remove`);

      // Желательно ввести структуру ответа с ошибкой (если код отличен от 200),
      // чтобы получать ответ из response.data.output.payload.message
      console.log('Проверяем коды ответа');
      assert.notEqual(remove_response.status, 404, 'Кот не найден!');
      assert.notEqual(remove_response.status, 400, 'Неверный формат id!');

      console.log('Проверяем, что удаленный кот совпадает со случайно найденным');
      allure.attachment('expectedCat', JSON.stringify(random_cat, null, 2), 'application/json');
      allure.attachment('actualCat', JSON.stringify(remove_response.data, null, 2), 'application/json');
      assert.deepEqual(remove_response.data, random_cat,'Удаленный кот не совпал со случайно найденным!');
    });
  }

  /**
   * Проверка, что указанный кот был удален
   * @param {Cat} random_cat - кот, которого удалили
   */
  private static async checkIfCatRemoved(random_cat : Cat) {
    await allure.step('Проверка, что кот удален', async () => {
      console.log(`Выполняем запрос GET /get-by-id?id=${random_cat.id}`);
      const get_cat_response = await CoreApi.getCatById(random_cat.id);
      console.log(`Получен ответ на запрос GET /get-by-id`);

      console.log('Проверяем коды ответа');
      allure.attachment('expectedCode', '404', 'text/plain');
      allure.attachment('actualCode', get_cat_response.status.toString(), 'text/plain');

      assert.notEqual(get_cat_response.status, 400, 'Неверный формат id!');
      if (get_cat_response.status === 200) {
        assert.notDeepEqual(get_cat_response.data.cat, random_cat, 'Кот не был удален!');
        assert.fail('Кот найден по id!');
      }

      assert.equal(get_cat_response.status, 404);
      console.log('Удаленный кот не был найден по id. Успех!\n');
    })
  }

  /**
   * Установка аттрибутов тест-кейсов ТС1 и ТС2 "Поставить N лайков/дизлайков коту"
   */
  private static setLikeOrDislikeTestCaseParams() {
    allure.link(
      'https://meowle.qa-fintech.ru/api/likes/api-docs-ui/#/%D0%9B%D0%B0%D0%B9%D0%BA%2F%D0%94%D0%B8%D0%B7%D0%BB%D0%B0%D0%B9%D0%BA/post_cats__catId__likes',
      '/api/likes/cats/{:catId}/likes',
    );
    allure.feature('Поставить/убрать лайк/дизлайк коту');
    allure.severity('BLOCKER');
    allure.writeEnvironmentInfo({ lib: 'axios', v: '0.21.1' });
  }

  /**
   * Поставить N лайков коту
   * @param {number} random_cat_id - id кота
   * @param {number} likes - количество лайков, которое надо поставить коту
   * @return {number} - текущее количество лайков кота
   */
  private static async likeCat (random_cat_id : number, likes : number) : Promise<number> {
    return await allure.step('Поставить коту N лайков', async () => {
      console.log(`Выставляем коту (id=${random_cat_id}) ${likes} лайков`);
      for (let i = 0; i < likes; ++i) {
        await LikeApi.likes(random_cat_id, { like:true });
      }

      console.log(`Выполняем запрос GET /get-by-id?id=${random_cat_id} для получения количества лайков`);
      const get_cat_response = await CoreApi.getCatById(random_cat_id);
      console.log('Получен ответ на запрос GET /get-by-id');
      allure.attachment('Cat', JSON.stringify(get_cat_response.data.cat, null, 2), 'application/json');
      console.log(`Сохраняем текущее количество лайков: ${get_cat_response.data.cat.likes}`);
      return get_cat_response.data.cat.likes;
    });
  }

  /**
   * Поставить N дизлайков коту
   * @param {number} random_cat_id - id кота
   * @param {number} dislikes - количество дизлайков, которое надо поставить коту
   * @return {number} - текущее количество дизлайков кота
   */
  private static async dislikeCat (random_cat_id : number, dislikes : number) : Promise<number> {
    return await allure.step('Поставить коту N дизлайков', async () => {
      console.log(`Создаем массив array_ids[${dislikes}], заполняем его значениями ${random_cat_id}`)
      const array_ids = Array(dislikes).fill(random_cat_id);

      console.log(`Параллельно выставляем котам из array_ids ${dislikes} дизлайков`);
      await Promise.all(array_ids.map((id) => LikeApi.likes(id, {dislike : true})));

      console.log(`Выполняем запрос GET /get-by-id?id=${random_cat_id} для получения количества дизлайков`);
      const get_cat_response = await CoreApi.getCatById(random_cat_id);
      console.log('Получен ответ на запрос GET /get-by-id');
      allure.attachment('Cat', JSON.stringify(get_cat_response.data.cat, null, 2), 'application/json');
      console.log(`Сохраняем текущее количество дизлайков: ${get_cat_response.data.cat.dislikes}`);
      return get_cat_response.data.cat.dislikes;
    });
  }

  /**
   * Проверка равенства двух значений
   * @param {any} exp - первое сравниваемое значение
   * @param {any} act - второе сравниваемое значение
   */
  private static async equal(exp: any, act: any) {
    await allure.step('Проверка соответствия значений', async () => {
      console.log('Проверяем совпадение текущего значения с ожидаемым');
      allure.attachment('expected', exp.toString(), 'text/plain');
      allure.attachment('actual', act.toString(), 'text/plain');
      assert.equal(exp, act, 'Значения не соответствуют');
      console.log('Значения совпадают!\n');
    });
  }
}