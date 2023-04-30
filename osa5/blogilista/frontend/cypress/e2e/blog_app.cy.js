import login from "../../src/services/login";

const BACKEND_API_URI_PREFIX = "http://localhost:3001/api";
const FRONTEND_URI = "http://localhost:3000";

describe("Blog app", () => {
  let user;
  beforeEach(function () {
    cy.request("POST", `${BACKEND_API_URI_PREFIX}/testing/reset`);
    user = {
      name: "Test User",
      username: "testuser",
      password: "sekret",
    };
    cy.request("POST", `${BACKEND_API_URI_PREFIX}/users/`, user);
    cy.visit(FRONTEND_URI);
  });

  it("Login form is shown", function () {
    cy.get(".login-form").should("be.visible");
    cy.get("input#username").should("be.visible");
    cy.get("input#password").should("be.visible");
  });

  describe("Login", function () {
    it("succeeds with correct credentials", function () {
      cy.get("input#username").type(user.username);
      cy.get("input#password").type(user.password);
      cy.get("button#login-button").click();

      cy.contains(`${user.name} logged in`);
    });

    it("fails with wrong credentials", function () {
      cy.get("input#username").type(user.username);
      cy.get("input#password").type("wrong");
      cy.get("button#login-button").click();

      cy.get(".notification.error").contains("wrong username or password");
    });
  });
});
