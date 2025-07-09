
const formComment = document.querySelector("#comment-form");
if (formComment) {
  formComment.addEventListener("submit", async (e) => {
    e.preventDefault();

    const slug = formComment.dataset.slug;
    const fullName = e.target.elements.fullName.value;
    const email = e.target.elements.email.value;
    const content = e.target.elements.content.value;

    const data = { fullName, email, content };

    const res = await fetch(`/articles/${slug}/comments`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });

    const result = await res.json();

    if (result.status === "success") {
      // Xóa form
      e.target.elements.fullName.value = "";
      e.target.elements.email.value = "";
      e.target.elements.content.value = "";

      // Thêm bình luận mới vào danh sách
      const newComment = result.comment;
      const commentsList = document.querySelector("#comments-list");
      const newCommentHtml = `
        <div class="comment-item d-flex mb-4">
          <div class="flex-shrink-0">
            <img class="rounded-circle" src="https://via.placeholder.com/50" alt="${newComment.fullName}" style="width: 50px; height: 50px;">
          </div>
          <div class="flex-grow-1 ms-3">
            <h6 class="fw-bold mb-1">${newComment.fullName}</h6>
            <div class="text-muted small mb-2">
              <i class="fas fa-clock me-1"></i>
              ${new Date(newComment.createdAt).toLocaleString("vi-VN")}
            </div>
            <p>${newComment.content}</p>
          </div>
        </div>
      `;
      commentsList.insertAdjacentHTML("afterbegin", newCommentHtml);
      document.querySelector("#no-comments")?.remove();
    }
  });
}