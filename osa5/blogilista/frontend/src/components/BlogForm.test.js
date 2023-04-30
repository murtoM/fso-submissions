import React from "react";
import "@testing-library/jest-dom/extend-expect";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";

import BlogForm from "./BlogForm";

test("<BlogForm /> calls createBlog with a correct blog object", async () => {
  const user = userEvent.setup();
  const createBlog = jest.fn();
  const blog = {
    author: "A test author",
    title: "A test title",
    url: "http://domain.example",
  };

  const container = render(<BlogForm createBlog={createBlog} />).container;

  const authorInput = container.querySelector("#author");
  const titleInput = container.querySelector("#title");
  const urlInput = container.querySelector("#url");
  const sendButton = screen.getByText("save");

  await user.type(authorInput, blog.author);
  await user.type(titleInput, blog.title);
  await user.type(urlInput, blog.url);
  await user.click(sendButton);

  expect(createBlog.mock.calls).toHaveLength(1);
  expect(createBlog.mock.calls[0][0]).toEqual(blog);
});
