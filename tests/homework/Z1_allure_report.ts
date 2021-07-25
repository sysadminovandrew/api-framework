import TestSteps from './TestSteps';

describe ('Проверка удаления кота', async () => {
  it('TC1. Проверка удаления кота по id', async () => {
    TestSteps.common.stepSetRemoveCatTestCaseParams();
    const  random_cat = await TestSteps.common.stepGetRandomCat();
    await TestSteps.common.stepRemoveRandomCat(random_cat);
    await TestSteps.common.stepCheckIfCatRemoved(random_cat);
  })
});