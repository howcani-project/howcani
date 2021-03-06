import { TestBed, inject } from '@angular/core/testing';
import { Injector } from '@angular/core';
import { ConfigurationService } from './configuration.service.js';
import { SearchQueryBuilderService } from './searchquerybuilder.service.js';

describe('Search Query service spec', () => {
  let searchQueryBuilder;
  let configuration;

  class ConfigurationServiceMock {
    constructor() {
      this.project = {
        user: 'howcani-project',
        repository: 'howcani-data'
      };
      this.user = {
        login: 'janbaer'
      };
    }
  }

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        SearchQueryBuilderService,
        { provide: ConfigurationService, useClass: ConfigurationServiceMock }
      ]
    });
  });

  beforeEach(inject([Injector], (injector) => {
    searchQueryBuilder = injector.get(SearchQueryBuilderService);
    configuration = injector.get(ConfigurationService);
  }));

  describe('When service was created', () => {
    it('Should not be null', () => {
      expect(searchQueryBuilder).toBeDefined();
    });
  });

  describe('#buildQueryString', () => {
    const repoQueryString = 'repo:howcani-project/howcani-data+type:issue';

    it('should return search query for user/repo issues', () => {
      expect(searchQueryBuilder.buildQueryString({})).toBe(repoQueryString);
    });

    describe('when query, labels and repo are set', () => {
      const searchQuery = {};

      beforeEach(() => {
        searchQuery.query = 'angular2 user:janbaer';
        searchQuery.labels = ['important', 'critical'];
      });

      it('should return search query with specified repo, labels and custom query', () => {
        expect(searchQueryBuilder.buildQueryString(searchQuery)).toBe('angular2+user:janbaer+label:important+label:critical+' + repoQueryString);
      });
    });

    describe('State', () => {
      const searchQuery = {};

      describe('When State is set', () => {
        beforeEach(() => {
          searchQuery.state = 'open';
        });

        it('Should contain the given state', () => {
          expect(searchQueryBuilder.buildQueryString(searchQuery)).toBe('state:open+' + repoQueryString);
        });
      });

      describe('When state is empty', () => {
        beforeEach(() => {
          searchQuery.state = '';
        });

        it('Should not contain the state', () => {
          expect(searchQueryBuilder.buildQueryString(searchQuery)).toBe(repoQueryString);
        });
      });
    });

    describe('Only my questions', () => {
      const searchQuery = {};

      describe('When user wants to see only his questions', () => {
        beforeEach(() => {
          searchQuery.onlyMyQuestions = true;
        });

        it('Should contain the author filter', () => {
          expect(searchQueryBuilder.buildQueryString(searchQuery)).toBe('author:janbaer+' + repoQueryString);
        });

        describe('When no user is logged in', () => {
          beforeEach(() => {
            configuration.user = undefined;
          });

          it('Should not contain the author filter', () => {
            expect(searchQueryBuilder.buildQueryString(searchQuery)).toBe(repoQueryString);
          });
        });
      });
    });

  });
});
