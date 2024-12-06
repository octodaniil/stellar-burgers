import * as orderFixture from '../fixtures/order.json';

describe('E2E тест конструктора', () => {
  const orderButton = '[data-order-button]';
  const bunSelector = '[data-ingredient="bun"]:first-of-type';
  const mainIngredientSelector = '[data-ingredient="main"]:first-of-type';
  const modalsSelector = '#modals';

  beforeEach(() => {
    cy.intercept('GET', 'api/ingredients', { fixture: 'ingredients' });
    cy.visit('/');
  });

  it('Доступ списка ингридиентов', () => {
    cy.get(bunSelector).should('have.length.at.least', 1);
    cy.get('[data-ingredient="main"], [data-ingredient="sauce"]').should('have.length.at.least', 1);
  });

  describe('Проверка модалок + описания', () => {
    beforeEach(() => {
      cy.get(bunSelector).click();
    });

    describe('Проверка открытия модалки', () => {
      it('Открытие модалки по нажатию карточки', () => {
        cy.get(modalsSelector).children().should('have.length', 2);
      });

      it('Проверка модалки после перезагрузки страницы', () => {
        cy.reload(true);
        cy.get(modalsSelector).children().should('have.length', 2);
      });
    });

    describe('Проверка закрытия модалок', () => {
      const closeModalByClickingOverlay = () => {
        cy.get(`${modalsSelector}>div:nth-of-type(2)`).click({ force: true });
      };

      const closeModalByEscape = () => {
        cy.get('body').type('{esc}');
      };

      it('Проверка закрытия модалок по нажатию на крест', () => {
        cy.get(`${modalsSelector} button:first-of-type`).click();
        cy.get(modalsSelector).children().should('have.length', 0);
      });

      it('Проверка закрытия модалок по нажатию на оверлей', () => {
        closeModalByClickingOverlay();
        cy.get(modalsSelector).children().should('have.length', 0);
      });

      it('Проверка закрытия модалок по нажатию на эскейп', () => {
        closeModalByEscape();
        cy.get(modalsSelector).children().should('have.length', 0);
      });
    });
  });

  describe('Оформление заказа', () => {
    beforeEach(() => {
      cy.setCookie('accessToken', 'EXAMPLE_ACCESS_TOKEN');
      localStorage.setItem('refreshToken', 'EXAMPLE_REFRESH_TOKEN');

      cy.intercept('GET', 'api/auth/user', { fixture: 'user' });
      cy.intercept('POST', 'api/orders', { fixture: 'order' });
      cy.intercept('GET', 'api/ingredients', { fixture: 'ingredients' });

      cy.visit('/');
    });

    it('Оформление после авторизации', () => {
      cy.get(orderButton).should('be.disabled');
      cy.get(`${bunSelector} button`).click();
      cy.get(orderButton).should('be.disabled');

      cy.get(`${mainIngredientSelector} button`).click();
      cy.get(orderButton).should('be.enabled');

      cy.get(orderButton).click();
      cy.get(modalsSelector).children().should('have.length', 2);
      cy.get(`${modalsSelector} h2:first-of-type`).should(
        'have.text',
        orderFixture.order.number
      );
      cy.get(orderButton).should('be.disabled');
    });

    afterEach(() => {
      cy.clearCookie('accessToken');
      localStorage.removeItem('refreshToken');
    });
  });
});
