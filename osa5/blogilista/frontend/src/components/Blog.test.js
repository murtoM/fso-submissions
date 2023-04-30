import React from "react";
import "@testing-library/jest-dom/extend-expect";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";

import Blog from "./Blog";

describe("<Blog />", () => {
  let container;
  let likeMockHandler;
  beforeEach(() => {
    const userObject = { username: "user" };
    const blog = {
      author: "Test author",
      title: "Test title",
      url: "test_url",
      likes: 0,
      user: userObject,
    };

    const emptyHandler = () => {};
    likeMockHandler = jest.fn();

    container = render(
      <Blog
        blog={blog}
        likeBlog={likeMockHandler}
        deleteBlog={emptyHandler}
        loggedInUser={userObject}
      />
    ).container;
  });

  test("renders title and author, but not url or likes by default", () => {
    const div = container.querySelector(".blog");
    expect(div).toHaveTextContent("Test title");
    expect(div).toHaveTextContent("Test author");

    const detailsDiv = container.querySelector(".blog-details");
    expect(detailsDiv).toHaveStyle("display: none");
  });

  test("clicking the `view` button shows the blog details", async () => {
    const user = userEvent.setup();
    const button = screen.getByText("view");
    await user.click(button);

    const div = container.querySelector(".blog-details");
    expect(div).not.toHaveStyle("display: none");
  });

  test("clicking the `like` button twice calls its onClick twice", async () => {
    const user = userEvent.setup();
    const viewButton = screen.getByText("view");
    await user.click(viewButton);

    const likeButton = screen.getByText("like");
    await user.dblClick(likeButton);

    expect(likeMockHandler.mock.calls).toHaveLength(2);
  });
});
