document.addEventListener("DOMContentLoaded", function () {
    const uploadBtn = document.querySelector(".upload-btn");
    const imageInput = document.getElementById("imageUpload");
  
    uploadBtn.addEventListener("click", function () {
      imageInput.click();
    });
  
    imageInput.addEventListener("change", function () {
      const file = imageInput.files[0];
      if (file) {
        console.log("Selected file:", file.name);
        // Add preview or further logic here
      }
    });
  });
  