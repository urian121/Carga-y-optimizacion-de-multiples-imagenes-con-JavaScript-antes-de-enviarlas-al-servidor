const imgInput = document.getElementById("img-input");
const imagePreviews = document.getElementById("image-previews");
const uploadedImages = new Set();

imgInput.addEventListener("change", () => {
  const files = imgInput.files;

  if (!files || files.length === 0) {
    console.log("No se ha seleccionado un archivo.");
    return;
  }

  for (const file of files) {
    if (!isValidImageType(file)) {
      console.log(
        "Tipo de archivo no válido. Solo se permiten imágenes JPG, JPEG y PNG."
      );
      continue;
    }

    const blobURL = URL.createObjectURL(file);
    const previewContainer = document.createElement("div");
    previewContainer.className = "image-preview-container";
    const imgPreview = document.createElement("img");
    imgPreview.style.width = "300px";
    imgPreview.style.height = "auto";
    imgPreview.style.maxWidth = "100%";
    imgPreview.src = blobURL;

    const deleteButton = document.createElement("i");
    deleteButton.className = "bi bi-x delete-icon";
    deleteButton.addEventListener("click", () => {
      URL.revokeObjectURL(blobURL);
      previewContainer.remove();
      uploadedImages.delete(file); // Eliminar la imagen del conjunto cuando se elimina de la vista previa
      updateImageCounter(); // Actualizar el contador de imágenes

      if (uploadedImages.size === 0) {
        // Limpiar el input de tipo archivo
        imgInput.value = ""; // Establecer el valor del input a una cadena vacía
      }
    });

    previewContainer.appendChild(imgPreview);
    previewContainer.appendChild(deleteButton);
    imagePreviews.appendChild(previewContainer);

    uploadedImages.add(file); // Agregar la imagen al conjunto cuando se muestra en la vista previa
    updateImageCounter(); // Actualizar el contador de imágenes
  }
});

function isValidImageType(file) {
  const acceptedImageTypes = ["image/jpeg", "image/jpg", "image/png"];
  return acceptedImageTypes.includes(file.type.toLowerCase());
}

function updateImageCounter() {
  // Actualizar el contador de imágenes según la cantidad en uploadedImages
  console.log(uploadedImages.size);
}

document.getElementById("btnEnviar").addEventListener("click", () => {
  const MAX_WIDTH = 800;
  const MAX_HEIGHT = "auto";
  /*
    const MAX_WIDTH = "1200";
    const MAX_HEIGHT = "800";

    const MAX_WIDTH = "auto";
    const MAX_HEIGHT = "auto";
  */
  const MIME_TYPE = "image/jpeg";
  const QUALITY = 0.7;

  // Obtener las imágenes en el conjunto uploadedImages y enviarlas al servidor
  const imagesToSend = Array.from(uploadedImages);

  // Verificar que se hayan seleccionado archivos
  if (imagesToSend.length === 0) {
    console.log("No se ha seleccionado un archivo.");
    return; // Salir del evento si no hay archivos seleccionados
  }

  for (const file of imagesToSend) {
    const blobURL = URL.createObjectURL(file);
    const img = new Image();
    img.src = blobURL;
    img.onerror = function () {
      URL.revokeObjectURL(this.src);
      console.log("No se puede cargar la imagen");
    };
    img.onload = function () {
      URL.revokeObjectURL(this.src);
      const [newWidth, newHeight] = calculateSize(img, MAX_WIDTH, MAX_HEIGHT);
      const canvas = document.createElement("canvas");
      canvas.width = newWidth;
      canvas.height = newHeight;
      const ctx = canvas.getContext("2d");
      ctx.drawImage(img, 0, 0, newWidth, newHeight);
      canvas.toBlob(
        (blob) => {
          // Manejar la imagen comprimida aquí. Puedes enviarla al servidor si es necesario.
          displayInfo("Peso original de la Imagen", file);
          displayInfo("Nuevo peso de la Imagen", blob);

          // Enviar la imagen comprimida al servidor
          const formData = new FormData();
          formData.append("compressedImage", blob, "compressed_image.jpg");

          fetch("upload.php", {
            method: "POST",
            body: formData,
          })
            .then((response) => response.text())
            .then((data) => {
              console.log(data); // Puedes mostrar la respuesta del servidor en la consola.
            })
            .catch((error) => {
              console.error("Error al enviar la imagen al servidor:", error);
            });
        },
        MIME_TYPE,
        QUALITY
      );
      document.getElementById("root").append(canvas);
    };
  }
});

function calculateSize(img, maxWidth, maxHeight) {
  let width = img.width;
  let height = img.height;

  // Calcular el ancho y alto, manteniendo las proporciones
  if (width > height) {
    if (width > maxWidth) {
      height = Math.round((height * maxWidth) / width);
      width = maxWidth;
    }
  } else {
    if (height > maxHeight) {
      width = Math.round((width * maxHeight) / height);
      height = maxHeight;
    }
  }
  return [width, height];
}

// Funciones de utilidad para la demostración
function displayInfo(label, file) {
  const p = document.createElement("p");
  p.innerText = `${label} - ${readableBytes(file.size)}`;
  document.getElementById("root").append(p);
}
function readableBytes(bytes) {
  const i = Math.floor(Math.log(bytes) / Math.log(1024)),
    sizes = ["B", "KB", "MB", "GB", "TB", "PB", "EB", "ZB", "YB"];

  return (bytes / Math.pow(1024, i)).toFixed(2) + " " + sizes[i];
}
