<?php
error_reporting(E_ALL);
ini_set('display_errors', 1);

if ($_SERVER["REQUEST_METHOD"] === "POST" && isset($_FILES["imagen"])) {
    $nombreArchivo = $_FILES["imagen"]["name"];
    $tipoArchivo = $_FILES["imagen"]["type"];
    $tamañoArchivo = $_FILES["imagen"]["size"];
    $rutaArchivoTemporal = $_FILES["imagen"]["tmp_name"];

    // Directorio donde deseas guardar las imágenes comprimidas
    $directorioDestino = "imgs/";

    // Comprobar si el archivo se movió correctamente
    if (move_uploaded_file($rutaArchivoTemporal, $directorioDestino . $nombreArchivo)) {
        // Generar el enlace a la imagen comprimida
        $enlaceImagen = $directorioDestino . $nombreArchivo;

        // Mostrar el enlace
        echo "El archivo $nombreArchivo se cargó correctamente. Puedes verlo <a href=\"$enlaceImagen\">aquí</a>.";
    } else {
        echo "Error al mover el archivo.";
    }
} else {
    echo "Error: No se ha recibido ningún archivo.";
}
