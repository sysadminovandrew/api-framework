import { assert } from 'chai';
import CoreApi from '../../src/http/CoreApi';
import { Cat } from '../../@types/common';

// Лучше бы вынести куда-нибудь, чтобы переиспользовать
const getRandomInt = (max: number) => Math.floor(Math.random() * max);

describe ('Функциональность удаления кота', async () => {
  let random_cat: Cat;
  before('Получение случайного кота', async () => {
    // Вынести поиск случайного кота в отдельный метод
    const search_response = await CoreApi.getAllCats();
    const groups_amount = search_response.data.groups.length;
    assert.notEqual(groups_amount, 0, 'В базе нет имён!');
    const random_group_id = getRandomInt(groups_amount);
    const random_group = search_response.data.groups[random_group_id];
    const cats_in_group = random_group.cats.length;
    assert.notEqual(cats_in_group, 0, 'Группа не содержит имён!');
    const random_cat_id = getRandomInt(cats_in_group);
    random_cat = random_group.cats[random_cat_id];
    // Для проверки, что не найдено группы на опр. букву
    // const rnd = await CoreApi.getCatById(2256879);
    // random_cat = rnd.data.cat;
    console.log(`Найден случайный кот: ${random_cat.name}, id=${random_cat.id}`);

    // Если ошибка в before, то тест дальше не выполняется
    // assert.equal(0,1, 'error!');
  });

  it('Удаление случайного кота', async  () => {
    const remove_response = await CoreApi.removeCat(random_cat.id);//random_cat.id
    // Желательно ввести структуру ответа с ошибкой (если код отличен от 200),
    // чтобы получать ответ из response.data.output.payload.message
    assert.notEqual(remove_response.status, 404, 'Кот не найден!');
    assert.notEqual(remove_response.status, 400, 'Неверный формат id!');
    assert.deepEqual(remove_response.data, random_cat,'Удаленный кот не совпал со случайно найденным!');
    console.log(`Удален кот с id=${random_cat.id}`);
  });

  after('Проверка, что кот удален', async () => {
    const get_cat_response = await CoreApi.getCatById(random_cat.id);
    assert.notEqual(get_cat_response.status, 400, 'Неверный формат id!');
    if (get_cat_response.status === 200) {
      assert.notDeepEqual(get_cat_response.data.cat, random_cat, 'Кот не был удален!');
      assert.fail('Кот найден по id!');
    }
    assert.equal(get_cat_response.status, 404);
    console.log('Удаленный кот не был найден по id. Успех!');
  });

  /*after('Проверка, что кот удален', async() =>{
    const search_response = await CoreApi.getAllCats();
    const random_cat_group = search_response.data.groups.find((group)=>{
      if (group.title === random_cat.name.charAt(0)){
        return true;
      }
      return false;
    });
    if (random_cat_group === undefined) {
      console.log(`Не найдено котов на букву "${random_cat.name.charAt(0)}". Успех!`);
    }
    else {
      const cat = random_cat_group.cats.find((cat) =>{
        if (cat.name === random_cat.name) {
          return true;
        }
        return false;
      });
      assert.equal(cat, undefined, 'Удаленный кот найден. Ошибка!');
      if (cat === undefined) {
        console.log('Удаленный кот не был найден. Успех!');
      }
    }
  });*/
});