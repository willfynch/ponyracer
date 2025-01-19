import * as WebstompClient from 'webstomp-client';

describe('Live', () => {
  const race = {
    id: 12,
    name: 'Paris',
    ponies: [
      { id: 1, name: 'Gentle Pie', color: 'YELLOW' },
      { id: 2, name: 'Big Soda', color: 'ORANGE' },
      { id: 3, name: 'Gentle Bottle', color: 'PURPLE' },
      { id: 4, name: 'Superb Whiskey', color: 'GREEN' },
      { id: 5, name: 'Fast Rainbow', color: 'BLUE' }
    ],
    startInstant: '2020-02-18T08:02:00Z'
  };

  const user = {
    id: 1,
    login: 'cedric',
    money: 1000,
    registrationInstant: '2015-12-01T11:00:00Z',
    token: 'eyJhbGciOiJIUzI1NiJ9.eyJ1c2VySWQiOjF9.5cAW816GUAg3OWKWlsYyXI4w3fDrS5BpnmbyBjVM7lo'
  };

  function startBackend(): void {
    cy.intercept('GET', 'api/races?status=PENDING', [
      race,
      {
        id: 13,
        name: 'Tokyo',
        ponies: [
          { id: 6, name: 'Fast Rainbow', color: 'BLUE' },
          { id: 7, name: 'Gentle Castle', color: 'GREEN' },
          { id: 8, name: 'Awesome Rock', color: 'PURPLE' },
          { id: 9, name: 'Little Rainbow', color: 'YELLOW' },
          { id: 10, name: 'Great Soda', color: 'ORANGE' }
        ],
        startInstant: '2020-02-18T08:03:00Z'
      }
    ]).as('getRaces');

    cy.intercept('GET', 'api/races/12', race).as('getRace');

    cy.intercept('POST', 'api/races/12/bets', { ...race, betPonyId: 1 }).as('betRace');
  }

  function storeUserInLocalStorage(): void {
    localStorage.setItem('rememberMe', JSON.stringify(user));
  }

  interface LiveRaceModel {
    ponies: Array<{ id: number; name: string; color: string; position: number; boosted?: boolean }>;
    status: 'RUNNING' | 'FINISHED';
  }

  interface GlobalUtilsFunctions {
    getComponent: (element: Element | null) => unknown;
    applyChanges: (component: unknown) => void;
  }

  function buildFakeWS() {
    const fakeWS = {
      close: () => {
        return;
      },
      send: (message: string) => {
        const unmarshalled = WebstompClient.Frame.unmarshallSingle(message);
        if (unmarshalled.command === 'CONNECT') {
          fakeWS.onmessage!({ data: WebstompClient.Frame.marshall('CONNECTED') } as MessageEvent);
        } else if (unmarshalled.command === 'SUBSCRIBE' && unmarshalled.headers['destination'] === '/race/12') {
          fakeWS.id = unmarshalled.headers['id'];
        }
      },
      emulateRace: (liveRaceModel: LiveRaceModel) => {
        const headers = {
          destination: '/race/12',
          subscription: fakeWS.id
        };
        const data = WebstompClient.Frame.marshall('MESSAGE', headers, JSON.stringify(liveRaceModel));
        fakeWS.onmessage!({ data } as MessageEvent);
      }
    } as WebSocket & { id: string | undefined; emulateRace: (race: LiveRaceModel) => void };
    const wsOptions = {
      onBeforeLoad: (win: Window) => {
        cy.stub(win as Window & { WebSocket: WebSocket }, 'WebSocket')
          .as('ws')
          .returns(fakeWS);
      }
    };
    return { fakeWS, wsOptions };
  }

  beforeEach(() => {
    startBackend();
    localStorage.setItem('preferred-lang', 'en');
  });

  it('should display a live race', () => {
    storeUserInLocalStorage();

    const { fakeWS, wsOptions } = buildFakeWS();
    cy.visit('/races', wsOptions);
    cy.wait('@getRaces');

    // go to bet page for the first race
    cy.get('.btn-primary').first().click();
    cy.wait('@getRace');

    // bet on first pony
    cy.get('img').first().click();
    cy.wait('@betRace');

    // emulate a pending race
    cy.intercept('GET', 'api/races/12', {
      ...race,
      betPonyId: 2,
      status: 'PENDING'
    }).as('getPendingRace');

    // go to live
    cy.get('.btn-primary').first().click();
    cy.location('pathname').should('eq', '/races/12/live');
    cy.wait('@getPendingRace');
    cy.wait(1000);

    let angular: GlobalUtilsFunctions;
    cy.window().then((win: Window) => (angular = (win as unknown as { ng: GlobalUtilsFunctions }).ng));
    let document: Document;
    cy.document().then(doc => (document = doc));

    // WebSocket connection created
    cy.get('@ws')
      .should('be.called')
      .then(() => {
        fakeWS.emulateRace({
          ponies: [
            { id: 1, name: 'Gentle Pie', color: 'YELLOW', position: 30 },
            { id: 2, name: 'Big Soda', color: 'ORANGE', position: 80 },
            { id: 3, name: 'Gentle Bottle', color: 'PURPLE', position: 70 },
            { id: 4, name: 'Superb Whiskey', color: 'GREEN', position: 60 },
            { id: 5, name: 'Fast Rainbow', color: 'BLUE', position: 30 }
          ],
          status: 'RUNNING'
        });
        // the component can be inside ng-component if it has no selector
        const element = document.querySelector('pr-live') ?? document.querySelector('ng-component');
        const liveComponent = angular.getComponent(element);
        angular.applyChanges(liveComponent);
      });

    // race detail should be displayed
    cy.get('h1').should('contain', 'Paris');
    cy.get('img').should('have.length', 5);
  });
});
