document.addEventListener('DOMContentLoaded', function() {
    const secciones = [
        {
            titulo: "Presentaciones",
            enlaces: [
                { nombre: "Presentaciones", url: "presentaciones/presentaciones.html" },
            ]
        },
        {
            titulo: "Tests Preguntas y Respuestas",
            enlaces: [
                { nombre: "preguntasTest", url: "https://spb49-ua.github.io/preguntasTest/" },
            ]
        },
        {
            titulo: "LPP",
            enlaces: [
                { nombre: "prácticas", url: "https://domingogallardo.github.io/apuntes-lpp/practicas/buenas-practicas-programacion-funcional.html"}
            ]
        },
        {
            titulo: "ADA",
            enlaces: [
                { nombre: "ada.pdf", url: "https://dlsi.ua.es/~oncina/ada.pdf" },
                { nombre: "vídeos", url: "https://www.youtube.com/playlist?list=PL7z1puPkmoOcq8oFRIEDXIo88LAC0vL0V"},
                { nombre: "apoyo de matemáticas", url: "https://dlsi.ua.es/~oncina/am.pdf"},
                { nombre: "apoyo de programación", url: "https://dlsi.ua.es/~oncina/ap.pdf"},
            ]
        },
        {
            titulo: "AC",
            enlaces: [
                { nombre: "ac.pdf", url: "../documentos/todo-ac.pdf" },
            ]
        },
        {
            titulo: "REDES",
            enlaces: [
                { nombre: "redes.pdf", url: "documentos/todo-redes.pdf" },
                { nombre: "libro naranja", url: "documentos/libro-naranja.pdf" },
                { nombre: "libro tocho", url: "documentos/libro-tocho.pdf" },
                { nombre: "protocolos", url: "documentos/protocolos_IEEE.md" },
            ]
        },
        {
            titulo: "HADA",
            enlaces: [
                { nombre: "hada.pdf", url: "documentos/hada.pdf" },
                { nombre: "hada resumen", url: "documentos/hada-resumen.pdf" },
            ]
        },
        {
            titulo: "DBD",
            enlaces: [
                { nombre: "puerto oracle", url: "https://dbd.dlsi.ua.es/abrirpuertooracle.php" },
            ]
        },
        {
            titulo: "SD",
            enlaces: [
                { nombre: "sd.pdf", url: "documentos/sd.pdf" },
                { nombre: "todo sd", url: "https://sd-apuntes.netlify.app/"},
            ]
        }
    ];

    const seccionesContainer = document.getElementById('secciones-container');

    secciones.forEach(seccion => {
        const seccionDiv = document.createElement('div');
        seccionDiv.classList.add('seccion');

        const titulo = document.createElement('h2');
        titulo.textContent = seccion.titulo;
        seccionDiv.appendChild(titulo);

        const lista = document.createElement('ul');
        seccion.enlaces.forEach(enlace => {
            const item = document.createElement('li');
            const link = document.createElement('a');
            link.href = enlace.url;
            link.textContent = enlace.nombre;
            item.appendChild(link);
            lista.appendChild(item);
        });
        seccionDiv.appendChild(lista);
        seccionesContainer.appendChild(seccionDiv);
    });
});
