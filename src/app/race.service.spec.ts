import { TestBed } from '@angular/core/testing';
import { RaceService } from './race.service';
import { RaceModel } from './models/race.model';

describe('RaceService', () => {
  let raceService: RaceService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    raceService = TestBed.inject(RaceService);
    jasmine.clock().install();
  });

  afterEach(() => jasmine.clock().uninstall());

  it('should list races', () => {
    let fetchedRaces: Array<RaceModel> = [];
    raceService.list().subscribe((races: Array<RaceModel>) => (fetchedRaces = races));

    jasmine.clock().tick(200);

    expect(fetchedRaces.length).withContext('The service should return the races after a 500ms delay').toBe(0);

    jasmine.clock().tick(400);

    expect(fetchedRaces.length)
      .withContext('The service should return two races in an Observable for the `list()` method after 500ms')
      .toBe(2);
  });
});
