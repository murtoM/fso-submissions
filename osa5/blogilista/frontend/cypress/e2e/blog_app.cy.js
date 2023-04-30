describe("Blog app", () => {
  beforeEach(function () {
    cy.visit("http://localhost:3000");
  });

  it("Login form is shown", () => {
    cy.contains("Login");
  });
});
