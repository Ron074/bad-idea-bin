// Index Page

if (document.getElementById("ideaForm")) {
  document
    .getElementById("ideaForm")
    .addEventListener("submit", function (event) {
      event.preventDefault();

      const title = document.getElementById("post-title").value.trim();
      const content = document.getElementById("post-content").value.trim();

      if (title && content) {
        const existingPosts =
          JSON.parse(localStorage.getItem("badIdeas")) || [];
        existingPosts.push({ title, content });
        localStorage.setItem("badIdeas", JSON.stringify(existingPosts));
        document.getElementById("post-title").value = "";
        document.getElementById("post-content").value = "";

        const blogTab = window.open("Blog.html", "BadIdeaBin");

        // Wait a bit, then send a message to refresh
        const message = { type: "refreshPosts" };

        const sendMessage = () => {
          if (blogTab) {
            blogTab.postMessage(message, "*");
          }
        };

        // Try to send message after 500ms
        setTimeout(sendMessage, 500);
      }
    });
}

// Blog page

if (window.location.pathname.includes("Blog.html")) {
  const ideasList = document.getElementById("ideasList");

  function loadPosts() {
    ideasList.innerHTML = "";
    const posts = JSON.parse(localStorage.getItem("badIdeas")) || [];

    posts.forEach((post, index) => {
      const newPostDiv = document.createElement("div");
      newPostDiv.className = "blog-post";

      const newPostTitle = document.createElement("h2");
      newPostTitle.innerText = post.title;

      const newPostContent = document.createElement("p");
      newPostContent.innerText = post.content;

      const deleteBtn = document.createElement("button");
      deleteBtn.innerText = "Delete";
      deleteBtn.className = "delete-btn";
      deleteBtn.addEventListener("click", () => {
        posts.splice(index, 1);
        localStorage.setItem("badIdeas", JSON.stringify(posts));
        loadPosts();
        // For my special message!
        const messageDiv = document.getElementById("deleteMessage");
        messageDiv.classList.remove("hide");
        messageDiv.classList.add("show");

        setTimeout(() => {
          messageDiv.classList.remove("show");
          messageDiv.classList.add("hide");
        }, 3000);
      });

      newPostDiv.append(newPostTitle, newPostContent, deleteBtn);
      ideasList.prepend(newPostDiv);
    });
  }

  loadPosts();

  // Listen for message from index page
  window.addEventListener("message", (event) => {
    if (event.data.type === "refreshPosts") {
      loadPosts();
    }
  });
}
