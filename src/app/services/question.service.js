import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { ConfigurationService } from './configuration.service';
import { GithubService } from './github.service';
import { SearchQueryBuilderService } from './searchquerybuilder.service';

@Injectable()
export class QuestionService {
  constructor(configuration: ConfigurationService, githubService: GithubService, searchQueryBuilderService: SearchQueryBuilderService) {
    this.configuration = configuration;
    this.github = githubService;
    this.searchQueryBuilder = searchQueryBuilderService;

    this.questions = new BehaviorSubject([]);
    this.totalCountOfQuestions = 0;
    this.page = 0;
    this.lastSearchQuery = undefined;
  }

  fetchQuestions(searchQuery, page) {
    this.lastSearchQuery = searchQuery;
    this.page = page || 1;

    const searchString = this.searchQueryBuilder.buildQueryString(searchQuery);
    const questionsResponse = this.github.searchIssues(searchString, this.page);

    questionsResponse.subscribe((response) => {
      this.totalCountOfQuestions = response.total_count;
      const items = this.page === 1 ? response.items : this.questions.value.concat(response.items);
      this.questions.next(items);
    });

    return questionsResponse;
  }

  hasMoreQuestions() {
    if (this.totalCountOfQuestions > 0 && this.questions.value) {
      return this.totalCountOfQuestions > this.questions.value.length;
    }
    return false;
  }

  fetchMoreQuestions() {
    if (this.hasMoreQuestions()) {
      return this.fetchQuestions(this.lastSearchQuery, this.page + 1);
    }
    return undefined;
  }

  postQuestion(question) {
    return this.github.postIssue(question)
      .then((newQuestion) => {
        const items = [newQuestion].concat(this.questions.value);
        this.questions.next(items);
      });
  }

}
