import { assert } from 'chai';
import CoreApi from '../src/http/CoreApi';
import { allure } from 'allure-mocha/runtime';
import Steps from '../src/steps/Steps';

const name = 'Халифарт';
const id = 2256880;

describe('Проверка имени кота', async () => {

  it('allure', async () => {
    //const name = 'Вики';
    //const id = 101368;

    const response = await CoreApi.getCatById(id);
    allure.logStep(`выполнен запрос GET /get-by-id c параметром ${id}`);
    allure.testAttachment(
      'testAttachment',
      JSON.stringify(response.data, null, 2),
      'application/json'
    );

    assert.equal(response.data.cat.name, name, 'Имена не соответствуют');
  });

  it('allure2', async () => {
    //const name = 'Вики';
    //const id = 101368;

    const response = await allure.step(
      `выполнен запрос GET /get-by-id c параметром ${id}`,
      async () => {
        console.info('тест 2 🚀:', 'выполняется запрос GET /get-by-id');
        const response = await CoreApi.getCatById(id);
        const data = JSON.stringify(response.data, null, 2);
        console.info('тест 2 🚀:', 'получен ответ на запрос GET /get-by-id:\n', data);
        allure.attachment('attachment', data, 'application/json');
        return response;
      }
    );
    console.info('тест 2 🚀:', 'получен ответ на запрос GET /get-by-id:\n', response.data);

    await allure.step(
      'выполнена проверка соответствия значения имен кота из запроса с ожидаемым',
      () => {
        allure.attachment('expected', response.data.cat.name, 'text/plain');
        allure.attachment('actual', name, 'text/plain');
        assert.equal(response.data.cat.name, name, 'Имена не соответствуют');
      }
    );
  });

  it('allure3', async () => {
    allure.link(
      'https://meowle.qa-fintech.ru/api/core/api-docs-ui/#/%D0%9F%D0%BE%D0%B8%D1%81%D0%BA/get_cats_get_by_id',
      'get_by_id'
    );
    allure.feature('Получение котика по id');
    allure.issue('JIRA-1245', 'https://jira.qa-fintech.ru/');
    allure.severity('BLOCKER');
    allure.writeEnvironmentInfo({ lib: 'axios', v: '0.21.1' });

    //const name = 'Вики';
    //const id = 101368;

    const response = await Steps.common.stepGetCatById(id);

    await allure.step(
      'выполнена проверка соответствия значения имен кота из запроса с ожидаемым',
      async () => await Steps.common.equal(response.data.cat.name, name)
    );
  });
});
