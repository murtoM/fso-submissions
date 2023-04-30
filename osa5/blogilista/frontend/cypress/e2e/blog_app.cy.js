const BACKEND_API_URI_PREFIX = "http://localhost:3001/api";
const FRONTEND_URI = "http://localhost:3000";

const user = {
  name: "Test User",
  username: "testuser",
  password: "sekret",
};
const anotherUser = {
  username: "anotheruser",
  name: "Another User",
  password: "sekret",
};

const blog = {
  author: "Test author",
  title: "Test title",
  url: "http://domain.example/blog",
};
const anotherBlog = {
  author: "Another author",
  title: "Another test title",
  url: "http://domain.example/second-blog",
};

describe("Blog app", () => {
  beforeEach(function () {
    cy.request("POST", `${BACKEND_API_URI_PREFIX}/testing/reset`);
    cy.request("POST", `${BACKEND_API_URI_PREFIX}/users/`, user);
    cy.request("POST", `${BACKEND_API_URI_PREFIX}/users/`, anotherUser);
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

    describe("when there is a blog", function () {
      beforeEach(function () {
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
      });

      it("blog details are shown after clicking the 'view' button", function () {
        cy.get(".blog").contains("button", "view").should("be.visible");
        cy.get(".blog").contains("button", "hide").should("not.exist");

        cy.get(".blog-details").should("not.be.visible");

        cy.contains("button", "view").click();
        cy.contains("button", "hide").should("be.visible");
        cy.get(".blog-details").should("be.visible");
      });

      describe("when blog-details is visible", function () {
        beforeEach(function () {
          cy.contains("button", "view").click();
        });

        it("blog can be liked", function () {
          cy.get(".like-count").contains("0");
          cy.contains("button", "like").click();
          cy.get(".like-count").contains("1");
        });

        it("blog can be deleted", function () {
          cy.get(".blog").should("exist");
          cy.contains("button", "remove").click();
          cy.get(".blog").should("not.exist");
        });
      });

      describe("and another blog is added by another user", function () {
        beforeEach(function () {
          cy.contains("button", "logout").click();
          cy.get("input#username").type(anotherUser.username);
          cy.get("input#password").type(anotherUser.password);
          cy.get("button#login-button").click();

          cy.contains("button", "create new blog").click();
          cy.get("input#author").type(anotherBlog.author);
          cy.get("input#title").type(anotherBlog.title);
          cy.get("input#url").type(anotherBlog.url);
          cy.contains("button", "save").click();

          cy.contains("button", "logout").click();

          cy.get("input#username").type(user.username);
          cy.get("input#password").type(user.password);
          cy.get("button#login-button").click();
        });

        it("only the user which created the blog can see 'remove' button", function () {
          cy.get(".blog")
            .contains("Another author")
            .contains("button", "view")
            .click();
          cy.get(".blog")
            .eq(1)
            .contains("button", "remove")
            .should("not.exist");
        });

        it("blogs are correctly ordered by likes", function () {
          let firstBlog;
          let secondBlog;
          fetch(`${BACKEND_API_URI_PREFIX}/blogs`, {
            method: "GET",
          })
            .then((response) => response.json())
            .then((response) => {
              firstBlog = response.find((b) => b.title === blog.title);
              secondBlog = response.find((b) => b.title === anotherBlog.title);

              firstBlog.likes = 3;
              firstBlog.user = firstBlog.user.id;
              secondBlog.likes = 5;
              secondBlog.user = secondBlog.user.id;

              let id = firstBlog.id;
              delete firstBlog.id;

              fetch(`${BACKEND_API_URI_PREFIX}/blogs/${id}`, {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(firstBlog),
              });

              id = secondBlog.id;
              delete secondBlog.id;
              fetch(`${BACKEND_API_URI_PREFIX}/blogs/${id}`, {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(secondBlog),
              });

              cy.visit(`${FRONTEND_URI}`);

              cy.get(".blog").eq(0).should("contain", anotherBlog.title);
              cy.get(".blog").eq(1).should("contain", blog.title);
            });
        });
      });
    });
  });
});
