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

  describe("When logged in", function () {
    beforeEach(function () {
      cy.get("input#username").type(user.username);
      cy.get("input#password").type(user.password);
      cy.get("button#login-button").click();
    });

    it("blog form is visible once 'create new blog' button is pressed", function () {
      cy.contains("button", "create new blog").click();

      cy.get("input#author").should("be.visible");
      cy.get("input#title").should("be.visible");
      cy.get("input#url").should("be.visible");
    });

    it("a blog can ge created", function () {
      const blog = {
        author: "Test author",
        title: "Test title",
        url: "http://domain.example/blog",
      };

      cy.contains("button", "create new blog").click();
      cy.get("input#author").type(blog.author);
      cy.get("input#title").type(blog.title);
      cy.get("input#url").type(blog.url);
      cy.contains("button", "save").click();

      cy.get(".notification").contains(
        `a new blog ${blog.title} by ${blog.author} added`
      );
      cy.get(".blog").contains(blog.author);
      cy.get(".blog").contains(blog.title);
    });
  });
});
