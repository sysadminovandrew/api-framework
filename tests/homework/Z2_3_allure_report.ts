import TestSteps, { getRandomInt } from './TestSteps';
import { Cat } from '../../@types/common';
import { allure } from 'allure-mocha/runtime';

const MAX_LIKES_OR_DISLIKES = 20;

describe ('Проверка функциональности лайков/дизлайков', async () => {
  let random_cat : Cat;
  let N : number; //getRandomInt(MAX_LIKES_OR_DISLIKES);
  let initial_likes_or_dislikes_count : number;
  let current_likes_or_dislikes_count : number;

  beforeEach('Установка параметров тест-кейса', () =>{
    TestSteps.common.stepSetLikeOrDislikeTestCaseParams();
  });
  beforeEach('Задание случайного количества лайков/дизлайков', () => {
    allure.step('Задание случайного количества лайков/дизлайков', () => {
      N = 1 + getRandomInt(MAX_LIKES_OR_DISLIKES);
      allure.attachment('Количество лайков/дизлайков','N = ' + N, 'text/plain');
    });
  });
  beforeEach('Получение случайного кота', async () => {
    random_cat = await TestSteps.common.stepGetRandomCat();
  });

  it('TC2. Проверка возможности поставить лайки', async () => {
    console.log(`Сохраняем текущее количество лайков: ${random_cat.likes}`);
    initial_likes_or_dislikes_count = random_cat.likes;
    current_likes_or_dislikes_count = await TestSteps.common.stepLikeCat(random_cat.id, N);
    await TestSteps.common.equal(initial_likes_or_dislikes_count + N, current_likes_or_dislikes_count);
  });

  it('TC3. Проверка возможности поставить дизлайки', async () => {
    console.log(`Сохраняем текущее количество дизлайков: ${random_cat.dislikes}`);
    initial_likes_or_dislikes_count = random_cat.dislikes;
    current_likes_or_dislikes_count = await TestSteps.common.stepDislikeCat(random_cat.id, N);
    await TestSteps.common.equal(initial_likes_or_dislikes_count + N, current_likes_or_dislikes_count);
  });

});