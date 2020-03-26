/// <reference types="Cypress" />
import { waitForGQL } from "../utils/networking";

const patchWithChanges = "5e4ff3abe3c3317e352062e4";
const CODE_CHANGES_ROUTE = `patch/${patchWithChanges}/changes`;
const NO_CODE_CHANGES_ROUTE = "patch/5e6bb9e23066155a993e0f1a/changes";
describe("task logs view", function() {
  beforeEach(() => {
    cy.server();
    cy.login();
    cy.route("POST", "/graphql/query").as("gqlQuery");
  });

  it("HTML and Raw buttons should have href when there are code changes", () => {
    cy.visit(CODE_CHANGES_ROUTE);
    waitForGQL("@gqlQuery", "Patch");
    cy.get(".cy-html-diff-btn")
      .should("have.attr", "href")
      .and("include", `filediff/${patchWithChanges}`);
    cy.get(".cy-raw-diff-btn")
      .should("have.attr", "href")
      .and("include", `rawdiff/${patchWithChanges}`);
  });

  it("Should display at least one table when there are code changes", () => {
    cy.visit(CODE_CHANGES_ROUTE);
    waitForGQL("@gqlQuery", "Patch");
    cy.get(".cy-code-changes-table").should("exist");
  });

  it("Should display 'No code changes' when there are no code changes", () => {
    cy.visit(NO_CODE_CHANGES_ROUTE);
    waitForGQL("@gqlQuery", "Patch");
    cy.contains("No code changes");
  });

  it("File names in table should have href", () => {
    cy.visit(CODE_CHANGES_ROUTE);
    waitForGQL("@gqlQuery", "Patch");
    cy.get(".fileLink")
      .should("have.attr", "href")
      .and("include", `filediff/${patchWithChanges}`);
  });
});