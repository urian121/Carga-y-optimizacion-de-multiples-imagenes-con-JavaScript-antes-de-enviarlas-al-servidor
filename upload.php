<?php
if ($_SERVER["REQUEST_METHOD"] === "POST") {
    $targetDir = "uploads/"; // Directorio donde deseas guardar las imágenes

    // Generar un nombre de archivo aleatorio
    $randomFileName = uniqid() . '_' . rand(1000, 9999);

    // Obtener la extensión del archivo original
    $imageFileType = strtolower(pathinfo($_FILES["compressedImage"]["name"], PATHINFO_EXTENSION));

    // Crear el nombre de archivo completo con la extensión
    $targetFile = $targetDir . $randomFileName . '.' . $imageFileType;

    $uploadOk = 1;

    // Permitir solo ciertos formatos de archivo
    if ($imageFileType != "jpg" && $imageFileType != "jpeg" && $imageFileType != "png") {
        echo "Lo siento, solo se permiten archivos JPG, JPEG y PNG.";
        $uploadOk = 0;
    }

    // Verificar si $uploadOk es 0 debido a un error
    if ($uploadOk == 0) {
        echo "Lo siento, tu archivo no se ha subido.";
    } else {
        // Si todo está bien, intenta subir el archivo
        if (move_uploaded_file($_FILES["compressedImage"]["tmp_name"], $targetFile)) {
            echo "El archivo ha sido subido con éxito como " . htmlspecialchars(basename($targetFile));
        } else {
            echo "Lo siento, hubo un error al subir tu archivo.";
        }
    }
}
